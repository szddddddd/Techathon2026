"""Upload checked local installers to a draft GitHub Release, then publish it.

Usage: python scripts/publish-release.py [--publish]
Uses GH_TOKEN/GITHUB_TOKEN or the Git credential helper; never prints credentials.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
import os
from pathlib import Path
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
REPO = "szddddddd/Techathon2026"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publish", action="store_true", help="Publish after all assets upload; otherwise keep draft.")
    parser.add_argument("--stage-parts", action="store_true", help="Stage 16 MiB parts for the assemble-release workflow; never publishes.")
    args = parser.parse_args()
    manifest = json.loads((ROOT / "output/releases/release-manifest.json").read_text(encoding="utf-8"))
    current = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    if current != manifest["commit"] or subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT, text=True).strip():
        raise SystemExit("Release manifest must match a clean source commit.")
    for asset in manifest["files"]:
        file = ROOT / "output/releases" / asset["name"]
        with file.open("rb") as stream:
            digest = hashlib.file_digest(stream, "sha256").hexdigest()
        if digest != asset["sha256"] or file.stat().st_size != asset["bytes"]:
            raise SystemExit("Artifact checksum mismatch: " + asset["name"])
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if not token:
        result = subprocess.run(["git", "credential", "fill"], cwd=ROOT,
            input="protocol=https\nhost=github.com\npath=" + REPO + ".git\n\n",
            text=True, capture_output=True, timeout=30,
            env={**os.environ, "GIT_TERMINAL_PROMPT": "0", "GCM_INTERACTIVE": "Never"})
        values = dict(line.split("=", 1) for line in result.stdout.splitlines() if "=" in line)
        token = values.get("password")
    if not token:
        raise SystemExit("GitHub publishing credential unavailable.")
    headers = {"Authorization": "Bearer " + token, "Accept": "application/vnd.github+json", "User-Agent": "WeRoam-release", "Cache-Control": "no-cache"}

    def api(route, method="GET", data=None):
        request = urllib.request.Request("https://api.github.com/repos/" + REPO + route,
            headers={**headers, "Content-Type": "application/json"}, method=method,
            data=None if data is None else json.dumps(data).encode())
        with urllib.request.urlopen(request, timeout=60) as response:
            body = response.read()
            return json.loads(body) if body else None

    tag = manifest["tag"]
    body = (ROOT / "docs/releases" / (tag + ".md")).read_text(encoding="utf-8")
    releases = api("/releases?per_page=100")
    release = next((r for r in releases if r["tag_name"] == tag), None)
    if release and not release["draft"]:
        raise SystemExit("Release is already published; existing downloads will not be replaced.")
    if release is None:
        release = api("/releases", "POST", {"tag_name": tag, "target_commitish": manifest["commit"],
            "name": "WeRoam " + tag + " · Windows / Android", "body": body, "draft": True, "prerelease": "-" in tag})
    elif release["target_commitish"] != manifest["commit"]:
        if release["assets"]:
            raise SystemExit("Existing draft with assets targets another source commit.")
        release = api("/releases/" + str(release["id"]), "PATCH", {"tag_name": tag, "target_commitish": manifest["commit"]})
    artifacts = [asset["name"] for asset in manifest["files"]] + ["SHA256SUMS.txt", "release-manifest.json"]
    if args.stage_parts:
        existing = {asset["name"]: asset for asset in release["assets"]}

        def upload_part(name, data):
            digest = "sha256:" + hashlib.sha256(data).hexdigest()
            old = existing.get(name)
            if old:
                if old.get("digest") != digest or old["size"] != len(data):
                    raise SystemExit("Staged asset differs: " + name)
                print("Already staged:", name, flush=True)
                return
            for attempt in range(4):
                request = urllib.request.Request(release["upload_url"].split("{")[0] + "?name=" + urllib.parse.quote(name),
                    headers={**headers, "Content-Type": "application/octet-stream"}, data=data)
                try:
                    with urllib.request.urlopen(request, timeout=90) as response:
                        result = json.load(response)
                    break
                except (urllib.error.URLError, ConnectionError, TimeoutError):
                    current_assets = api("/releases/" + str(release["id"]) + "/assets?per_page=100&refresh=" + str(time.time_ns()))
                    saved = next((a for a in current_assets if a["name"] == name), None)
                    if saved and saved.get("digest") == digest and saved["size"] == len(data):
                        result = saved
                        break
                    if saved:
                        if saved.get("state") != "starter" or saved["size"] != 0:
                            raise SystemExit("Unconfirmed staged asset; inspect before replacing: " + name)
                        api("/releases/assets/" + str(saved["id"]), "DELETE")
                    if attempt == 3:
                        raise SystemExit("Upload interrupted; rerun to resume verified parts: " + name)
                    print("Retrying interrupted part:", name, flush=True)
                    time.sleep(2)
            if result.get("digest") != digest or result["size"] != len(data):
                raise SystemExit("Staged asset verification failed: " + name)
            print("Staged:", name, len(data), "bytes", flush=True)

        for name in artifacts[-2:]:
            upload_part(name, (ROOT / "output/releases" / name).read_bytes())
        jobs = []
        part_bytes = 16 * 1024 * 1024
        for asset in manifest["files"]:
            for index, offset in enumerate(range(0, asset["bytes"], part_bytes)):
                jobs.append((asset["name"], index, offset))

        def stage(job):
            name, index, offset = job
            with (ROOT / "output/releases" / name).open("rb") as stream:
                stream.seek(offset)
                data = stream.read(part_bytes)
            upload_part(f"{name}.part-{index:03d}", data)

        with ThreadPoolExecutor(max_workers=2) as pool:
            list(pool.map(stage, jobs))
        print("All parts verified. Dispatch assemble-release.yml on this source commit, then use --publish.")
        return
    for name in artifacts:
        file = ROOT / "output/releases" / name
        existing = next((a for a in release["assets"] if a["name"] == name), None)
        if existing:
            with file.open("rb") as stream:
                digest = "sha256:" + hashlib.file_digest(stream, "sha256").hexdigest()
            if existing.get("digest") == digest:
                print("Already uploaded:", name, flush=True)
                continue
            raise SystemExit("Existing draft asset differs or has no digest; inspect before replacing: " + name)
        url = release["upload_url"].split("{")[0] + "?name=" + urllib.parse.quote(name)
        print("Uploading:", name, file.stat().st_size, "bytes", flush=True)
        # curl streams large files without a Python SSL send loop. Authentication
        # goes through stdin, never the process arguments, disk, or command log.
        config = "\n".join('header = "' + key + ": " + value + '"' for key, value in headers.items()) + "\n"
        upload = subprocess.run(["curl.exe" if os.name == "nt" else "curl", "--config", "-",
            "--silent", "--show-error", "--fail-with-body", "--connect-timeout", "30", "--max-time", "600",
            "--request", "POST", "--header", "Content-Type: application/octet-stream", "--data-binary", "@" + str(file), url],
            input=config, text=True, capture_output=True, timeout=620)
        if upload.returncode:
            raise SystemExit("Asset upload failed; draft preserved. curl exit " + str(upload.returncode))
        result = json.loads(upload.stdout)
        with file.open("rb") as stream:
            digest = "sha256:" + hashlib.file_digest(stream, "sha256").hexdigest()
        if result.get("digest") != digest or result["size"] != file.stat().st_size:
            raise SystemExit("Uploaded asset verification failed: " + name)
    release = api("/releases/" + str(release["id"]))
    if not set(artifacts).issubset(a["name"] for a in release["assets"]):
        raise SystemExit("Release is missing required assets.")
    if args.publish:
        release = api("/releases/" + str(release["id"]), "PATCH", {"draft": False, "body": body})
    print(json.dumps({"url": release["html_url"], "draft": release["draft"], "tag": tag}, ensure_ascii=True))


if __name__ == "__main__":
    main()
