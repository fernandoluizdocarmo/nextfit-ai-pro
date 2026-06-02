# 🤝 Contributing Guide - treinox.ai

Obrigado por considerar contribuir ao treinox.ai! 

Toda contribuição, grande ou pequena, é bem-vinda!

---

## 📋 Tipos de Contribuições

### 🐛 Reportar Bugs
Encontrou um bug?

1. Verificar [Issues](https://github.com/seu-usuario/treinox-ai-pro/issues) (pode já existir)
2. Se novo, criar Issue com:
   - Título descritivo
   - Passos para reproduzir
   - Resultado esperado vs real
   - Screenshots (se relevante)
   - Browser e SO

**Exemplo**:
```
Título: Login falha com email contendo espaços

Passos:
1. Email: " admin@test.com" (espaço no início)
2. Senha: 123456
3. Clicar em "Entrar"

Esperado: Login com sucesso (trim espaços)
Obtido: "Email inválido"

Browser: Chrome 120 no Windows 11
```

### 💡 Sugerir Melhorias
Tem uma ideia?

1. Criar Issue com label `enhancement`
2. Descrever o problema que resolve
3. Explicar a solução proposta
4. Exemplo de uso

### 📚 Melhorar Documentação
Documentação pode melhorar sempre!

1. Editar diretamente no GitHub (recomendado para pequenas mudanças)
2. Ou fazer Pull Request com melhorias

### 🎨 Contribuir Código
Quer implementar feature ou fix?

Siga o guia abaixo!

---

## 🛠️ Workflow de Desenvolvimento

### Passo 1: Fork o Repositório

1. Clique em "Fork" no topo da página GitHub
2. Você terá sua cópia: `seu-usuario/treinox-ai-pro`

### Passo 2: Clonar Localmente

```bash
git clone https://github.com/seu-usuario/treinox-ai-pro.git
cd treinox-ai-pro
```

### Passo 3: Criar Branch

```bash
# Nome descritivo da feature
git checkout -b fix/email-validation
# ou
git checkout -b feat/dark-mode-toggle
# ou
git checkout -b docs/api-endpoints
```

**Prefixos**:
- `fix/` - Correção de bug
- `feat/` - Nova funcionalidade
- `docs/` - Documentação
- `refactor/` - Refatoração
- `perf/` - Performance
- `test/` - Testes

### Passo 4: Fazer Alterações

1. Editar arquivos necessários
2. Testar localmente: `npm start`
3. Rodar testes: `runAllTests()`

### Passo 5: Commit

```bash
git add .
git commit -m "fix: validar email com espaços"
# ou
git commit -m "feat: adicionar modo escuro"
```

**Formato**:
```
<tipo>: <descrição breve>

<descrição detalhada (opcional)>

Fixes #123
```

**Tipos**:
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças em documentação
- `style:` Formatação (sem mudança lógica)
- `refactor:` Refatoração
- `perf:` Performance
- `test:` Testes
- `chore:` Build, deps, etc

**Exemplos**:
```
feat: adicionar export de dados de usuário

- Implementar função exportUserData()
- Criar download automático em JSON
- Incluir timestamp

Implementa #456
```

```
fix: prevenir requisição duplicada ao gerar ficha

Problema: User podia clicar 2x rapidamente
Solução: Lock com flag isGeneratingWorkout

Fixes #789
```

### Passo 6: Push

```bash
git push origin fix/email-validation
```

### Passo 7: Pull Request

1. Ir para https://github.com/seu-usuario/treinox-ai-pro
2. Clique em "Compare & pull request"
3. Preencha:
   - Título (descritivo)
   - Descrição (o que mudou e por quê)
   - Screenshots (se UI)
   - Referência de issues (Closes #123)

4. Clique em "Create Pull Request"

---

## ✅ Checklist de PR

Antes de submeter, garantir:

- [ ] Código segue o estilo do projeto
- [ ] Sem console.logs de debug
- [ ] Testes passam: `runAllTests()`
- [ ] Sem erros no console do browser
- [ ] Documentação atualizada
- [ ] Commit messages descritivas
- [ ] Uma funcionalidade por PR

---

## 📝 Código

### Estilo

```javascript
// ✅ BOM
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// ❌ RUIM
function sanitizeInput(str){if(typeof str!='string')return '';const div=document.createElement('div');div.textContent=str;return div.innerHTML;}
```

### Naming Conventions

```javascript
// ✅ Variáveis
const userName = "Fernando";
const isLoggedIn = true;
const MAX_HISTORY_ITEMS = 50;

// ✅ Funções
const saveStateToStorage = () => {};
const toggleVideoPlay = () => {};
const getLastLoad = (exId) => {};

// ✅ Classes (se usar)
class WorkoutSession {}
class ExerciseDatabase {}
```

### Comentários

```javascript
// ✅ BOM - explica o por quê
// Limitar histórico para não fazer overflow do localStorage
const MAX_HISTORY_ITEMS = 50;

// ❌ RUIM - óbvio
// Incrementar contador
counter++;

// ✅ BOM - secção importante
// ─── STATE MANAGEMENT ──────────────────────────────────
const saveState = () => {};
```

### Error Handling

```javascript
// ✅ BOM
try {
  const data = JSON.parse(response);
  if (!data.success) {
    throw new Error("API returned error: " + data.message);
  }
  return data;
} catch (err) {
  console.error("Erro ao processar resposta:", err);
  return null;
}

// ❌ RUIM
const data = JSON.parse(response); // Pode quebrar
return data.success;
```

---

## 🧪 Testes

### Adicionar Testes

Se implementar nova funcionalidade, adicionar testes em `tests.js`:

```javascript
const testNovaFuncionalidade = () => {
  console.log("\n🧪 TESTES: Nova Funcionalidade\n");

  // Test 1
  assert(
    novaFuncionalidade() === expected,
    "Descrição do teste"
  );

  // Test 2
  assert(
    outroTest() === true,
    "Outro teste"
  );
};
```

### Rodar Testes

```javascript
// No console do browser:
runAllTests();

// Resultado:
// ✅ PASSOU: Descrição do teste
// ✅ PASSOU: Outro teste
// ✅ TODOS OS TESTES COMPLETADOS COM SUCESSO!
```

---

## 📚 Documentação

### Atualizar README
Se adicionar feature importante:
- Adicionar na seção Features
- Incluir screenshots
- Adicionar instruções de uso

### Atualizar CHANGELOG

```markdown
## [1.1.0] - 2026-06-10

### Adicionado
- [x] Nova feature X (seu-usuario #123)
```

### Comentários no Código

```javascript
// ─── NOVA FEATURE: Export Dados ───────────────────────────
// Permite user fazer download de seus dados em JSON
const exportUserData = () => {
  // ...
};
```

---

## 🔍 Code Review

Quando submeter PR:

1. **Automático**: CI/CD checa
2. **Manual**: Maintainer revisa

### Possíveis Pedidos:

```
"Adicionar testes para esta função"
"Considerar refatorar X para legibilidade"
"Documentar este comportamento"
"Typo em comentário: 'receber' (foi 'rececer')"
```

Tudo bem! Fazer ajustes:

```bash
# Fazer mudanças
git add .
git commit -m "fix: atender feedback do review"
git push origin seu-branch
# PR é atualizado automaticamente!
```

---

## 🚀 Merge & Release

Quando PR é aprovado:

1. Merge para `main`
2. Criar tag de versão: `v1.1.0`
3. Gerar release notes
4. Deploy automático

Pronto! Sua contribuição está em produção! 🎉

---

## 💬 Comunicação

- **Issues**: Para bugs, ideias, discussões
- **Discussions**: Para perguntas gerais
- **Email**: fernando@treinox.ai
- **Discord**: [Comunidade](link)

---

## 📖 Recursos

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)

---

## 🎓 Primeira Contribuição?

1. Procure por issues com label `good first issue`
2. Comece pequeno (typo, comentário, doc)
3. Não tenha medo de perguntar!
4. Sua PR não será perfeita, e tudo bem!

---

## 🏆 Crédito

Todos os contribuidores aparecem em:
- README.md
- CHANGELOG.md
- Página de Releases

Obrigado por ajudar a tornar treinox.ai melhor! 💪

---

**Gostou do projeto? Dê uma ⭐ star!**

**Quer conversar? Abra uma discussion!**

**Encontrou bug? Reporte uma issue!**

---

*Last updated: Junho 2026*
