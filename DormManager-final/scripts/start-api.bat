@echo off
REM =====================================================
REM Start DormManager Spring Boot API on port 8081
REM =====================================================

echo.
echo ===============================================
echo Starting DormManager API...
echo ===============================================
echo.

REM Navigate to project root
cd /d "%~dp0\.."

REM Check if Maven is available
where mvn >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Maven is not installed or not in PATH
    exit /b 1
)

REM Start Spring Boot application
echo 🚀 Launching Spring Boot API on port 8081...
echo.
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"

REM Keep the window open
pause
