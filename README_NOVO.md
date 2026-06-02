# 🏋️ treinox.ai - Personal Trainer de Elite Inteligente

> **Seu aplicativo fitness definitivo com geração de fichas via IA, rastreamento de séries, cronômetro de descanso e histórico de treinos.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-100%25%20Funcional-brightgreen)
![Security](https://img.shields.io/badge/security-Enhanced-orange)

---

## 📋 Índice

- [Features](#features)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Arquitetura](#arquitetura)
- [Melhorias Recentes](#melhorias-recentes)
- [Troubleshooting](#troubleshooting)
- [Deploy](#deploy)
- [Licença](#licença)

---

## ✨ Features

### 🤖 Geração de Fichas com IA
- **Groq Llama 3.1** para gerar fichas personalizadas
- Análise de objetivo, nível e disponibilidade
- Fallback automático para gerador local
- Adaptações específicas por sexo (feminino/masculino)

### 📊 Banco de Exercícios Completo
- **26+ exercícios** com instruções passo-a-passo
- GIFs e vídeos de demonstração
- Grupos musculares bem definidos
- Descanso recomendado por exercício

### ⏱️ Cronômetro de Descanso Inteligente
- Countdown visual em tela cheia
- Progressão circular animada
- Pausa/resumo durante descanso
- Alerta sonoro quando pronto

### 📈 Rastreamento de Séries
- Registrar peso e repetições
- Histórico automático de cargas
- Sugestão de cargas baseada no último treino
- Marcar séries como concluídas

### 💾 Histórico de Treinos
- Todos os treinos salvos localmente
- Cargas máximas por sessão
- Duração do treino
- Exportar dados como JSON

### 📱 PWA (Progressive Web App)
- **Funciona offline** completamente
- Instalar como app nativo
- Sincroniza quando online
- Ícone na tela inicial

### 🎨 Design Premium
- Dark mode elegante
- Responsivo (mobile/desktop)
- Animações suaves
- Material Design Icons

### 🔐 Segurança Aprimorada
- Inputs sanitizados contra XSS
- Validação robusta de dados
- LocalStorage com limite automático
- API timeouts e fallbacks

---

## 📦 Requisitos

### Para Rodar Localmente
- **Node.js 18+** (para server)
- **npm ou yarn**
- **Navegador moderno** com suporte a:
  - Service Workers
  - LocalStorage
  - Fetch API
  - Web Audio API

### Para Usar Geração com IA
- **Groq API Key** (gratuita em https://console.groq.com)
  - Mais de 10,000 requests/dia no free tier

---

## 🚀 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/treinox-ai-pro.git
cd treinox-ai-pro
```

### 2. Instale Dependências
```bash
npm install
```

### 3. Configure Variáveis de Ambiente
```bash
# Criar arquivo .env na raiz do projeto
echo "GROQ_API_KEY=gsk_seu_valor_aqui" > .env

# OU configurar variável de ambiente
export GROQ_API_KEY=gsk_seu_valor_aqui
```

### 4. Inicie o Servidor
```bash
npm start
# Server rodando em http://localhost:3000
```

### 5. Abra no Navegador
```
http://localhost:3000
```

---

## 💻 Uso

### Primeira Vez
1. **Login**: Use qualquer email/senha para entrar (modo demo)
2. **Criar Ficha**: Clique em "Criar Ficha" → preencha preferências
3. **Deixar IA Gerar**: Aguarde 10-15s para geração

### Rotina de Treino
1. **Dashboard**: Veja sua ficha atual (Treino A, B ou C)
2. **Iniciar Treino**: Clique em "Iniciar Treino"
3. **Executar Série**: Digite peso → marca reps → marca concluída
4. **Descanso**: Timer inicia automaticamente
5. **Próximo Exercício**: Botão navega entre exercícios
6. **Concluir**: Clique em "Concluir Treino" ao final

### Gerenciar Fichas
- **Biblioteca**: Ver todos os exercícios disponíveis
- **Histórico**: Consultar treinos passados
- **Criar Nova**: Gerar ficha diferente
- **Deletar**: Remove ficha atual

### Modo Offline
- App continua 100% funcional
- Dados salvos localmente
- Ao voltar online, sincroniza automaticamente

---

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
treinox-ai-pro/
├── index.html              # Frontend principal
├── app.js                  # Lógica do aplicativo (1950+ linhas)
├── style.css               # Estilos Dark Mode
├── server.js               # Backend Express + Groq API
├── sw.js                   # Service Worker (PWA)
├── manifest.json           # Configuração PWA
├── package.json            # Dependências
├── tests.js                # Suite de testes
├── Dockerfile              # Para deploy em container
├── MELHORIAS_APLICADAS.md  # Changelog das otimizações
├── GUIA_SEGURANCA.md       # Guia de segurança
└── README.md               # Este arquivo
```

### Stack Tecnológico
```
Frontend:
  - HTML5 / CSS3 / JavaScript Vanilla
  - Material Design Icons
  - Web Audio API (para sons)
  - Service Workers (PWA offline)
  - LocalStorage (persistência)

Backend:
  - Node.js 18+
  - Express.js 4.18.2
  - Groq API (IA)

Deploy:
  - Render (recomendado)
  - Docker support
  - Keep-alive automático
```

### Data Flow
```
User Input
    ↓
Validação + Sanitização
    ↓
State Management (localStorage)
    ↓
Render UI
    ↓
Service Worker (cache/offline)
```

---

## 🔄 Melhorias Recentes (v1.0.0)

### 🔒 Segurança
- [x] Remover credenciais hardcoded do HTML
- [x] Sanitização de inputs (XSS protection)
- [x] Validação robusta de email/senha
- [x] API Key Groq com tratamento seguro

### ⚡ Performance
- [x] LocalStorage limitado a 50 treinos
- [x] Auto-cleanup quando storage cheio
- [x] Cache-first strategy no SW
- [x] Timeout em requisições (30s)

### 🛡️ Confiabilidade
- [x] Tratamento de erro melhorado
- [x] Fallback IA → Local automático
- [x] Proteção contra requisições duplicadas
- [x] Recuperação de erros críticos

### 🧪 Testabilidade
- [x] Suite de testes unitários (tests.js)
- [x] Logs descritivos para debug
- [x] Offline mode funcionando
- [x] Documentação completa

Para detalhes completos, ver [MELHORIAS_APLICADAS.md](MELHORIAS_APLICADAS.md)

---

## 🐛 Troubleshooting

### "Groq API Key não configurada"
```bash
# 1. Verificar variável
echo $GROQ_API_KEY

# 2. Se vazio, configurar
export GROQ_API_KEY=gsk_seu_valor

# 3. Restart server
npm start
```

### Service Worker não funciona
```javascript
// DevTools → Application → Service Workers
// Se "pending", clique em "update"
// Reload hard: Ctrl+Shift+R
```

### Treino não salva
```javascript
// No console:
localStorage.getItem("treinox_ai_state");

// Se vazio ou erro:
localStorage.clear();
location.reload();
```

### IA retorna erro
```
O app usa fallback automático (gerador local)
Se quiser forçar IA:
1. Verificar internet
2. Verificar GROQ_API_KEY
3. Aguardar 30s para timeout
```

Ver [GUIA_SEGURANCA.md](GUIA_SEGURANCA.md) para mais soluções.

---

## 📈 Deploy

### Deploy em Render (Recomendado)

#### 1. Conectar GitHub
```bash
git push origin main
```

#### 2. Criar Web Service em Render
- Vá para https://dashboard.render.com
- Clique em "New+" → "Web Service"
- Conecte seu repositório GitHub

#### 3. Configurar Build
```
Build Command: npm install
Start Command: npm start
```

#### 4. Adicionar Variáveis de Ambiente
```
GROQ_API_KEY = gsk_seu_valor
NODE_ENV = production
```

#### 5. Deploy automático
- Sempre que fizer `git push`, faz deploy automático
- URL será: `https://seu-app.onrender.com`

### Setup Keep-Alive (Evitar Sleep)

1. Vá para https://cron-job.org
2. Crie novo cron job
3. URL: `https://seu-app.onrender.com/ping`
4. Frequência: A cada 5 minutos
5. Pronto! App nunca vai dormir

### Docker Local
```bash
docker build -t treinox-ai .
docker run -p 3000:3000 -e GROQ_API_KEY=sua_key treinox-ai
```

---

## 📊 Testes

### Executar Suite de Testes
```javascript
// No console do browser:
runAllTests();

// Output esperado:
// ✅ PASSOU: Estado inicial está correto
// ✅ PASSOU: State foi salvo em localStorage
// ... mais testes
// ✅ TODOS OS TESTES COMPLETADOS COM SUCESSO!
```

### Testes Cobertos
- ✅ Gerenciamento de estado
- ✅ Sanitização de inputs
- ✅ Banco de exercícios
- ✅ Sessão de treino
- ✅ Builder de prompt IA
- ✅ Rotação de exercícios
- ✅ Edge cases do storage

---

## 📝 API Reference

### POST /api/generate-workout

Gera uma ficha personalizada com IA.

**Request:**
```json
{
  "prompt": "Crie uma ficha de hipertrofia para João Silva, masculino, intermediário..."
}
```

**Response (sucesso):**
```json
{
  "text": "{\"name\": \"Ficha IA\", \"treinoA\": {...}}"
}
```

**Response (erro):**
```json
{
  "error": "Serviço de IA temporariamente indisponível. Use o gerador local."
}
```

### GET /ping

Health check para keep-alive.

**Response:**
```
OK
```

---

## 🔐 Segurança

### Checklist de Segurança
- ✅ HTTPS em produção
- ✅ Inputs sanitizados contra XSS
- ✅ API Key nunca exposta no frontend
- ✅ Validação robusta de dados
- ✅ Rate limiting recomendado
- ✅ CORS headers adicionados

Ver [GUIA_SEGURANCA.md](GUIA_SEGURANCA.md) para detalhes completos.

---

## 📄 Licença

MIT License - Sinta-se livre para usar, modificar e distribuir.

```
Copyright (c) 2026 treinox.ai
```

---

## 👥 Contribuindo

Encontrou um bug? Tem uma sugestão?

1. Abra uma issue descrevendo o problema
2. Forneça passo-a-passo para reproduzir
3. Sugira uma solução se possível

---

## 📞 Suporte

- **Docs**: [GUIA_SEGURANCA.md](GUIA_SEGURANCA.md) e [MELHORIAS_APLICADAS.md](MELHORIAS_APLICADAS.md)
- **Testes**: Execute `runAllTests()` no console
- **Debug**: Procure por `[DEBUG]` ou `⚠️` nos logs
- **Issues**: GitHub issues

---

## 🎯 Roadmap Futuro

- [ ] Adicionar backup/export de dados
- [ ] Suportar múltiplos usuários
- [ ] Integração com Spotify (música)
- [ ] Social features (compartilhar fichas)
- [ ] Analytics de progresso
- [ ] Notificações push
- [ ] TypeScript migration
- [ ] Mobile app nativa (React Native)

---

## 🙏 Agradecimentos

- **Groq** pelo excelente modelo Llama
- **Render** pela hospedagem confiável
- **Material Design** pelos ícones
- Você! Por usar treinox.ai

---

**Desenvolvido com ❤️ para atletas e entusiastas de fitness.**

🏋️ **Comece seu treino agora em https://treinox-ai.onrender.com** 🏋️

---

_Last updated: Junho 2026_  
_Version: 1.0.0_  
_Status: ✅ Production Ready_
