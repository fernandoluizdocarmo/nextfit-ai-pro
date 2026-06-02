#!/bin/bash
# setup.sh - Script de Setup Automático para treinox.ai
# Uso: ./setup.sh

echo "🏋️ treinox.ai - Setup Automático"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar Node.js
echo "📋 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    echo "   Instale em: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js $NODE_VERSION${NC}"

# 2. Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
else
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi

# 3. Criar .env se não existir
echo ""
echo "🔐 Configurando variáveis de ambiente..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ .env criado${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
    echo "   Abra .env e preencha GROQ_API_KEY"
    echo "   Obtenha em: https://console.groq.com"
    echo ""
else
    echo -e "${GREEN}✅ .env já existe${NC}"
fi

# 4. Verificar se Groq key está configurada
if grep -q "gsk_seu_valor_aqui" .env; then
    echo -e "${YELLOW}⚠️  Groq key ainda não configurada${NC}"
    echo "   Abra .env e atualize GROQ_API_KEY"
else
    echo -e "${GREEN}✅ Groq key configurada${NC}"
fi

# 5. Criar .gitignore se não existir
if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Build outputs
dist/
build/

# Testing
coverage/
.nyc_output/

# Misc
ai_test_output.json
EOF
    echo -e "${GREEN}✅ .gitignore criado${NC}"
fi

# 6. Verificar Service Worker
echo ""
echo "🌐 Verificando PWA..."
if [ -f "sw.js" ] && [ -f "manifest.json" ]; then
    echo -e "${GREEN}✅ Service Worker e manifest encontrados${NC}"
else
    echo -e "${RED}❌ PWA files faltando${NC}"
fi

# 7. Resumo final
echo ""
echo "=================================="
echo -e "${GREEN}✅ Setup Completo!${NC}"
echo "=================================="
echo ""
echo "Próximos passos:"
echo ""
echo "1️⃣  Configurar Groq API Key:"
echo "   nano .env  (ou abra em seu editor)"
echo "   Cole sua key em GROQ_API_KEY"
echo ""
echo "2️⃣  Iniciar o servidor:"
echo "   npm start"
echo ""
echo "3️⃣  Abrir no navegador:"
echo "   http://localhost:3000"
echo ""
echo "4️⃣  Rodar testes (no console):"
echo "   runAllTests()"
echo ""
echo "📚 Documentação:"
echo "   - README_NOVO.md - Como usar"
echo "   - GUIA_SEGURANCA.md - Best practices"
echo "   - MELHORIAS_APLICADAS.md - Mudanças técnicas"
echo ""
echo "🚀 Ready to train! 💪"
echo ""
