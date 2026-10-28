@echo off
cd /d "%~dp0"
title 3DBadeNeon Urun Ekleme

echo 3DBadeNeon urun ekleme sistemi aciliyor...

if not exist "node_modules" (
  echo Gerekli dosyalar hazirlaniyor. Lutfen bekleyin...
  call npm install
  if errorlevel 1 goto hata
)

start "3DBade Editor - KAPATMAYIN" cmd /k "cd /d ""%~dp0"" && npm run editor"

echo Urun paneli hazirlaniyor...
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000/yonetim/urunler"

echo.
echo Urun ekleme sayfasi acildi.
echo Acilan siyah pencereyi isiniz bitene kadar kapatmayin.
timeout /t 4 /nobreak >nul
exit /b 0

:hata
echo.
echo Sistem baslatilamadi. Bu pencerenin ekran goruntusunu gonderin.
pause
