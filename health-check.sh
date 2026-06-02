#!/bin/bash
# health-check.sh - Health Check Script for treinox.ai
# Verifica se o app está funcionando corretamente

echo "🏥 treinox.ai - Health Check"
echo "============================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

CHECKS_PASSED=0
CHECKS_FAILED=0

# Helper functions
pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((CHECKS_PASSED++))
}

fail() {
    echo -e "${RED}❌ $1${NC}"
    ((CHECKS_FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Check Node.js
echo "📋 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    pass "Node.js $NODE_VERSION"
else
    fail "Node.js não encontrado"
fi
echo ""

# 2. Check npm
echo "📦 Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    pass "npm $NPM_VERSION"
else
    fail "npm não encontrado"
fi
echo ""

# 3. Check node_modules
echo "📚 Verificando dependências..."
if [ -d "node_modules" ]; then
    pass "node_modules encontrado"
else
    warn "node_modules não encontrado (execute: npm install)"
fi
echo ""

# 4. Check .env
echo "🔐 Verificando configuração..."
if [ -f ".env" ]; then
    if grep -q "GROQ_API_KEY" .env; then
        if grep -q "gsk_" .env; then
            pass "GROQ_API_KEY configurada"
        else
            warn "GROQ_API_KEY não tem valor válido"
        fi
    else
        fail ".env não tem GROQ_API_KEY"
    fi
else
    warn ".env não encontrado (copie de .env.example)"
fi
echo ""

# 5. Check required files
echo "📄 Verificando arquivos..."
REQUIRED_FILES=(
    "index.html"
    "app.js"
    "server.js"
    "sw.js"
    "style.css"
    "manifest.json"
    "package.json"
    "tests.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        pass "$file existe"
    else
        fail "$file não encontrado"
    fi
done
echo ""

# 6. Check documentation
echo "📚 Verificando documentação..."
DOCS=(
    "README_NOVO.md"
    "QUICK_START.md"
    "DEPLOY_GUIDE.md"
    "GUIA_SEGURANCA.md"
    "CONTRIBUTING.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        pass "$doc existe"
    else
        warn "$doc não encontrado"
    fi
done
echo ""

# 7. Check package.json validity
echo "🔍 Verificando package.json..."
if node -e "require('./package.json')" 2>/dev/null; then
    pass "package.json é válido"
else
    fail "package.json inválido"
fi
echo ""

# 8. Check if app can start (dry run)
echo "🚀 Testando inicialização do server..."
if timeout 5 node server.js &>/dev/null || [ $? -eq 124 ]; then
    pass "Server inicializa sem erro"
else
    fail "Server falhou ao inicializar"
fi
echo ""

# 9. Check localStorage test
echo "🧪 Verificando teste disponível..."
if grep -q "runAllTests" app.js; then
    pass "runAllTests() disponível"
else
    fail "runAllTests() não encontrada"
fi
echo ""

# 10. Check Service Worker
echo "🌐 Verificando Service Worker..."
if grep -q "CACHE_NAME" sw.js; then
    if grep -q "icon-192.png" sw.js; then
        pass "Service Worker cacheia icons"
    else
        warn "Service Worker não cacheia todos os icons"
    fi
else
    fail "Service Worker inválido"
fi
echo ""

# 11. Port check
echo "🔌 Verificando porta 3000..."
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    pass "Porta 3000 disponível"
else
    warn "Porta 3000 em uso"
fi
echo ""

# 12. Git check
echo "📝 Verificando Git..."
if [ -d ".git" ]; then
    if command -v git &> /dev/null; then
        COMMITS=$(git log --oneline 2>/dev/null | wc -l)
        pass "Git repositório com $COMMITS commits"
    else
        warn "Git não encontrado"
    fi
else
    warn "Não é um repositório Git"
fi
echo ""

# Summary
echo "============================"
echo "📊 RESULTADO"
echo "============================"
echo -e "${GREEN}✅ Passou: $CHECKS_PASSED${NC}"
echo -e "${RED}❌ Falhou: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 TUDO OK! App pronto para usar.${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. npm start"
    echo "2. Abrir http://localhost:3000"
    echo "3. runAllTests() no console"
    exit 0
else
    echo -e "${RED}⚠️  Corrija os erros acima e tente novamente${NC}"
    exit 1
fi
