"""Reassemble staged draft installer parts on GitHub, verify, then remove parts.

Runs from the manually dispatched assemble-release workflow. Never publishes.
"""
import hashlib
import json
import math
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import urllib.request

REPO = "szddddddd/Techathon2026"
PART_BYTES = 16 * 1024 * 1024


def main():
    tag = sys.argv[1]
    token = os.environ["GH_TOKEN"]

    def api(route, method="GET"):
        request = urllib.request.Request("https://api.github.com/repos/" + REPO + route, method=method,
            headers={"Authorization": "Bearer " + token, "Accept": "application/vnd.github+json", "User-Agent": "WeRoam-release-assembly"})
        with urllib.request.urlopen(request, timeout=60) as response:
            body = response.read()
            return json.loads(body) if body else None

    release = next(r for r in api("/releases?per_page=100") if r["tag_name"] == tag)
    if not release["draft"]:
        raise SystemExit("Only draft releases may be assembled.")
    assets = {a["name"]: a for a in api("/releases/" + str(release["id"]) + "/assets?per_page=100")}
    with tempfile.TemporaryDirectory(prefix="weroam-release-") as folder:
        folder = Path(folder)

        def download(asset, destination):
            with destination.open("wb") as stream:
                subprocess.run(["gh", "api", "repos/" + REPO + "/releases/assets/" + str(asset["id"]),
                    "-H", "Accept: application/octet-stream"], stdout=stream, check=True)
            with destination.open("rb") as stream:
                digest = "sha256:" + hashlib.file_digest(stream, "sha256").hexdigest()
            if destination.stat().st_size != asset["size"] or digest != asset["digest"]:
                raise SystemExit("Staged asset failed verification: " + asset["name"])

        manifest_path = folder / "release-manifest.json"
        download(assets["release-manifest.json"], manifest_path)
        manifest = json.loads(manifest_path.read_text())
        head = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
        if manifest["tag"] != tag or manifest["commit"] != head:
            raise SystemExit("Staged manifest must match this workflow source commit and tag.")
        version = json.loads(Path("package.json").read_text())["version"]
        names = {f"WeRoam-{version}-windows-x64-setup.exe", f"WeRoam-{version}-android.apk"}
        if tag != "v" + version or {f["name"] for f in manifest["files"]} != names:
            raise SystemExit("Unexpected release tag or artifact names.")
        staged = []
        for file in manifest["files"]:
            name = file["name"]
            expected = "sha256:" + file["sha256"]
            if name in assets:
                if assets[name]["digest"] != expected or assets[name]["size"] != file["bytes"]:
                    raise SystemExit("Existing installer differs: " + name)
                continue
            assembled = folder / name
            with assembled.open("wb") as target:
                for index in range(math.ceil(file["bytes"] / PART_BYTES)):
                    asset = assets[f"{name}.part-{index:03d}"]
                    part = folder / "part"
                    download(asset, part)
                    with part.open("rb") as source:
                        while chunk := source.read(1024 * 1024):
                            target.write(chunk)
                    part.unlink()
                    staged.append(asset)
            with assembled.open("rb") as stream:
                digest = "sha256:" + hashlib.file_digest(stream, "sha256").hexdigest()
            if digest != expected or assembled.stat().st_size != file["bytes"]:
                raise SystemExit("Assembled installer failed verification: " + name)
            subprocess.run(["gh", "release", "upload", tag, str(assembled), "--repo", REPO], check=True)
            print("Uploaded complete installer:", name, flush=True)
        fresh = api("/releases/" + str(release["id"]))
        if not fresh["draft"]:
            raise SystemExit("Release was published during assembly; no draft assets will be removed.")
        fresh["assets"] = api("/releases/" + str(release["id"]) + "/assets?per_page=100")
        complete = {a["name"]: a for a in fresh["assets"]}
        for file in manifest["files"]:
            asset = complete[file["name"]]
            if asset["digest"] != "sha256:" + file["sha256"] or asset["size"] != file["bytes"]:
                raise SystemExit("Final remote installer failed verification.")
        # Both installers are confirmed before removing any temporary draft parts.
        for asset in fresh["assets"]:
            if any(asset["name"].startswith(name + ".part-") for name in names):
                api("/releases/assets/" + str(asset["id"]), "DELETE")
        print("Draft now contains verified complete installers; temporary parts removed.")


if __name__ == "__main__":
    main()
