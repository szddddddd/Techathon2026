param([string]$Serial)
$ErrorActionPreference='Stop'
$repo=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repo
$adb=Join-Path $repo '.cache/android-tools/sdk/platform-tools/adb.exe'
if (-not (Test-Path -LiteralPath $adb)) {
    $command=Get-Command adb -ErrorAction SilentlyContinue
    if (-not $command) { throw 'ADB missing. Install PICO Developer Center or Android SDK platform-tools.' }
    $adb=$command.Source
}
$devices=@(& $adb devices | Select-String '^([^\s]+)\s+device$' | ForEach-Object { $_.Matches.Groups[1].Value })
if ($Serial) {
    if ($Serial -notin $devices) { throw 'Selected device is not connected/authorized. Check the USB debugging prompt in the headset.' }
} else {
    $pico=@($devices | Where-Object {
        $maker=(& $adb -s $_ shell getprop ro.product.manufacturer) -join ' '
        $model=(& $adb -s $_ shell getprop ro.product.model) -join ' '
        "$maker $model" -match 'PICO|Neo ?3'
    })
    if ($pico.Count -ne 1) { throw 'Connect one PICO headset by USB, enable developer mode/USB debugging and accept the debugging prompt. For multiple devices use -Serial.' }
    $Serial=$pico[0]
}
$port=(& node --input-type=module -e "import config from './desktop/runtime-config.cjs'; console.log(config.webPort(process.cwd()));").Trim()
try { $response=Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$port/" -TimeoutSec 5 } catch { throw 'Start the project first: npm start' }
if ($response.StatusCode -ne 200) { throw 'Project server is not ready.' }
& $adb -s $Serial reverse "tcp:$port" "tcp:$port"
if ($LASTEXITCODE -ne 0) { throw 'USB port forwarding failed.' }
$url="http://localhost:$port/?vr=1"
& $adb -s $Serial shell am start -a android.intent.action.VIEW -d $url
if ($LASTEXITCODE -ne 0) { throw "Open PICO Browser manually and visit $url" }
Write-Output "Open $url in PICO Browser, choose a scene, then press Enter VR."
Write-Output "Remove USB forwarding: adb -s $Serial reverse --remove tcp:$port"
