$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$siteUrl = "http://localhost:3000"
$siteHealthUrl = "http://127.0.0.1:3000/yonetim/urunler"
$editorUrl = "http://127.0.0.1:3002/health"

function Write-Title([string]$message) {
  Write-Host ""
  Write-Host $message -ForegroundColor Cyan
}

function Test-Url([string]$url, [int]$timeoutSeconds = 2) {
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec $timeoutSeconds
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

function Test-Port([int]$port) {
  return $null -ne (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue)
}

function Start-ServiceWindow([string]$title, [string]$npmScript, [string]$failureMessage) {
  $escapedRoot = $projectRoot.Replace("'", "''")
  $escapedTitle = $title.Replace("'", "''")
  $escapedFailure = $failureMessage.Replace("'", "''")
  $command = @"
`$Host.UI.RawUI.WindowTitle = '$escapedTitle'
Set-Location -LiteralPath '$escapedRoot'
& npm.cmd run $npmScript
Write-Host ''
Write-Host '$escapedFailure' -ForegroundColor Red
Read-Host 'Bu pencereyi kapatmak icin Enter tusuna basin'
"@
  $encodedCommand = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($command))

  Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoLogo",
    "-NoExit",
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-EncodedCommand", $encodedCommand
  )
}

function Wait-ForUrl([string]$url, [int]$seconds) {
  for ($attempt = 1; $attempt -le $seconds; $attempt += 1) {
    if (Test-Url $url) {
      return $true
    }
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 1
  }
  Write-Host ""
  return $false
}

try {
  Set-Location -LiteralPath $projectRoot
  $Host.UI.RawUI.WindowTitle = "3Dbade Neon Baslatici"

  Write-Host "========================================" -ForegroundColor Magenta
  Write-Host "       3Dbade Neon baslatiliyor" -ForegroundColor Magenta
  Write-Host "========================================" -ForegroundColor Magenta

  if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) {
    throw "Node.js bulunamadi. Node.js kurulumu kontrol edilmeli."
  }
  if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    throw "npm bulunamadi. Node.js kurulumu kontrol edilmeli."
  }
  if (-not (Test-Path -LiteralPath (Join-Path $projectRoot "node_modules\next"))) {
    Write-Title "Ilk kurulum yapiliyor. Bu islem birkac dakika surebilir..."
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) {
      throw "Gerekli dosyalar yuklenemedi. Internet baglantisini kontrol edip tekrar deneyin."
    }
  }

  Write-Title "Yerel servisler kontrol ediliyor..."

  if (Test-Port 3002) {
    if (Test-Url $editorUrl) {
      Write-Host "Editor servisi zaten acik." -ForegroundColor Green
    } else {
      throw "3002 numarali port baska bir program tarafindan kullaniliyor. O programi kapatip tekrar deneyin."
    }
  } else {
    Write-Host "Editor servisi baslatiliyor..."
    Start-ServiceWindow "3Dbade Editor" "editor" "Editor servisi durdu. Yukaridaki hata mesajini kontrol edin."
  }

  if (Test-Port 3000) {
    if (Test-Url $siteHealthUrl) {
      Write-Host "Site zaten acik." -ForegroundColor Green
    } else {
      throw "3000 numarali port baska bir program tarafindan kullaniliyor. O programi kapatip tekrar deneyin."
    }
  } else {
    Write-Host "Site baslatiliyor..."
    Start-ServiceWindow "3Dbade Site" "dev:local" "Site sunucusu durdu. Yukaridaki hata mesajini kontrol edin."
  }

  Write-Title "Sitenin hazir olmasi bekleniyor..."
  if (-not (Wait-ForUrl $siteHealthUrl 60)) {
    throw "Site 60 saniye icinde acilamadi. '3Dbade Site' penceresindeki hata mesajini kontrol edin."
  }

  if (-not (Wait-ForUrl $editorUrl 15)) {
    throw "Editor servisi acilamadi. '3Dbade Editor' penceresindeki hata mesajini kontrol edin."
  }

  Write-Host ""
  Write-Host "Site hazir. Yonetim sayfalari aciliyor..." -ForegroundColor Green
  Start-Process "$siteUrl/yonetim/urunler"
  Start-Process "$siteUrl/yonetim/fiyatlar"
  Start-Process "$siteUrl/yonetim/urun-onizleme"

  Write-Host ""
  Write-Host "3Dbade Site ve 3Dbade Editor pencerelerini calisirken kapatmayin."
  Start-Sleep -Seconds 4
} catch {
  Write-Host ""
  Write-Host "BASLATMA BASARISIZ" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Bu pencere acik kalacak; hata mesajinin fotografini paylasabilirsiniz."
  Read-Host "Pencereyi kapatmak icin Enter tusuna basin"
  exit 1
}
