@echo off
REM Checkstyle Analysis Runner for DormManager
REM Usage: run this script to analyze code for style violations

setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo ===============================================
echo     Checkstyle - Static Code Analysis
echo ===============================================
echo.

REM Run checkstyle analysis
echo Running Checkstyle analysis...
echo.

mvn checkstyle:check -q

if %errorlevel% equ 0 (
    echo.
    echo ✓ Checkstyle analysis completed!
    echo.
    echo Generate detailed report?
    echo Type 'y' to generate HTML report or press Enter to skip
    set /p choice=">> "
    
    if /i "!choice!"=="y" (
        echo.
        echo Generating HTML report...
        mvn checkstyle:checkstyle -q
        echo.
        echo ✓ Report generated: target/checkstyle-result.xml
        echo.
        echo Open report in browser? (y/n)
        set /p browser=">> "
        
        if /i "!browser!"=="y" (
            if exist "target\site\checkstyle.html" (
                start target\site\checkstyle.html
            ) else (
                echo Report file not found at target\site\checkstyle.html
            )
        )
    )
) else (
    echo.
    echo ✗ Checkstyle analysis failed!
    echo Run: mvn checkstyle:check -X
    echo to see detailed error messages
)

echo.
echo ===============================================
echo For more information, see CHECKSTYLE_GUIDE.md
echo ===============================================
echo.

endlocal
