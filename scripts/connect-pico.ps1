param([string]$Serial)
$ErrorActionPreference='Stop'
$repo=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repo
$adb=Join-Path $repo '.cache/android-tools/sdk/platform-tools/adb.exe'
if (-not (Test-Path -LiteralPath $adb)) {
  $command=Get-Command adb -ErrorAction SilentlyContinue
  if (-not $command) { throw 'ADB missing. Install Android SDK platform-tools or Meta Quest Developer Hub.' }
  $adb=$command.Source
}
$devices=@(& $adb devices | Select-String '^([^\s]+)\s+device$' | ForEach-Object { $_.Matches.Groups[1].Value })
if ($Serial) {
  if ($Serial -notin $devices) { throw 'Selected headset is not connected/authorized. Confirm USB debugging in the headset.' }
} else {
  $headsets=@($devices | Where-Object {
    $maker=(& $adb -s $_ shell getprop ro.product.manufacturer) -join ' '
    $model=(& $adb -s $_ shell getprop ro.product.model) -join ' '
    "$maker $model" -match 'PICO|Neo ?3|Oculus|Meta|Quest'
  })
  if ($headsets.Count -ne 1) { throw 'Connect one PICO or Meta Quest headset by USB, enable developer mode/USB debugging and accept the debugging prompt. For multiple devices use -Serial.' }
  $Serial=$headsets[0]
}
$port=(& node --input-type=module -e "import config from './desktop/runtime-config.cjs'; console.log(config.webPort(process.cwd()));").Trim()
try { $response=Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$port/" -TimeoutSec 5 } catch { throw 'Start the project first: npm start' }
if ($response.StatusCode -ne 200) { throw 'Project server is not ready.' }
& $adb -s $Serial reverse "tcp:$port" "tcp:$port"
if ($LASTEXITCODE -ne 0) { throw 'USB port forwarding failed.' }
$url="http://localhost:$port/?vr=1"
& $adb -s $Serial shell am start -a android.intent.action.VIEW -d $url
if ($LASTEXITCODE -ne 0) { throw "Open the headset browser manually and visit $url" }
Write-Output "Opened $url on the connected headset. Choose a scene, then press Enter VR."
Write-Output "Remove USB forwarding: adb -s $Serial reverse --remove tcp:$port"
