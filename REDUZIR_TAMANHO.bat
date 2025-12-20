@echo off
echo ========================================
echo   Reduzindo Tamanho para Upload
echo ========================================
echo.
echo Este script vai criar um ZIP sem arquivos
echo desnecessarios (node_modules, build, etc.)
echo.

REM Navegar para o diretório do projeto
cd /d "%~dp0"

REM Criar pasta temporária
if exist "temp_upload" rmdir /s /q "temp_upload"
mkdir "temp_upload"

echo Copiando arquivos importantes...
echo.

REM Copiar arquivos principais
xcopy /E /I /Y "server" "temp_upload\server\" >nul
xcopy /E /I /Y "client" "temp_upload\client\" >nul

REM Excluir node_modules e build do client
if exist "temp_upload\client\node_modules" rmdir /s /q "temp_upload\client\node_modules"
if exist "temp_upload\client\build" rmdir /s /q "temp_upload\client\build"

REM Copiar arquivos importantes da raiz
copy "package.json" "temp_upload\" >nul 2>&1
copy "package-lock.json" "temp_upload\" >nul 2>&1
copy "README.md" "temp_upload\" >nul 2>&1
copy "Procfile" "temp_upload\" >nul 2>&1
copy "render.yaml" "temp_upload\" >nul 2>&1
copy "ecosystem.config.js" "temp_upload\" >nul 2>&1
copy ".gitignore" "temp_upload\" >nul 2>&1

echo.
echo Criando ZIP...
cd temp_upload
powershell -Command "Compress-Archive -Path * -DestinationPath ..\NEW-APP-LIGHT.zip -Force"
cd ..

echo.
echo ========================================
echo   ZIP Criado: NEW-APP-LIGHT.zip
echo ========================================
echo.
echo Este ZIP contem apenas os arquivos
echo necessarios para o deploy!
echo.
echo Agora faca upload deste ZIP no GitHub.
echo.
pause

