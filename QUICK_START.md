# ⚡ Quick Start Guide - treinox.ai

**Tempo de setup: 5 minutos**

---

## 🚀 Opção 1: Setup Automático (Recomendado)

### Linux/Mac
```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/treinox-ai-pro.git
cd treinox-ai-pro

# 2. Rodar setup automático
chmod +x setup.sh
./setup.sh

# 3. Configurar Groq key
nano .env
# Preencha: GROQ_API_KEY=gsk_seu_valor

# 4. Iniciar
npm start
# Abra: http://localhost:3000
```

### Windows
```cmd
# 1. Clonar repositório
git clone https://github.com/seu-usuario/treinox-ai-pro.git
cd treinox-ai-pro

# 2. Rodar setup automático
setup.bat

# 3. Configurar Groq key
notepad .env
# Preencha: GROQ_API_KEY=gsk_seu_valor

# 4. Iniciar
npm start
# Abra: http://localhost:3000
```

---

## 🛠️ Opção 2: Setup Manual

### Pré-requisitos
- Node.js 18+ ([download](https://nodejs.org/))
- Git
- Groq API Key ([free](https://console.groq.com))

### Passos

```bash
# 1. Clonar e entrar na pasta
git clone https://github.com/seu-usuario/treinox-ai-pro.git
cd treinox-ai-pro

# 2. Instalar dependências
npm install

# 3. Criar arquivo .env
cp .env.example .env

# 4. Abrir .env e preencher
# GROQ_API_KEY=gsk_seu_valor_aqui

# 5. Iniciar servidor
npm start

# 6. Abrir browser
open http://localhost:3000
# Ou: http://localhost:3000 no seu navegador
```

---

## 📱 Primeiro Acesso

1. **Fazer Login** (qualquer email/senha em demo mode)
2. **Criar Ficha** (IA gera em 10-15s)
3. **Iniciar Treino** (rastreie suas séries)
4. **Consultar Histórico** (veja seu progresso)

---

## ✅ Validar Instalação

### 1. Testes
```javascript
// No console do browser (F12):
runAllTests();

// Resultado esperado:
// ✅ TODOS OS TESTES COMPLETADOS COM SUCESSO!
```

### 2. Offline
```
DevTools → Network → Offline
App continua funcionando ✅
```

### 3. Console
```
Procurar por mensagens verdes (✅)
Sem erros vermelhos (❌)
```

---

## 🌍 Deploy em 2 Minutos

### Render (Recomendado)

1. **Fork o repositório** no GitHub
2. **Conectar ao Render**:
   - Vá para https://dashboard.render.com
   - New Web Service
   - Conecte seu GitHub
3. **Configurar**:
   - Build: `npm install`
   - Start: `npm start`
   - Env: `GROQ_API_KEY=seu_valor`
4. **Deploy automático** ✅

### Heroku (Alternativa)

```bash
heroku create seu-app-name
heroku config:set GROQ_API_KEY=seu_valor
git push heroku main
```

---

## 🔑 Obter Groq API Key

1. Ir para https://console.groq.com
2. Criar conta (email + senha)
3. Gerar API Key
4. Copiar valor (começa com `gsk_`)
5. Preencher em `.env`

**Free tier**: 10,000+ requests/dia ✅

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| `GROQ_API_KEY not set` | Abra `.env` e preencha a key |
| `Port 3000 already in use` | Use: `PORT=3001 npm start` |
| `npm ERR! 404` | Rode: `npm cache clean --force` |
| App carrega em branco | Hard refresh: `Ctrl+Shift+R` |
| Offline não funciona | Clear cache: DevTools → Application → Clear |

---

## 📚 Documentação

- **Como usar**: [README_NOVO.md](README_NOVO.md)
- **Segurança**: [GUIA_SEGURANCA.md](GUIA_SEGURANCA.md)
- **Técnico**: [MELHORIAS_APLICADAS.md](MELHORIAS_APLICADAS.md)
- **Deploy**: [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)

---

## 🎯 Próximos Passos

1. ✅ Instalar (este guia)
2. ⏭️ Criar seu perfil
3. ⏭️ Gerar ficha com IA
4. ⏭️ Fazer seu primeiro treino
5. ⏭️ Compartilhe seu progresso!

---

## 💡 Dicas

- **Salvar dados**: Sempre clique em "Concluir Treino"
- **Offline mode**: Funciona 100% sem internet
- **Carregar última**: App lembra seu último treino
- **Exportar dados**: Use `exportUserData()` no console

---

## ❓ Precisa de Ajuda?

- 📖 Leia a documentação completa
- 🔍 Procure por `[DEBUG]` nos logs
- 💬 Abra uma issue no GitHub
- 📧 Contate: fernando@treinox.ai

---

**🏋️ Agora é só treinar! Vamos lá! 💪**
