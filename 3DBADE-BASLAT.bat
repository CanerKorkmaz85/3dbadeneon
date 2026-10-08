@echo off
cd /d "%~dp0"
title 3Dbade Neon Baslatici

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-local.ps1"

if errorlevel 1 (
  echo.
  echo Baslatici beklenmedik sekilde kapandi.
  echo Bu pencerenin fotografini paylasabilirsiniz.
  pause
)
