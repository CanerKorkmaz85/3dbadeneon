@echo off
cd /d "%~dp0"
title 3Dbade Neon Baslatici

echo.
echo 3Dbade Neon guncelleniyor...
git pull

echo.
echo Yerel editor servisi baslatiliyor...
start "3Dbade Editor" cmd /k "npm run editor"

echo Yerel site baslatiliyor...
start "3Dbade Site" cmd /k "npm run dev"

echo.
echo Sunucularin acilmasi bekleniyor...
timeout /t 10 /nobreak >nul
start "" http://localhost:3000/yonetim/urunler

echo.
echo Iki siyah pencere acik kalmali:
echo - 3Dbade Editor
echo - 3Dbade Site
pause
