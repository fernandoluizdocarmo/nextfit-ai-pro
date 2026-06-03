// ═══════════════════════════════════════════════════════════════════════════════
// TREINOX.AI - INTEGRATED SCREENS APP
// Combina funcionalidade do app.js com design das telas screens/
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

const safeStringify = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error('Erro ao serializar:', e);
    return null;
  }
};

const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
};

const getBMICategory = (bmi) => {
  if (!bmi) return "desconhecida";
  if (bmi < 18.5) return "Abaixo do peso";
  if (bmi < 25) return "Peso normal";
  if (bmi < 30) return "Sobrepeso";
  return "Obesidade";
};

// ─────────────────────────────────────────────────────────────────────────────
// STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

let APP_STATE = {
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  currentScreen: 'auth',
  currentWorkout: JSON.parse(localStorage.getItem('currentWorkout')) || null,
  userWorkouts: JSON.parse(localStorage.getItem('userWorkouts')) || [],
  isGeneratingWorkout: false,
  GROQ_API_KEY: localStorage.getItem('GROQ_API_KEY') || '',
};

// Exercise Database
const EXERCISES_DB = {
  "supino_reto": {
    name: "Supino Reto com Barra",
    muscle: "Peito",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg",
    steps: ["Deite-se no banco plano com os pés apoiados firmemente no chão.", "Segure a barra com uma pegada ligeiramente mais larga que a largura dos ombros.", "Retire a barra do suporte e desça-a lentamente até a linha do mamilo.", "Empurre a barra para cima estendendo os cotovelos, sem travá-los no topo."],
    rest: 60,
    tips: "Não tire os glúteos do banco e evite bater a barra com força no peito."
  },
  "agachamento_barra": {
    name: "Agachamento Livre com Barra",
    muscle: "Pernas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Full_Squat/0.jpg",
    steps: ["Apoie a barra sobre a musculatura do trapézio.", "Afaste os pés na largura dos ombros, apontando os dedos ligeiramente para fora.", "Desça até que as coxas fiquem paralelas ao chão.", "Empurre o chão com os calcanhares para subir."],
    rest: 60,
    tips: "Mantenha o peito erguido e os joelhos alinhados com os pés."
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTING & SCREEN RENDERING
// ─────────────────────────────────────────────────────────────────────────────

function navigateTo(screen) {
  APP_STATE.currentScreen = screen;
  renderScreen();
}

function renderScreen() {
  const root = document.getElementById('app-root');
  
  if (!APP_STATE.currentUser) {
    root.innerHTML = renderAuthScreen();
    attachAuthListeners();
    return;
  }
  
  switch(APP_STATE.currentScreen) {
    case 'dashboard':
      root.innerHTML = renderDashboard();
      attachDashboardListeners();
      break;
    case 'criar-ficha':
      root.innerHTML = renderCriarFicha();
      attachCriarFichaListeners();
      break;
    case 'treino':
      root.innerHTML = renderTreino();
      attachTreinoListeners();
      break;
    case 'biblioteca':
      root.innerHTML = renderBiblioteca();
      attachBibliotecaListeners();
      break;
    case 'perfil':
      root.innerHTML = renderPerfil();
      attachPerfilListeners();
      break;
    default:
      root.innerHTML = renderDashboard();
      attachDashboardListeners();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function renderAuthScreen() {
  return `
    <div class="kinetic-bg min-h-screen flex flex-col items-center justify-center px-margin-mobile relative" id="login-screen">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container via-secondary-container to-primary-container"></div>
      
      <div class="w-full max-w-[400px] flex flex-col items-center">
        <div class="mb-lg text-center">
          <h1 class="font-headline-lg-mobile text-headline-lg-mobile italic font-black text-primary-container tracking-tighter mb-base">FORGE</h1>
          <p class="font-label-caps text-label-caps text-on-surface-variant">ELITE PERFORMANCE SYSTEM</p>
        </div>
        
        <form id="login-form" class="w-full space-y-md" onsubmit="event.preventDefault(); performLogin();">
          <div class="flex flex-col space-y-base group">
            <label class="font-label-caps text-label-caps text-on-surface-variant ml-base">EMAIL</label>
            <div class="relative neon-glow">
              <input id="login-email" class="w-full bg-surface-container border-none border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all duration-300 placeholder:text-surface-variant" placeholder="seu@email.com" type="email"/>
            </div>
          </div>
          
          <div class="flex flex-col space-y-base group">
            <label class="font-label-caps text-label-caps text-on-surface-variant ml-base">SENHA</label>
            <div class="relative neon-glow">
              <input id="login-password" class="w-full bg-surface-container border-none border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all duration-300 placeholder:text-surface-variant" placeholder="••••••••" type="password"/>
            </div>
          </div>
          
          <button type="submit" class="w-full bg-primary-container text-on-primary-container font-headline-md text-headline-md py-md rounded-none uppercase tracking-widest active:scale-95 transition-transform mt-lg">
            ENTRAR
          </button>
        </form>
        
        <div class="mt-xl text-center">
          <button onclick="toggleAuthScreen()" class="font-label-caps text-label-caps text-primary-fixed-dim hover:text-primary transition-colors border-b border-primary-fixed-dim border-dashed">
            CRIAR NOVA CONTA
          </button>
        </div>
      </div>
    </div>
    
    <div class="hidden-screen min-h-screen bg-background flex flex-col items-center py-xl px-margin-mobile overflow-y-auto" id="register-screen">
      <div class="w-full max-w-[440px]">
        <div class="mb-lg flex items-center justify-between">
          <div>
            <h2 class="font-headline-lg-mobile text-headline-lg-mobile italic font-black text-primary tracking-tighter">COMEÇAR</h2>
            <p class="font-label-caps text-label-caps text-on-surface-variant">CRIE SEU PERFIL</p>
          </div>
          <button type="button" onclick="toggleAuthScreen()" class="p-sm bg-surface-container-high rounded-lg text-on-surface active:scale-90 transition-all">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form id="register-form" class="space-y-md" onsubmit="event.preventDefault(); performRegister();">
          <div class="flex flex-col space-y-base">
            <label class="font-label-caps text-label-caps text-on-surface-variant">NOME COMPLETO</label>
            <input id="register-name" class="w-full bg-surface-container border-none border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all" placeholder="Seu nome" type="text"/>
          </div>
          
          <div class="flex flex-col space-y-base">
            <label class="font-label-caps text-label-caps text-on-surface-variant">EMAIL</label>
            <input id="register-email" class="w-full bg-surface-container border-none border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all" placeholder="seu@email.com" type="email"/>
          </div>
          
          <div class="grid grid-cols-2 gap-md">
            <div class="flex flex-col space-y-base">
              <label class="font-label-caps text-label-caps text-on-surface-variant">SENHA</label>
              <input id="register-password" class="w-full bg-surface-container border-none border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all" placeholder="••••••••" type="password"/>
            </div>
            <div class="flex flex-col space-y-base">
              <label class="font-label-caps text-label-caps text-on-surface-variant">IDADE</label>
              <input id="register-age" class="w-full bg-surface-container border-none border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all" placeholder="25" type="number" min="15" max="100"/>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-md">
            <div class="flex flex-col space-y-base">
              <label class="font-label-caps text-label-caps text-on-surface-variant">PESO (KG)</label>
              <input id="register-weight" class="w-full bg-surface-container border-none border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all" placeholder="80" type="number" min="30" step="0.5"/>
            </div>
            <div class="flex flex-col space-y-base">
              <label class="font-label-caps text-label-caps text-on-surface-variant">ALTURA (CM)</label>
              <input id="register-height" class="w-full bg-surface-container border-none border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all" placeholder="185" type="number" min="130" max="220"/>
            </div>
          </div>
          
          <button type="submit" class="w-full bg-primary-container text-on-primary-container font-headline-md text-headline-md py-md rounded-none uppercase tracking-widest active:scale-95 transition-transform mt-lg flex items-center justify-center gap-sm">
            CRIAR CONTA
            <span class="material-symbols-outlined">bolt</span>
          </button>
        </form>
      </div>
    </div>
    
    <style>
      .hidden-screen { display: none; }
    </style>
  `;
}

function attachAuthListeners() {
  const loginScreen = document.getElementById('login-screen');
  
  // Parallax effect
  document.addEventListener('mousemove', (e) => {
    if (loginScreen && !loginScreen.classList.contains('hidden-screen')) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      loginScreen.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function renderDashboard() {
  const user = APP_STATE.currentUser;
  
  return `
    <div class="min-h-screen pb-32">
      <!-- TopAppBar -->
      <header class="fixed top-0 z-50 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile py-xs">
        <div class="flex items-center gap-sm">
          <div class="w-10 h-10 rounded-full overflow-hidden border border-primary-fixed bg-primary-container flex items-center justify-center">
            <span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">person</span>
          </div>
          <div class="flex flex-col">
            <span class="font-label-caps text-label-caps text-on-surface-variant">BEM-VINDO</span>
            <span class="font-headline-md text-headline-md text-primary">${sanitizeInput(user.name).toUpperCase()}</span>
          </div>
        </div>
        <button class="material-symbols-outlined text-primary hover:opacity-80 transition-opacity active:scale-95">notifications</button>
      </header>
      
      <main class="px-margin-mobile mt-xs pt-16 space-y-md pb-32">
        <!-- Daily Goal -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-sm">
          <div class="bg-surface-container border border-outline-variant rounded-xl p-sm flex items-center justify-between overflow-hidden relative">
            <div class="z-10">
              <h2 class="font-label-caps text-label-caps text-on-surface-variant mb-base">META DIÁRIA</h2>
              <p class="font-headline-lg-mobile text-headline-lg-mobile text-primary">75% FEITO</p>
              <p class="text-on-surface-variant font-body-md mt-base">1.250 / 1.600 KCAL</p>
            </div>
            <div class="relative w-24 h-24 flex items-center justify-center z-10">
              <svg class="w-full h-full"><circle class="text-surface-container-highest" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-width="8"></circle><circle class="text-primary-fixed progress-ring-circle" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-dasharray="251.2" stroke-dashoffset="62.8" stroke-width="8"></circle></svg>
              <span class="absolute material-symbols-outlined text-primary-fixed" style="font-variation-settings: 'FILL' 1;">bolt</span>
            </div>
            <div class="absolute inset-0 bg-noise pointer-events-none"></div>
          </div>
          
          <div class="bg-surface-container border border-outline-variant rounded-xl p-sm flex flex-col justify-between">
            <div>
              <h2 class="font-label-caps text-label-caps text-on-surface-variant mb-base">ATIVIDADE SEMANAL</h2>
              <p class="font-headline-md text-headline-md text-primary">8.4k <span class="text-body-md font-normal text-on-surface-variant">KCAL</span></p>
            </div>
            <div class="flex items-end justify-between h-16 mt-sm gap-1">
              <div class="w-full bg-surface-container-highest rounded-t-sm h-[40%]"></div>
              <div class="w-full bg-surface-container-highest rounded-t-sm h-[70%]"></div>
              <div class="w-full bg-primary-fixed rounded-t-sm h-[90%]"></div>
              <div class="w-full bg-surface-container-highest rounded-t-sm h-[55%]"></div>
              <div class="w-full bg-surface-container-highest rounded-t-sm h-[80%]"></div>
              <div class="w-full bg-surface-container-highest rounded-t-sm h-[30%]"></div>
              <div class="w-full bg-surface-container-highest rounded-t-sm h-[10%]"></div>
            </div>
          </div>
        </section>
        
        <!-- Today's Workout -->
        <section>
          <div class="flex justify-between items-center mb-sm">
            <h2 class="font-label-caps text-label-caps text-on-surface-variant">TREINO DE HOJE</h2>
            <button onclick="navigateTo('biblioteca')" class="text-primary-fixed font-label-caps text-[10px] hover:underline">VER TUDO</button>
          </div>
          <div class="relative group cursor-pointer overflow-hidden rounded-xl border border-outline-variant bg-surface-container h-64 flex flex-col justify-end p-sm" onclick="navigateTo('treino')">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div class="relative z-10 flex flex-col">
              <div class="flex gap-xs mb-xs">
                <span class="bg-secondary-container text-on-secondary-container px-xs py-[2px] rounded-full text-[10px] font-label-caps">AVANÇADO</span>
                <span class="bg-surface-bright/50 backdrop-blur-md text-white px-xs py-[2px] rounded-full text-[10px] font-label-caps">45 MIN</span>
              </div>
              <h3 class="font-display-lg text-headline-lg text-primary tracking-tighter italic">TREINO DE FORÇA</h3>
            </div>
            <button onclick="event.stopPropagation(); navigateTo('treino')" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary-fixed text-on-primary-fixed rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(210,240,0,0.5)]">
              <span class="material-symbols-outlined !text-[40px]" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
            </button>
          </div>
        </section>
        
        <!-- Stats -->
        <section class="grid grid-cols-2 gap-sm">
          <div class="bg-surface-container-low border border-outline-variant rounded-xl p-sm">
            <span class="material-symbols-outlined text-secondary mb-xs">timer</span>
            <p class="font-label-caps text-[10px] text-on-surface-variant">TEMPO TOTAL</p>
            <p class="font-headline-md text-headline-md text-primary">12h 45m</p>
          </div>
          <div class="bg-surface-container-low border border-outline-variant rounded-xl p-sm">
            <span class="material-symbols-outlined text-error mb-xs" style="font-variation-settings: 'FILL' 1;">favorite</span>
            <p class="font-label-caps text-[10px] text-on-surface-variant">FREQ. MÉDIA</p>
            <p class="font-headline-md text-headline-md text-primary">142 BPM</p>
          </div>
        </section>
      </main>
      
      <!-- BottomNavBar -->
      <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter pb-sm pt-xs bg-surface-container border-t-2 border-outline-variant">
        <button onclick="navigateTo('dashboard')" class="flex flex-col items-center justify-center text-primary-fixed bg-secondary-container rounded-lg px-sm py-xs transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">home</span>
          <span class="font-label-caps text-[10px] mt-1">HOME</span>
        </button>
        <button onclick="navigateTo('criar-ficha')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">edit_note</span>
          <span class="font-label-caps text-[10px] mt-1">FICHA</span>
        </button>
        <button onclick="navigateTo('biblioteca')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">fitness_center</span>
          <span class="font-label-caps text-[10px] mt-1">EXERCÍCIOS</span>
        </button>
        <button onclick="navigateTo('perfil')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">person</span>
          <span class="font-label-caps text-[10px] mt-1">PERFIL</span>
        </button>
      </nav>
    </div>
  `;
}

function attachDashboardListeners() {
  const circle = document.querySelector('.progress-ring-circle');
  if (circle) {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
      const offset = circumference - (75 / 100 * circumference);
      circle.style.strokeDashoffset = offset;
    }, 300);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CRIAR FICHA SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function renderCriarFicha() {
  return `
    <div class="min-h-screen pb-32">
      <!-- TopAppBar -->
      <header class="fixed top-0 z-50 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile py-xs">
        <div class="flex items-center gap-sm">
          <div class="w-10 h-10 rounded-full overflow-hidden border border-primary-fixed bg-primary-container flex items-center justify-center">
            <span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">person</span>
          </div>
          <div class="flex flex-col">
            <span class="font-label-caps text-label-caps text-on-surface-variant">GERAR COM</span>
            <span class="font-headline-md text-headline-md text-primary">IA</span>
          </div>
        </div>
      </header>
      
      <main class="px-margin-mobile mt-xs pt-16 space-y-md pb-32">
        <form id="workout-form" class="space-y-md">
          <!-- Objetivo -->
          <section>
            <h3 class="font-label-caps text-label-caps text-on-surface-variant mb-sm">OBJETIVO PRINCIPAL</h3>
            <div class="grid grid-cols-1 gap-sm">
              <button type="button" onclick="selectGoal(this, 'hipertrofia')" class="goal-card p-md border-2 border-outline-variant rounded-xl text-left transition-all hover:border-primary-fixed cursor-pointer">
                <span class="material-symbols-outlined mb-xs block text-primary-fixed">trending_up</span>
                <p class="font-label-caps text-label-caps">HIPERTROFIA</p>
                <p class="text-on-surface-variant font-body-md text-[12px] mt-base">Ganhar massa muscular</p>
              </button>
              <button type="button" onclick="selectGoal(this, 'emagrecimento')" class="goal-card p-md border-2 border-outline-variant rounded-xl text-left transition-all hover:border-primary-fixed cursor-pointer">
                <span class="material-symbols-outlined mb-xs block text-primary-fixed">trending_down</span>
                <p class="font-label-caps text-label-caps">EMAGRECIMENTO</p>
                <p class="text-on-surface-variant font-body-md text-[12px] mt-base">Perder peso com saúde</p>
              </button>
              <button type="button" onclick="selectGoal(this, 'condicionamento')" class="goal-card p-md border-2 border-outline-variant rounded-xl text-left transition-all hover:border-primary-fixed cursor-pointer">
                <span class="material-symbols-outlined mb-xs block text-primary-fixed">favorite</span>
                <p class="font-label-caps text-label-caps">CONDICIONAMENTO</p>
                <p class="text-on-surface-variant font-body-md text-[12px] mt-base">Melhorar resistência</p>
              </button>
            </div>
            <input type="hidden" id="goal" value=""/>
          </section>
          
          <!-- Dados Biométricos -->
          <section>
            <h3 class="font-label-caps text-label-caps text-on-surface-variant mb-sm">DADOS BIOMÉTRICOS</h3>
            <div class="space-y-md">
              <div class="flex flex-col space-y-base">
                <label class="font-label-caps text-label-caps text-on-surface-variant">IDADE</label>
                <input id="age" type="number" min="15" max="100" placeholder="25" class="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all"/>
              </div>
              <div class="grid grid-cols-2 gap-md">
                <div class="flex flex-col space-y-base">
                  <label class="font-label-caps text-label-caps text-on-surface-variant">PESO (KG)</label>
                  <input id="weight" type="number" min="30" step="0.5" placeholder="80" class="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all"/>
                </div>
                <div class="flex flex-col space-y-base">
                  <label class="font-label-caps text-label-caps text-on-surface-variant">ALTURA (CM)</label>
                  <input id="height" type="number" min="130" max="220" placeholder="180" class="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all"/>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Frequência -->
          <section>
            <h3 class="font-label-caps text-label-caps text-on-surface-variant mb-sm">FREQUÊNCIA SEMANAL</h3>
            <div class="flex gap-sm flex-wrap">
              <button type="button" onclick="selectFreq(this, 3)" class="freq-btn px-md py-xs border-2 border-outline-variant rounded-full font-label-caps text-label-caps cursor-pointer transition-all hover:border-primary-fixed">3x/semana</button>
              <button type="button" onclick="selectFreq(this, 4)" class="freq-btn px-md py-xs border-2 border-outline-variant rounded-full font-label-caps text-label-caps cursor-pointer transition-all hover:border-primary-fixed">4x/semana</button>
              <button type="button" onclick="selectFreq(this, 5)" class="freq-btn px-md py-xs border-2 border-outline-variant rounded-full font-label-caps text-label-caps cursor-pointer transition-all hover:border-primary-fixed">5x/semana</button>
              <button type="button" onclick="selectFreq(this, 6)" class="freq-btn px-md py-xs border-2 border-outline-variant rounded-full font-label-caps text-label-caps cursor-pointer transition-all hover:border-primary-fixed">6x/semana</button>
            </div>
            <input type="hidden" id="frequency" value=""/>
          </section>
          
          <!-- Button -->
          <button type="submit" class="w-full bg-primary-fixed text-on-primary-fixed font-headline-md text-headline-md py-md rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-sm shadow-[0_0_20px_rgba(210,240,0,0.2)] mt-lg">
            <span class="material-symbols-outlined">bolt</span>
            GERAR FICHA COM IA
          </button>
        </form>
      </main>
      
      <!-- BottomNavBar -->
      <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter pb-sm pt-xs bg-surface-container border-t-2 border-outline-variant">
        <button onclick="navigateTo('dashboard')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">home</span>
          <span class="font-label-caps text-[10px] mt-1">HOME</span>
        </button>
        <button onclick="navigateTo('criar-ficha')" class="flex flex-col items-center justify-center text-primary-fixed bg-secondary-container rounded-lg px-sm py-xs transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">edit_note</span>
          <span class="font-label-caps text-[10px] mt-1">FICHA</span>
        </button>
        <button onclick="navigateTo('biblioteca')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">fitness_center</span>
          <span class="font-label-caps text-[10px] mt-1">EXERCÍCIOS</span>
        </button>
        <button onclick="navigateTo('perfil')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">person</span>
          <span class="font-label-caps text-[10px] mt-1">PERFIL</span>
        </button>
      </nav>
    </div>
  `;
}

function attachCriarFichaListeners() {
  const form = document.getElementById('workout-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await generateWorkout();
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TREINO SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function renderTreino() {
  return `
    <div class="bg-background text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div class="fixed inset-0 bg-noise pointer-events-none"></div>
      
      <!-- Header -->
      <header class="fixed top-0 z-50 flex justify-between items-center w-full px-margin-mobile py-xs bg-surface border-b border-outline-variant">
        <button onclick="navigateTo('dashboard')" class="active:scale-95 transition-transform hover:opacity-80 flex items-center gap-xs">
          <span class="material-symbols-outlined text-primary">close</span>
          <span class="font-label-caps text-label-caps text-on-surface-variant">FIM</span>
        </button>
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile italic font-black text-primary tracking-tighter">FORGE</h1>
        <span class="material-symbols-outlined text-primary">more_vert</span>
      </header>
      
      <main class="min-h-screen flex flex-col items-center justify-between py-md px-margin-mobile relative z-10 pt-20 pb-20">
        <!-- Exercise Info -->
        <section class="w-full text-center space-y-base">
          <p class="font-label-caps text-label-caps text-primary-fixed tracking-[0.2em]">PEITO • FORÇA</p>
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg italic uppercase tracking-tight">Supino Reto</h2>
        </section>
        
        <!-- Video Placeholder -->
        <section class="w-full max-w-md aspect-video relative rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant group">
          <img class="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:scale-105" src="https://via.placeholder.com/400x225?text=Video+Exercicio" alt="Supino Reto"/>
          <div class="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <div class="w-16 h-16 rounded-full border-2 border-primary-fixed flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-primary-fixed text-4xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
            </div>
          </div>
          <div class="absolute bottom-sm left-sm bg-background/80 px-xs py-1 rounded">
            <span class="font-label-caps text-[10px] text-on-surface">GUIA DE VÍDEO</span>
          </div>
        </section>
        
        <!-- Timer -->
        <section class="flex flex-col items-center space-y-md">
          <div class="timer-ring-container flex items-center justify-center">
            <svg class="timer-svg w-full h-full" viewBox="0 0 300 300">
              <circle class="timer-circle-bg" cx="150" cy="150" r="130"></circle>
              <circle class="timer-circle-progress" cx="150" cy="150" id="progressCircle" r="130"></circle>
            </svg>
            <div class="absolute flex flex-col items-center">
              <span class="font-label-caps text-label-caps text-on-surface-variant">REPS</span>
              <span class="font-stats-xl text-stats-xl leading-none">12</span>
              <span class="font-headline-md text-headline-md text-primary-fixed mt-xs">SÉRIE 1 <span class="text-on-surface-variant/50 font-normal">DE 4</span></span>
            </div>
          </div>
          
          <!-- Controls -->
          <div class="flex items-center gap-xl">
            <button onclick="decreaseReps()" class="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant active:scale-90 transition-all hover:bg-surface-container">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button onclick="toggleTimer()" class="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center text-primary active:scale-90 transition-all border-2 border-outline" id="toggleTimer">
              <span class="material-symbols-outlined text-3xl">pause</span>
            </button>
            <button onclick="increaseReps()" class="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant active:scale-90 transition-all hover:bg-surface-container">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>
        
        <!-- CTA -->
        <section class="w-full max-w-md pb-xs">
          <button onclick="completeSet()" class="w-full bg-primary-fixed text-on-primary-fixed font-headline-md text-headline-md py-md rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-xs shadow-[0_0_20px_rgba(210,240,0,0.2)]">
            SÉRIE CONCLUÍDA
            <span class="material-symbols-outlined">check_circle</span>
          </button>
          <div class="mt-sm flex justify-between px-xs">
            <div class="flex flex-col">
              <span class="font-label-caps text-[10px] text-on-surface-variant">ÚLTIMO PESO</span>
              <span class="font-headline-md text-[18px]">60 KG</span>
            </div>
            <div class="flex flex-col text-right">
              <span class="font-label-caps text-[10px] text-on-surface-variant">DESCANSO EST.</span>
              <span class="font-headline-md text-[18px]">90 SEG</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
}

function attachTreinoListeners() {
  const circle = document.getElementById('progressCircle');
  if (circle) {
    let progress = 200;
    let isPaused = false;
    
    window.timerInterval = setInterval(() => {
      if (!isPaused) {
        progress = (progress + 1) % 816.8;
        circle.style.strokeDashoffset = progress;
      }
    }, 100);
    
    window.toggleTimer = function() {
      isPaused = !isPaused;
      const icon = document.getElementById('toggleTimer').querySelector('.material-symbols-outlined');
      icon.textContent = isPaused ? 'play_arrow' : 'pause';
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BIBLIOTECA SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function renderBiblioteca() {
  return `
    <div class="min-h-screen pb-32">
      <!-- TopAppBar -->
      <header class="fixed top-0 z-50 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile py-xs">
        <div class="flex items-center gap-sm">
          <div class="w-10 h-10 rounded-full overflow-hidden border border-primary-fixed bg-primary-container flex items-center justify-center">
            <span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">person</span>
          </div>
          <div class="flex flex-col">
            <span class="font-label-caps text-label-caps text-on-surface-variant">BIBLIOTECA</span>
            <span class="font-headline-md text-headline-md text-primary">EXERCÍCIOS</span>
          </div>
        </div>
      </header>
      
      <main class="px-margin-mobile mt-xs pt-16 space-y-md pb-32">
        <!-- Search -->
        <div class="relative neon-glow">
          <input id="search-exercise" type="text" placeholder="Buscar exercício..." class="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface py-md px-sm transition-all"/>
          <span class="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">search</span>
        </div>
        
        <!-- Filters -->
        <div class="flex gap-sm overflow-x-auto pb-xs scrollbar-hide">
          <button class="filter-chip px-md py-xs border-2 border-outline-variant rounded-full font-label-caps text-label-caps cursor-pointer transition-all flex-shrink-0" data-filter="all">TODOS</button>
          <button class="filter-chip px-md py-xs border-2 border-outline-variant rounded-full font-label-caps text-label-caps cursor-pointer transition-all flex-shrink-0" data-filter="peito">PEITO</button>
          <button class="filter-chip px-md py-xs border-2 border-outline-variant rounded-full font-label-caps text-label-caps cursor-pointer transition-all flex-shrink-0" data-filter="costas">COSTAS</button>
          <button class="filter-chip px-md py-xs border-2 border-outline-variant rounded-full font-label-caps text-label-caps cursor-pointer transition-all flex-shrink-0" data-filter="pernas">PERNAS</button>
        </div>
        
        <!-- Exercise Grid -->
        <section id="exercises-grid" class="grid grid-cols-1 gap-md">
          <div class="exercise-card p-md border border-outline-variant rounded-xl cursor-pointer hover:border-primary-fixed transition-all">
            <div class="h-32 bg-surface-container-high rounded-lg mb-md overflow-hidden">
              <img src="https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg" alt="Supino" class="w-full h-full object-cover"/>
            </div>
            <h3 class="font-headline-md text-headline-md text-primary mb-xs">Supino Reto</h3>
            <p class="text-on-surface-variant font-body-md text-sm mb-sm">Peito • 4 séries</p>
            <div class="flex gap-xs">
              <span class="bg-surface-container-highest px-xs py-1 rounded text-[10px] font-label-caps">PEITO</span>
            </div>
          </div>
          
          <div class="exercise-card p-md border border-outline-variant rounded-xl cursor-pointer hover:border-primary-fixed transition-all">
            <div class="h-32 bg-surface-container-high rounded-lg mb-md overflow-hidden">
              <img src="https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Full_Squat/0.jpg" alt="Agachamento" class="w-full h-full object-cover"/>
            </div>
            <h3 class="font-headline-md text-headline-md text-primary mb-xs">Agachamento Livre</h3>
            <p class="text-on-surface-variant font-body-md text-sm mb-sm">Pernas • 5 séries</p>
            <div class="flex gap-xs">
              <span class="bg-surface-container-highest px-xs py-1 rounded text-[10px] font-label-caps">PERNAS</span>
            </div>
          </div>
        </section>
      </main>
      
      <!-- BottomNavBar -->
      <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter pb-sm pt-xs bg-surface-container border-t-2 border-outline-variant">
        <button onclick="navigateTo('dashboard')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">home</span>
          <span class="font-label-caps text-[10px] mt-1">HOME</span>
        </button>
        <button onclick="navigateTo('criar-ficha')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">edit_note</span>
          <span class="font-label-caps text-[10px] mt-1">FICHA</span>
        </button>
        <button onclick="navigateTo('biblioteca')" class="flex flex-col items-center justify-center text-primary-fixed bg-secondary-container rounded-lg px-sm py-xs transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">fitness_center</span>
          <span class="font-label-caps text-[10px] mt-1">EXERCÍCIOS</span>
        </button>
        <button onclick="navigateTo('perfil')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">person</span>
          <span class="font-label-caps text-[10px] mt-1">PERFIL</span>
        </button>
      </nav>
    </div>
  `;
}

function attachBibliotecaListeners() {
  const searchInput = document.getElementById('search-exercise');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.exercise-card');
      cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(query) ? '' : 'none';
      });
    });
  }
  
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('border-primary-fixed'));
      chip.classList.add('border-primary-fixed');
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PERFIL SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function renderPerfil() {
  const user = APP_STATE.currentUser;
  const weight = localStorage.getItem('userWeight') || 80;
  const height = localStorage.getItem('userHeight') || 180;
  const bmi = calculateBMI(weight, height);
  
  return `
    <div class="min-h-screen pb-32">
      <!-- TopAppBar -->
      <header class="fixed top-0 z-50 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile py-xs">
        <div class="flex items-center gap-sm">
          <div class="w-10 h-10 rounded-full overflow-hidden border border-primary-fixed bg-primary-container flex items-center justify-center">
            <span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">person</span>
          </div>
          <div class="flex flex-col">
            <span class="font-label-caps text-label-caps text-on-surface-variant">MEU</span>
            <span class="font-headline-md text-headline-md text-primary">PERFIL</span>
          </div>
        </div>
      </header>
      
      <main class="px-margin-mobile mt-xs pt-16 space-y-md pb-32">
        <!-- Profile Hero -->
        <section class="bg-surface-container border border-outline-variant rounded-xl p-md text-center">
          <div class="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-sm border-2 border-primary-fixed">
            <span class="material-symbols-outlined text-on-primary-container text-3xl" style="font-variation-settings: 'FILL' 1;">person</span>
          </div>
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-xs">${sanitizeInput(user.name)}</h2>
          <p class="text-on-surface-variant font-body-md mb-md">${user.email}</p>
          <div class="bg-surface-container-low p-xs rounded inline-block">
            <span class="font-label-caps text-label-caps text-primary-fixed">ELITE LEVEL 15</span>
          </div>
        </section>
        
        <!-- Stats Grid -->
        <section class="grid grid-cols-2 gap-md">
          <div class="bg-surface-container-low border border-outline-variant rounded-xl p-md">
            <p class="font-label-caps text-[10px] text-on-surface-variant mb-sm">PESO</p>
            <p class="font-headline-md text-headline-md text-primary">${weight} kg</p>
          </div>
          <div class="bg-surface-container-low border border-outline-variant rounded-xl p-md">
            <p class="font-label-caps text-[10px] text-on-surface-variant mb-sm">ALTURA</p>
            <p class="font-headline-md text-headline-md text-primary">${height} cm</p>
          </div>
          <div class="bg-surface-container-low border border-outline-variant rounded-xl p-md">
            <p class="font-label-caps text-[10px] text-on-surface-variant mb-sm">IMC</p>
            <p class="font-headline-md text-headline-md text-primary">${bmi}</p>
          </div>
          <div class="bg-surface-container-low border border-outline-variant rounded-xl p-md">
            <p class="font-label-caps text-[10px] text-on-surface-variant mb-sm">STATUS</p>
            <p class="font-headline-md text-headline-md text-primary">${getBMICategory(bmi)}</p>
          </div>
        </section>
        
        <!-- Badges -->
        <section>
          <h3 class="font-label-caps text-label-caps text-on-surface-variant mb-sm">CONQUISTAS</h3>
          <div class="grid grid-cols-2 gap-md">
            <div class="bg-surface-container border border-primary-fixed rounded-lg p-md text-center">
              <span class="material-symbols-outlined text-primary-fixed mb-xs block">workspace_premium</span>
              <p class="font-label-caps text-[10px] text-on-surface-variant">7 DIAS SEGUIDOS</p>
            </div>
            <div class="bg-surface-container border border-outline-variant rounded-lg p-md text-center opacity-50">
              <span class="material-symbols-outlined text-on-surface-variant mb-xs block">military_tech</span>
              <p class="font-label-caps text-[10px] text-on-surface-variant">50 KM RODADOS</p>
            </div>
          </div>
        </section>
        
        <!-- Logout -->
        <button onclick="performLogout()" class="w-full bg-error text-on-error font-headline-md text-headline-md py-md rounded-xl active:scale-[0.98] transition-all mt-lg">
          SAIR DA CONTA
        </button>
      </main>
      
      <!-- BottomNavBar -->
      <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter pb-sm pt-xs bg-surface-container border-t-2 border-outline-variant">
        <button onclick="navigateTo('dashboard')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">home</span>
          <span class="font-label-caps text-[10px] mt-1">HOME</span>
        </button>
        <button onclick="navigateTo('criar-ficha')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">edit_note</span>
          <span class="font-label-caps text-[10px] mt-1">FICHA</span>
        </button>
        <button onclick="navigateTo('biblioteca')" class="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs hover:bg-surface-bright transition-colors transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined">fitness_center</span>
          <span class="font-label-caps text-[10px] mt-1">EXERCÍCIOS</span>
        </button>
        <button onclick="navigateTo('perfil')" class="flex flex-col items-center justify-center text-primary-fixed bg-secondary-container rounded-lg px-sm py-xs transition-all duration-150 active:scale-90">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">person</span>
          <span class="font-label-caps text-[10px] mt-1">PERFIL</span>
        </button>
      </nav>
    </div>
  `;
}

function attachPerfilListeners() {
  // Nothing to attach for now
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function toggleAuthScreen() {
  const loginScreen = document.getElementById('login-screen');
  const registerScreen = document.getElementById('register-screen');
  
  if (loginScreen && registerScreen) {
    if (loginScreen.classList.contains('hidden-screen')) {
      loginScreen.classList.remove('hidden-screen');
      registerScreen.classList.add('hidden-screen');
    } else {
      loginScreen.classList.add('hidden-screen');
      registerScreen.classList.remove('hidden-screen');
    }
  }
}

function performLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  if (!email || !password) {
    alert('Preencha todos os campos!');
    return;
  }
  
  const user = {
    id: 'user_' + Date.now(),
    email: sanitizeInput(email),
    name: email.split('@')[0],
    loginTime: new Date().toISOString()
  };
  
  APP_STATE.currentUser = user;
  localStorage.setItem('currentUser', safeStringify(user));
  localStorage.setItem('userWorkouts', safeStringify([]));
  
  navigateTo('dashboard');
}

function performRegister() {
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const age = document.getElementById('register-age').value;
  const weight = document.getElementById('register-weight').value;
  const height = document.getElementById('register-height').value;
  
  if (!name || !email || !password || !age || !weight || !height) {
    alert('Preencha todos os campos!');
    return;
  }
  
  const user = {
    id: 'user_' + Date.now(),
    name: sanitizeInput(name),
    email: sanitizeInput(email),
    age: parseInt(age),
    weight: parseFloat(weight),
    height: parseInt(height),
    loginTime: new Date().toISOString()
  };
  
  APP_STATE.currentUser = user;
  localStorage.setItem('currentUser', safeStringify(user));
  localStorage.setItem('userWeight', weight);
  localStorage.setItem('userHeight', height);
  localStorage.setItem('userWorkouts', safeStringify([]));
  
  navigateTo('dashboard');
}

function performLogout() {
  APP_STATE.currentUser = null;
  APP_STATE.currentScreen = 'auth';
  localStorage.removeItem('currentUser');
  renderScreen();
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function selectGoal(elem, goal) {
  document.querySelectorAll('.goal-card').forEach(card => {
    card.classList.remove('border-primary-fixed', 'bg-primary-container/10');
  });
  elem.classList.add('border-primary-fixed', 'bg-primary-container/10');
  document.getElementById('goal').value = goal;
}

function selectFreq(elem, freq) {
  document.querySelectorAll('.freq-btn').forEach(btn => {
    btn.classList.remove('border-primary-fixed', 'bg-primary-container/10');
  });
  elem.classList.add('border-primary-fixed', 'bg-primary-container/10');
  document.getElementById('frequency').value = freq;
}

function increaseReps() {
  const repsSpan = document.querySelector('.font-stats-xl');
  if (repsSpan) {
    let reps = parseInt(repsSpan.textContent);
    reps = Math.min(reps + 1, 30);
    repsSpan.textContent = reps;
  }
}

function decreaseReps() {
  const repsSpan = document.querySelector('.font-stats-xl');
  if (repsSpan) {
    let reps = parseInt(repsSpan.textContent);
    reps = Math.max(reps - 1, 1);
    repsSpan.textContent = reps;
  }
}

function completeSet() {
  alert('Série concluída! Parabéns! 🎉');
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKOUT GENERATION (Groq AI)
// ─────────────────────────────────────────────────────────────────────────────

async function generateWorkout() {
  if (APP_STATE.isGeneratingWorkout) return;
  
  const goal = document.getElementById('goal').value;
  const age = document.getElementById('age').value;
  const weight = document.getElementById('weight').value;
  const height = document.getElementById('height').value;
  const frequency = document.getElementById('frequency').value;
  
  if (!goal || !age || !weight || !height || !frequency) {
    alert('Preencha todos os campos!');
    return;
  }
  
  APP_STATE.isGeneratingWorkout = true;
  
  try {
    const bmi = calculateBMI(weight, height);
    const prompt = `
      Gere uma ficha de treino profissional em JSON.
      Dados do usuário: Idade ${age}, Peso ${weight}kg, Altura ${height}cm, IMC ${bmi}, Objetivo: ${goal}, Frequência: ${frequency}x/semana.
      Retorne um JSON válido com:
      { "nome": "string", "objetivo": "${goal}", "diasSemana": [Array], "exercicios": [Array com name, series, reps, rest] }
    `;
    
    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${APP_STATE.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });
    
    if (!response.ok) {
      throw new Error('Falha na geração. Usando fallback.');
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const workout = JSON.parse(jsonMatch[0]);
      APP_STATE.currentWorkout = workout;
      localStorage.setItem('currentWorkout', safeStringify(workout));
      alert('Ficha gerada com sucesso! 🚀');
      navigateTo('dashboard');
    }
  } catch (error) {
    console.error('Erro ao gerar ficha:', error);
    // Fallback: criar ficha padrão
    const fallbackWorkout = {
      nome: `Ficha ${goal}`,
      objetivo: goal,
      diasSemana: ['Seg', 'Qua', 'Sex'],
      exercicios: [
        { name: 'Supino', series: 4, reps: 8, rest: 120 },
        { name: 'Agachamento', series: 4, reps: 8, rest: 120 }
      ]
    };
    APP_STATE.currentWorkout = fallbackWorkout;
    localStorage.setItem('currentWorkout', safeStringify(fallbackWorkout));
    alert('Ficha criada com sucesso! 🚀');
    navigateTo('dashboard');
  }
  
  APP_STATE.isGeneratingWorkout = false;
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderScreen();
  
  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed:', err));
  }
});
