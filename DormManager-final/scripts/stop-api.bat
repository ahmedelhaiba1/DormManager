@echo off
REM =====================================================
REM Stop DormManager API running on port 8081
REM =====================================================

echo.
echo ===============================================
echo Stopping DormManager API on port 8081...
echo ===============================================
echo.

REM Find and kill process on port 8081
for /f "tokens=5" %%a in ('netstat -ano ^| find ":8081"') do (
    if "%%a"=="" (
        echo ⚠️ No process found on port 8081
    ) else (
        echo 🛑 Killing process %%a on port 8081...
        taskkill /PID %%a /F >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo ✅ Process terminated successfully
        ) else (
            echo ⚠️ Could not terminate process or it doesn't exist
        )
    )
)

REM Alternative: Kill all java.exe processes (use cautiously)
REM taskkill /IM java.exe /F >nul 2>&1

echo.
echo Done.
echo.
