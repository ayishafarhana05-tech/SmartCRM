# SmartCRM — Java JDBC Backend Startup Script
# Run this script from the server/ folder: .\start.ps1
# KTU CS OOP 2024 Scheme

Write-Host ""
Write-Host "Starting SmartCRM Java JDBC Backend..." -ForegroundColor Cyan
Write-Host ""

$JAVA  = "C:\Users\MYCARE\jdk21\bin\java.exe"
if (-not (Test-Path $JAVA)) {
    $JAVA = "java"
}

$LIB_DIR = "lib"
$JAR     = "lib\sqlite-jdbc.jar"
$MAIN    = "com.smartcrm.server.CrmServer"

# Auto-download SQLite JDBC driver if not present
if (-not (Test-Path $JAR)) {
    Write-Host "Downloading SQLite JDBC driver from Maven Central..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $LIB_DIR | Out-Null
    Invoke-WebRequest -Uri "https://repo1.maven.org/maven2/org/xerial/sqlite-jdbc/3.45.1.0/sqlite-jdbc-3.45.1.0.jar" -OutFile $JAR
    Write-Host "Driver downloaded successfully." -ForegroundColor Green
}

& $JAVA -cp "$JAR;out" $MAIN
