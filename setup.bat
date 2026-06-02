@echo off
REM setup.bat - Script de Setup Automático para Windows
REM Uso: setup.bat

setlocal enabledelayedexpansion
cls

echo 🏋️ treinox.ai - Setup Automatico (Windows)
echo ==========================================
echo.

REM 1. Verificar Node.js
echo 📋 Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js nao encontrado
    echo    Instale em: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION%

REM 2. Instalar dependências
echo.
echo 📦 Instalando dependencias...
call npm install

if %ERRORLEVEL% neq 0 (
    echo ❌ Erro ao instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas

REM 3. Criar .env se não existir
echo.
echo 🔐 Configurando variaveis de ambiente...

if not exist .env (
    copy .env.example .env
    echo ✅ .env criado
    echo.
    echo ⚠️  IMPORTANTE:
    echo    Abra .env e preencha GROQ_API_KEY
    echo    Obtenha em: https://console.groq.com
    echo.
) else (
    echo ✅ .env ja existe
)

REM 4. Resumo final
echo.
echo ==========================================
echo ✅ Setup Completo!
echo ==========================================
echo.
echo Proximos passos:
echo.
echo 1️⃣  Configurar Groq API Key:
echo    notepad .env  (ou abra em seu editor)
echo    Cole sua key em GROQ_API_KEY
echo.
echo 2️⃣  Iniciar o servidor:
echo    npm start
echo.
echo 3️⃣  Abrir no navegador:
echo    http://localhost:3000
echo.
echo 4️⃣  Rodar testes (no console):
echo    runAllTests()
echo.
echo 📚 Documentacao:
echo    - README_NOVO.md - Como usar
echo    - GUIA_SEGURANCA.md - Best practices
echo    - MELHORIAS_APLICADAS.md - Mudancas tecnicas
echo.
echo 🚀 Ready to train! 💪
echo.

pause
