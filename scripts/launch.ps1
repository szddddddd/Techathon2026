param([switch]$NoBrowser, [switch]$SkipProtocolInstall)
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
  $port = & node -e "console.log(require('./desktop/runtime-config.cjs').webPort(process.cwd()))"
  if ($LASTEXITCODE -ne 0) { throw 'Invalid web port configuration.' }
  $port = [int]$port
  $response = $null
  $available = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    try { $response = Invoke-WebRequest "http://127.0.0.1:$port/" -UseBasicParsing -TimeoutSec 1 } catch { $response = $null }
    if ($response -and $response.Content -match 'name="forest-version"') { break }
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
    try { $listener.Start(); $available = $true; break } catch { $port++ } finally { $listener.Stop() }
  }
  if (!$available -and !($response -and $response.Content -match 'name="forest-version"')) { throw 'No available web port found.' }
  $env:FOREST_WEB_PORT = "$port"
  @{webPort=$port} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $projectRoot '.forest-runtime.json') -Encoding UTF8
  if (!$SkipProtocolInstall) { & (Join-Path $PSScriptRoot 'install-desktop-launcher.ps1') }
  $webUrl = "http://localhost:$port/"
  if ($response -and $response.Content -match 'name="forest-version"') {
    if (!$NoBrowser) { Start-Process $webUrl -WindowStyle Hidden }
    Write-Host "The current WeRoam page is ready: $webUrl"
    exit 0
  }
  if (!$NoBrowser) {
    # This helper waits until the real page responds before opening the browser.
    $openScript = '$ErrorActionPreference="SilentlyContinue"; for($i=0;$i -lt 30;$i++){ try{$r=Invoke-WebRequest http://127.0.0.1:PORT/ -UseBasicParsing -TimeoutSec 1;if($r.Content -match ''name="forest-version"''){Start-Process http://localhost:PORT/ -WindowStyle Hidden;break}}catch{};Start-Sleep -Milliseconds 300}'.Replace('PORT', "$port")
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
