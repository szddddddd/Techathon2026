$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$electronExe = Join-Path $projectRoot 'node_modules\electron\dist\electron.exe'
if (!(Test-Path -LiteralPath $electronExe)) { throw 'Electron is missing. Run npm ci first.' }
$protocolKey = 'HKCU:\Software\Classes\forestletters'
$launchCommand = '"{0}" "{1}" --pet-only "%1"' -f $electronExe, $projectRoot
New-Item -Path $protocolKey -Force | Out-Null
Set-Item -LiteralPath $protocolKey -Value 'URL:Forest Letters Desktop Pet'
New-ItemProperty -LiteralPath $protocolKey -Name 'URL Protocol' -Value '' -PropertyType String -Force | Out-Null
New-Item -Path "$protocolKey\shell\open\command" -Force | Out-Null
Set-Item -LiteralPath "$protocolKey\shell\open\command" -Value $launchCommand
Write-Output 'Registered forestletters://pet for the current Windows user.'
