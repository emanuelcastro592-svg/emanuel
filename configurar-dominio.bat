@echo off
echo ========================================
echo   Configurar Dominio: personalsuper2.com.br
echo ========================================
echo.

REM Verificar se .env existe
if not exist ".env" (
    echo Criando arquivo .env...
    (
        echo PORT=5000
        echo NODE_ENV=production
        echo JWT_SECRET=seu-secret-key-super-seguro-aqui-mude-em-producao
        echo.
        echo DOMAIN=personalsuper2.com.br
        echo CLIENT_URL=https://personalsuper2.com.br
        echo API_URL=https://personalsuper2.com.br/api
    ) > .env
    echo Arquivo .env criado!
) else (
    echo Arquivo .env ja existe.
    echo.
    echo Adicione estas linhas ao seu .env:
    echo DOMAIN=personalsuper2.com.br
    echo CLIENT_URL=https://personalsuper2.com.br
    echo API_URL=https://personalsuper2.com.br/api
)

echo.
echo Verificando client/.env...
if not exist "client\.env" (
    echo Criando arquivo client/.env...
    (
        echo REACT_APP_API_URL=https://personalsuper2.com.br/api
    ) > client\.env
    echo Arquivo client/.env criado!
) else (
    echo Arquivo client/.env ja existe.
    echo.
    echo Adicione esta linha ao seu client/.env:
    echo REACT_APP_API_URL=https://personalsuper2.com.br/api
)

echo.
echo ========================================
echo   Configuracao Concluida!
echo ========================================
echo.
echo IMPORTANTE:
echo 1. Configure o DNS do seu dominio para apontar para o IP do servidor
echo 2. Configure SSL/HTTPS (Let's Encrypt recomendado)
echo 3. Faca o build do React: cd client ^&^& npm run build
echo 4. Reinicie o servidor
echo.
echo Veja o guia completo em: GUIA_DOMINIO_COMPLETO.md
echo.
pause

