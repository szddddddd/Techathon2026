param([int]$Port=8082)
$ErrorActionPreference='Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
$network=Get-NetIPConfiguration | Where-Object {$_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up'} | Select-Object -First 1
if(-not $network){throw 'No active LAN gateway found. Connect Wi-Fi or specify WEROAM_DOWNLOAD_URL manually.'}
$env:WEROAM_DOWNLOAD_PORT="$Port"
$env:WEROAM_DOWNLOAD_URL="http://$($network.IPv4Address.IPAddress):$Port/"
& node scripts/serve-android-download.mjs
