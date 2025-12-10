@echo off
REM =====================================================
REM Generate HTML Report from existing JMeter results
REM =====================================================

echo.
echo ===============================================
echo 📊 Generating JMeter HTML Report
echo ===============================================
echo.

REM Check if JMeter is installed
where jmeter >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ JMeter is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if results file exists
if not exist "%~dp0..\results\output.csv" (
    echo ❌ Results file not found: results\output.csv
    echo Please run start-test.bat first to generate test results
    pause
    exit /b 1
)

echo ✅ Found results file
echo.

REM Create new report folder
set report_folder=%~dp0..\results\report
if exist "%report_folder%" (
    echo Removing old report folder...
    rmdir /s /q "%report_folder%"
)

echo Generating HTML report...
echo.

REM Generate report
jmeter -g "%~dp0..\results\output.csv" ^
  -o "%report_folder%" ^
  -j "%~dp0..\results\jmeter-report.log"

echo.
echo =====================================
echo ✔️ Report generated successfully!
echo =====================================
echo.
echo 📂 Location: results\report\index.html
echo.

REM Open report
echo Opening report...
start "%report_folder%\index.html"

pause
