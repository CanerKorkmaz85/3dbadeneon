@echo off
cd /d "%~dp0"
title 3Dbade Neon Baslatici

echo.
echo 3Dbade Neon guncelleniyor...
git pull

echo.
echo Yerel editor servisi baslatiliyor...
start "3Dbade Editor" cmd /k "node scripts/local-editor.mjs"

echo Yerel site baslatiliyor...
start "3Dbade Site" cmd /k "npm run dev:next"

echo.
echo Tarayici aciliyor...
timeout /t 7 /nobreak >nul
start "" http://localhost:3000/yonetim/urunler

echo.
echo Iki siyah pencere acik kalmali: 3Dbade Editor ve 3Dbade Site.
echo Isin bitince bu pencereleri kapatabilirsin.
pause
