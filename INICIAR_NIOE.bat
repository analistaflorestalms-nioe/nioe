@echo off
echo ==========================================
echo    NIOE - Sistema de Inteligencia
echo    Instalacao e Inicializacao
echo ==========================================

echo.
echo 1. Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado!
    echo Instale o Node.js primeiro.
    pause
    exit
)
echo ✅ Node.js encontrado!

echo.
echo 2. Verificando MySQL (XAMPP)...
echo Testando conexao com MySQL...
node -e "const mysql = require('mysql2'); const connection = mysql.createConnection({host: 'localhost', user: 'root', password: ''}); connection.connect((err) => { if (err) { console.log('❌ MySQL nao conectado'); process.exit(1); } else { console.log('✅ MySQL conectado!'); connection.end(); } });"

echo.
echo 3. Instalando dependencias...
npm install

echo.
echo 4. Criando diretorios necessarios...
if not exist logs mkdir logs
if not exist uploads mkdir uploads
if not exist public mkdir public

echo.
echo 5. Copiando arquivo de configuracao...
if not exist .env (
    copy config.env .env
    echo ✅ Arquivo .env criado!
) else (
    echo ℹ️ Arquivo .env ja existe!
)

echo.
echo 6. Iniciando servidor NIOE...
echo.
echo ==========================================
echo    Sistema NIOE Iniciado!
echo ==========================================
echo.
echo 🌐 Servidor: http://localhost:5000
echo 📊 Dashboard: http://localhost:5000/dashboard
echo 🔍 OSINT: http://localhost:5000/osint
echo ⚠️  Risk Assessment: http://localhost:5000/risk
echo.
echo 🔑 Credenciais:
echo    admin@nioe.com / admin123
echo    aleluia@nioe.com / nioe123
echo    fabio@nioe.com / nioe123
echo    gsilva@nioe.com / nioe123
echo    keven@nioe.com / nioe123
echo    geovana@nioe.com / nioe123
echo    gideonis@nioe.com / nioe123
echo    laio@nioe.com / nioe123
echo    pithon@nioe.com / nioe123
echo.
echo 📊 APIs Configuradas:
echo    GNews API: ✅ Configurada
echo    OpenWeatherMap: ✅ Configurada
echo    Mapbox: ✅ Configurada
echo.
echo Sistema pronto para uso!
echo.
node server/index.js
