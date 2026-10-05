@echo off
cd /d "%~dp0"
title 3Dbade Neon Yerel Editor

echo.
echo 3Dbade Neon guncelleniyor...
git pull

echo.
echo Yerel site baslatiliyor...
start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000/yonetim/urunler"

npm run dev

pause
