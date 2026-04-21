@echo off
cd /d "%~dp0"
node tools\build-web-data-from-csv.js
if errorlevel 1 (
  echo.
  echo 웹 데이터 반영 중 오류가 발생했습니다.
  pause
  exit /b 1
)
node tools\build-excel-html.js
if errorlevel 1 (
  echo.
  echo 엑셀 호환 파일 생성 중 오류가 발생했습니다.
  pause
  exit /b 1
)
echo.
echo CSV 내용을 웹 데이터와 엑셀 호환 파일로 반영했습니다.
pause
