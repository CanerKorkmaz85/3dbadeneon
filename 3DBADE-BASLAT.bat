@echo off
cd /d "%~dp0"
title 3Dbade Neon Baslatici

echo.
echo 3Dbade Neon guncelleniyor...
git pull

echo.
echo Yerel editor ve site birlikte baslatiliyor...
start "3Dbade Yerel Site" cmd /k "npm run dev"

echo.
echo Tarayici aciliyor...
timeout /t 8 /nobreak >nul
start "" http://localhost:3000/yonetim/urunler

echo.
echo Acilan "3Dbade Yerel Site" penceresini kapatma.
echo Isin bitince kapatabilirsin.
pause
