@echo off
REM =====================================================
REM DormManager Performance Tests with JMeter
REM =====================================================

echo.
echo ===============================================
echo 🔥 TESTS DE PERFORMANCE DORMMANAGER (JMeter)
echo ===============================================
echo.

REM Check if JMeter is installed
where jmeter >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ JMeter is not installed or not in PATH
    echo Please install JMeter and add it to your PATH environment variable
    echo Download from: https://jmeter.apache.org/download_jmeter.cgi
    pause
    exit /b 1
)

echo ✅ JMeter found
echo.

REM Stop API if it's already running
echo Stopping any existing API instances...
call "%~dp0stop-api.bat"

REM Wait a bit before starting new API
timeout /t 3 >nul

REM Start API in a new window
echo.
echo 🚀 Starting DormManager API (this may take 20-30 seconds)...
start "DormManager API" cmd /c "%~dp0start-api.bat"

REM Wait for API to fully start
echo ⏳ Waiting for API to start (20 seconds)...
timeout /t 20 >nul

REM Verify API is running
echo.
echo Verifying API is running...
for /f %%a in ('powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:8081/api/auth/login -Method Post -ContentType 'application/json' -Body '{\"email\":\"test@test.com\",\"password\":\"test\"}' -ErrorAction Stop; echo OK } catch { echo FAIL }"') do set API_STATUS=%%a

if "%API_STATUS%"=="FAIL" (
    echo ⚠️ API may still be starting or not responding on port 8081
    echo Proceeding with tests anyway...
) else (
    echo ✅ API is responding
)

echo.
echo =====================================
echo ▶️ Launching JMeter Tests...
echo =====================================
echo.

REM Create results directory if it doesn't exist
if not exist "%~dp0..\results" mkdir "%~dp0..\results"

REM Run JMeter test plan
REM -n: non-GUI mode
REM -t: test plan file
REM -l: output results file
REM -e: generate HTML report
REM -o: output folder for HTML report
jmeter -n ^
  -t "%~dp0..\jmeter\dormmanager-test.jmx" ^
  -l "%~dp0..\results\output.csv" ^
  -j "%~dp0..\results\jmeter.log" ^
  -e -o "%~dp0..\results\report"

echo.
echo =====================================
echo ✔️ Tests completed!
echo =====================================
echo.
echo 📊 Results generated:
echo    CSV Results:  results\output.csv
echo    HTML Report:  results\report\index.html
echo    Log File:     results\jmeter.log
echo.

REM Optionally open the HTML report
echo Would you like to open the HTML report? (Y/N)
set /p response=
if /i "%response%"=="Y" (
    start "%~dp0..\results\report\index.html"
)

echo.
echo 🛑 Stopping API...
call "%~dp0stop-api.bat"

echo.
echo Done!
pause
