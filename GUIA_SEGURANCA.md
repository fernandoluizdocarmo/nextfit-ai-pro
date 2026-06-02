# 🛡️ GUIA DE SEGURANÇA E PERFORMANCE - treinox.ai

## 📖 Índice
1. [Segurança](#segurança)
2. [Performance](#performance)
3. [Configuração de Produção](#configuração-de-produção)
4. [Troubleshooting](#troubleshooting)
5. [Checklist de Deploy](#checklist-de-deploy)

---

## 🔐 Segurança

### 1. Variáveis de Ambiente

#### ❌ NUNCA faça isso:
```javascript
const GROQ_API_KEY = "gsk_abcdefg123456"; // HARDCODED - ERRADO!
```

#### ✅ Sempre use variáveis de ambiente:
```bash
# No servidor (Render, Heroku, etc)
export GROQ_API_KEY=gsk_abcdefg123456

# Ou em .env (não commitar!)
GROQ_API_KEY=gsk_abcdefg123456
```

### 2. Proteção XSS

#### ✅ Sempre sanitizar inputs do usuário:
```javascript
// ✅ CORRETO
const name = sanitizeInput(userInput);

// ❌ ERRADO
const name = userInput; // Vulnerável a XSS
element.innerHTML = userInput; // NUNCA!
```

### 3. Validação de Input

#### ✅ Sempre validar antes de usar:
```javascript
// ✅ CORRETO
if (!email || !password) {
  alert("Campos obrigatórios");
  return;
}

if (!emailRegex.test(email)) {
  alert("Email inválido");
  return;
}

// ❌ ERRADO
const email = document.getElementById("email").value;
fetch("/api/login", { body: email }); // Sem validação!
```

### 4. Senhas

#### ❌ NUNCA armazene senhas em plain text:
```javascript
// ERRADO - localStorage
localStorage.setItem("password", "123456");

// ERRADO - JSON na resposta
fetch("/api/user").then(r => r.json()).then(data => {
  console.log(data.password); // NUNCA expor!
});
```

#### ✅ Use HTTPS em produção:
```bash
# Em Render/Heroku, ativa automaticamente
# Ou manualmente com Let's Encrypt
```

### 5. CORS e Headers

#### ✅ Configure headers de segurança no server:
```javascript
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});
```

### 6. Rate Limiting

#### ✅ Proteja API de brute force:
```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests
});

app.post("/api/generate-workout", limiter, async (req, res) => {
  // ... código
});
```

### 7. Validação de API Response

#### ✅ Nunca confie cegamente em respostas:
```javascript
// ✅ CORRETO
try {
  const data = await response.json();
  if (!data.text || typeof data.text !== 'string') {
    throw new Error("Resposta inválida");
  }
  // ... usar data.text
} catch (e) {
  console.error("Erro:", e);
  fallback();
}

// ❌ ERRADO
const data = await response.json();
const text = data.text; // Pode ser undefined!
```

---

## ⚡ Performance

### 1. LocalStorage Otimização

#### ✅ Limite dados salvos:
```javascript
const MAX_HISTORY_ITEMS = 50;

// Implementado em saveStateToStorage()
history: state.history.slice(-MAX_HISTORY_ITEMS)
```

#### Monitor uso:
```javascript
const getStorageUsage = () => {
  const state = localStorage.getItem("treinox_ai_state");
  const bytes = new Blob([state]).size;
  const mb = bytes / (1024 * 1024);
  console.log(`Storage: ${mb.toFixed(2)} MB`);
};

getStorageUsage(); // Executar periodicamente
```

### 2. Service Worker Cache

#### ✅ Estratégias implementadas:
```
Assets estáticos → Cache-First (rápido)
API calls → Network-First (fresco)
Externos (imgs) → Network-First + Cache
```

#### Limpar cache antigo:
```javascript
// No sw.js - executado automaticamente
cacheNames
  .filter((name) => name !== CACHE_NAME)
  .map((name) => caches.delete(name));
```

### 3. Lazy Loading

#### ✅ Para melhorar carregamento inicial:
```javascript
// Carregar dados sob demanda
const loadExerciseDetails = (id) => {
  if (!EXERCISES_DB[id].videoUrl) {
    // Só carrega vídeo quando usuario clica
    fetchVideoForExercise(id);
  }
};
```

### 4. Compressão

#### ✅ Render/Heroku comprime automaticamente
```bash
# Verificar no DevTools
# Response Headers: Content-Encoding: gzip
```

### 5. CDN para Recursos Externos

#### ✅ Já implementado:
```html
<!-- Fonts via Google -->
<link rel="stylesheet" href="https://fonts.googleapis.com/...">

<!-- Material Icons -->
<link rel="stylesheet" href="https://fonts.googleapis.com/...">

<!-- Exercício GIFs via jsdelivr -->
<img src="https://cdn.jsdelivr.net/gh/yuhonas/...">
```

---

## 🚀 Configuração de Produção

### 1. Deploy em Render

#### ✅ Passos:
```bash
# 1. Conectar repositório Git
# 2. Criar novo Web Service
# 3. Configurar variáveis de ambiente

GROQ_API_KEY=seu_valor
NODE_ENV=production
```

#### ✅ Configure keep-alive:
```bash
# cron-job.org
# GET https://seu-app.onrender.com/ping
# A cada 5 minutos
```

### 2. Monitoramento

#### ✅ Log errors:
```javascript
// Adicionar em produção
window.addEventListener('error', (event) => {
  fetch('/api/log-error', {
    method: 'POST',
    body: JSON.stringify({
      message: event.message,
      stack: event.error.stack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    })
  });
});
```

### 3. Backup de Dados

#### ✅ Oferça export ao user:
```javascript
const exportUserData = () => {
  const data = {
    state: JSON.parse(localStorage.getItem("treinox_ai_state")),
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], 
    { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `treinox-backup-${Date.now()}.json`;
  a.click();
};

// Adicionar botão
<button onclick="exportUserData()">💾 Backup</button>
```

---

## 🔧 Troubleshooting

### Problema: "Groq API Key não configurada"

#### Solução:
```bash
# 1. Verificar se variável existe
echo $GROQ_API_KEY

# 2. Se vazio, configurar
export GROQ_API_KEY=gsk_...

# 3. Verificar no server logs
# Procurar por: "AVISO: Variável de ambiente GROQ_API_KEY não configurada"
```

### Problema: Service Worker não carrega

#### Solução:
```javascript
// 1. DevTools → Application → Service Workers
// Verificar se está "activated and running"

// 2. Se não, limpar cache
// Application → Cache Storage → treinox-ai-cache-v6
// Delete

// 3. Reload hard (Ctrl+Shift+R)

// 4. Verificar console por erros
```

### Problema: LocalStorage cheio (QuotaExceededError)

#### Solução:
```javascript
// App irá auto-limpar, mas se quiser manual:
localStorage.clear();
// OU
state.history = state.history.slice(-10);
saveStateToStorage();
```

### Problema: IA retorna JSON inválido

#### Solução:
```javascript
// 1. Verificar resposta no Network tab
// DevTools → Network → /api/generate-workout

// 2. Se problema com Groq:
// Usar fallback (gerador local) é automático

// 3. Aumentar timeout se muito lento
API_TIMEOUT = 45000; // Ao invés de 30000
```

### Problema: Treino não salva no histórico

#### Solução:
```javascript
// 1. Verificar localStorage (F12)
localStorage.getItem("treinox_ai_state");

// 2. Verificar se está chamando saveStateToStorage()
// Procurar por: "💾 State salvo"

// 3. Se storage cheio:
getStorageUsage(); // Ver quantos MB
// Usar exportUserData() para backup
```

---

## ✅ Checklist de Deploy

### Antes de Subir para Produção

- [ ] **Segurança**
  - [ ] Nenhuma senha em plain text no código
  - [ ] Todas as APIs validadas
  - [ ] XSS protection ativo
  - [ ] HTTPS configurado
  - [ ] Headers de segurança adicionados

- [ ] **Performance**
  - [ ] Service Worker ativo
  - [ ] Cache funcionando
  - [ ] Assets comprimidos
  - [ ] Lazy loading implementado

- [ ] **Funcionalidade**
  - [ ] Testes executados: `runAllTests()`
  - [ ] Login funciona
  - [ ] Geração IA funciona
  - [ ] Fallback local funciona
  - [ ] Histórico salva corretamente

- [ ] **Produção**
  - [ ] Variáveis de ambiente configuradas
  - [ ] Keep-alive configurado (cron-job)
  - [ ] Logs de error setup
  - [ ] Backup automático (opcional)
  - [ ] Monitoramento ativo

- [ ] **Documentação**
  - [ ] README.md atualizado
  - [ ] MELHORIAS_APLICADAS.md incluído
  - [ ] GUIA_SEGURANCA.md distribuído
  - [ ] Changelog criado

### Pré-Deploy Checklist

```bash
# 1. Build local
npm start

# 2. Testar no browser
# Abrir http://localhost:3000

# 3. Verificar console
# Não deve ter erros vermelhos

# 4. Testar offline
# DevTools → Offline mode
# App continua funcionando?

# 5. Testar storage
# Executar: getStorageUsage()
# Menos de 5MB?

# 6. Run tests
# Executar: runAllTests()
# Todos passam?

# 7. Verificar logs
# Deve ter log amigável
# Sem dados sensíveis
```

### Pós-Deploy

```bash
# 1. Verificar Service Worker
# Application → Service Workers
# Status: activated and running

# 2. Testar IA
# Criar uma ficha com IA
# Deve funcionar ou falhar gracefully

# 3. Monitorar logs
# Procurar por erros 5xx
# Se houver, investigar

# 4. Verificar uptime
# cron-job.org deve estar pinging
# GET /ping retorna 200 OK

# 5. Backup setup
# Se usuário exportar dados
# JSON válido?
```

---

## 📞 Support & Debug

### Ativar Debug Mode

```javascript
// No console:
window.DEBUG = true;

// Logs detalhados aparecerão
// [DEBUG] Loading state from storage...
// [DEBUG] Current split: A
// etc
```

### Exportar logs para análise

```javascript
const exportLogs = () => {
  const logs = window.consoleHistory || [];
  const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `treinox-logs-${Date.now()}.txt`;
  a.click();
};
```

---

## 🎓 Best Practices

### 1. Sempre use try/catch
```javascript
try {
  saveStateToStorage();
} catch (e) {
  console.error("Erro ao salvar:", e);
  // Fallback ou notificar user
}
```

### 2. Validate data na entrada E saída
```javascript
// Entrada
const email = sanitizeInput(input);
if (!emailRegex.test(email)) return;

// Saída
if (!response.ok) throw Error(...);
```

### 3. Use meaningful error messages
```javascript
// ❌ Ruim
alert("Erro");

// ✅ Bom
alert("⚠️ Email inválido. Formato correto: nome@dominio.com");
```

### 4. Log informações úteis
```javascript
// ❌ Ruim
console.log("erro");

// ✅ Bom
console.error("[API] Groq request falhou:", {
  status: response.status,
  error: errJson.error,
  timestamp: new Date().toISOString()
});
```

---

**Versão: 1.0.0**  
**Última atualização: Junho 2026**  
**Autor: Team treinox.ai**
