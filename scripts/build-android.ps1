param([switch]$SkipWebBuild)
$ErrorActionPreference='Stop'
$repo=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repo
$portable=Join-Path $repo '.cache/android-tools'
if (-not $env:JAVA_HOME) { $env:JAVA_HOME=(Get-ChildItem "$portable/java" -Directory | Select-Object -First 1).FullName }
if (-not $env:ANDROID_HOME) { $env:ANDROID_HOME=Join-Path $portable 'sdk' }
$gradle=Join-Path $portable 'gradle/gradle-8.13/bin/gradle.bat'
if (-not (Test-Path "$env:JAVA_HOME/bin/keytool.exe")) { throw 'JDK missing. See docs/ANDROID.md.' }
if (-not (Test-Path "$env:ANDROID_HOME/platforms/android-36/android.jar")) { throw 'Android SDK 36 missing. See docs/ANDROID.md.' }
if (-not (Test-Path $gradle)) { $gradle=Join-Path $repo 'android/gradlew.bat' }
if (-not (Test-Path $gradle)) { throw 'Gradle wrapper missing.' }
if (-not $SkipWebBuild) {
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Web build failed' }
    & node scripts/build-android-web.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Android asset build failed' }
}
$signing=Join-Path $repo '.android-signing'
New-Item -ItemType Directory -Force $signing | Out-Null
$signingProps=Join-Path $signing 'signing.properties'
$keyfile=Join-Path $signing 'weroam-demo.p12'
if ((Test-Path $keyfile) -ne (Test-Path $signingProps)) { throw 'Incomplete signing files. Restore both files; do not silently replace the signing identity.' }
if (-not (Test-Path $keyfile)) {
    $random=New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($random)
    $signingPassword=[Convert]::ToBase64String($random)
    # Keep the secret out of command text, stdout and the repository.
    $env:WEROAM_KEY_PASSWORD=$signingPassword
    & "$env:JAVA_HOME/bin/keytool.exe" -genkeypair -noprompt -storetype PKCS12 -keystore $keyfile -alias weroam-demo -storepass:env WEROAM_KEY_PASSWORD -keypass:env WEROAM_KEY_PASSWORD -keyalg RSA -keysize 3072 -validity 10000 -dname 'CN=WeRoam Demo,O=WeRoam,C=CN'
    if ($LASTEXITCODE -ne 0) { throw 'Signing key generation failed' }
    [IO.File]::WriteAllText($signingProps,"storePassword=$signingPassword`n")
    Remove-Item Env:WEROAM_KEY_PASSWORD
}
[IO.File]::WriteAllText((Join-Path $repo 'android/local.properties'),('sdk.dir='+$env:ANDROID_HOME.Replace('\','/')+"`n"))
& $gradle -p android --console=plain --no-daemon assembleRelease
if ($LASTEXITCODE -ne 0) { throw 'APK build failed' }
$apk=Join-Path $repo 'android/app/build/outputs/apk/release/app-release.apk'
& "$env:ANDROID_HOME/build-tools/35.0.0/apksigner.bat" verify --verbose $apk
if ($LASTEXITCODE -ne 0) { throw 'APK signature verification failed' }
$dest=Join-Path $repo 'downloads'
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item -LiteralPath $apk -Destination "$dest/WeRoam-1.3.1-android.apk" -Force
$stream=[IO.File]::OpenRead("$dest/WeRoam-1.3.1-android.apk")
try { $hash=([BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash($stream))).Replace('-','').ToLower() } finally { $stream.Dispose() }
[IO.File]::WriteAllText("$dest/WeRoam-1.3.1-android.apk.sha256","$hash  WeRoam-1.3.1-android.apk`n")
Write-Output "Signed APK: $dest/WeRoam-1.3.1-android.apk"
