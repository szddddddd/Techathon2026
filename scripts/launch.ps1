param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
try {
  if (!(Get-Command node -ErrorAction SilentlyContinue) -or !(Get-Command npm.cmd -ErrorAction SilentlyContinue)) { throw 'Install Node.js 22 LTS or newer, then double-click the launcher again: https://nodejs.org/' }
  $nodeVersion = & node --version
  if ([int]($nodeVersion.TrimStart('v').Split('.')[0]) -lt 22) { throw 'Node.js 22 LTS or newer is required.' }
  if (!(Test-Path -LiteralPath 'node_modules\esbuild\package.json') -or !(Test-Path -LiteralPath 'node_modules\electron\package.json')) {
    Write-Host 'Preparing dependencies (first launch needs internet)...'
    & npm.cmd ci --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw 'Dependency install failed. Check the network and try again.' }
  }
  if (!(Test-Path -LiteralPath 'node_modules\electron\dist\electron.exe')) {
    & node node_modules/electron/install.js
    if ($LASTEXITCODE -ne 0) { throw 'Desktop pet runtime download failed. Check the network and try again.' }
  }
  & npm.cmd run build
  if ($LASTEXITCODE -ne 0) { throw 'Build failed. See the output above.' }
  & (Join-Path $PSScriptRoot 'install-desktop-launcher.ps1')
  $response = $null
  try { $response = Invoke-WebRequest 'http://127.0.0.1:8080/' -UseBasicParsing -TimeoutSec 2 } catch {}
  if ($response) {
    if ($response.Content -notmatch 'name="forest-version"') { throw 'Port 8080 is already used by another app. Close that server and retry.' }
    if (!$NoBrowser) { Start-Process 'http://localhost:8080/' -WindowStyle Hidden }
    Write-Host 'The current Forest Letters page is ready: http://localhost:8080/'
    exit 0
  }
  if (!$NoBrowser) {
    # This helper waits until the real page responds before opening the browser.
    $openScript = '$ErrorActionPreference="SilentlyContinue"; for($i=0;$i -lt 30;$i++){ try{$r=Invoke-WebRequest http://127.0.0.1:8080/ -UseBasicParsing -TimeoutSec 1;if($r.StatusCode -eq 200){Start-Process http://localhost:8080/ -WindowStyle Hidden;break}}catch{};Start-Sleep -Milliseconds 300}'
    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($openScript))
    Start-Process powershell.exe -ArgumentList '-NoProfile','-EncodedCommand',$encoded -WindowStyle Hidden
  }
  Write-Host 'Opening the latest page. Keep this server window open; Ctrl+C stops it.'
  & node scripts/serve.mjs
  if ($LASTEXITCODE -ne 0) { throw 'The local web server stopped with an error.' }
} catch {
  Write-Host $_.Exception.Message -ForegroundColor Red
  exit 1
}
