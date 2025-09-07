@echo off
echo ==========================================
echo    NIOE - Sistema de Inteligencia
echo    Instalacao e Configuracao
echo ==========================================

echo.
echo 1. Verificando PHP...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PHP nao encontrado!
    echo Instale o XAMPP primeiro.
    pause
    exit
)
echo ✅ PHP encontrado!

echo.
echo 2. Verificando Composer...
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Composer nao encontrado!
    echo Instale o Composer primeiro.
    pause
    exit
)
echo ✅ Composer encontrado!

echo.
echo 3. Instalando dependencias do Laravel...
composer install --no-dev --optimize-autoloader

echo.
echo 4. Copiando arquivo de configuracao...
if not exist .env (
    copy env.example .env
    echo ✅ Arquivo .env criado!
) else (
    echo ℹ️ Arquivo .env ja existe!
)

echo.
echo 5. Gerando chave da aplicacao...
php artisan key:generate

echo.
echo 6. Configurando cache...
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo.
echo 7. Executando migracoes...
php artisan migrate --force

echo.
echo 8. Populando dados iniciais...
php artisan db:seed

echo.
echo 9. Criando diretorios necessarios...
if not exist storage\logs mkdir storage\logs
if not exist storage\app\public mkdir storage\app\public
if not exist public\storage mkdir public\storage

echo.
echo 10. Configurando permissoes...
php artisan storage:link

echo.
echo ==========================================
echo    Instalacao Concluida com Sucesso!
echo ==========================================
echo.
echo Para iniciar o servidor:
echo php artisan serve
echo.
echo Acesse: http://localhost:8000
echo.
echo Credenciais:
echo admin@nioe.com / admin123
echo.
pause
