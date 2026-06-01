// NEXTFIT PRO - APPLICATION ENGINE
// Handles state, routing, database, timer, workout builder, and local storage persistence.

// 1. EXERCISE DATABASE (WITH RELIABLE YOUTUBE IFRAMES AND STEP-BY-STEP INSTRUCTIONS)
const EXERCISES_DB = {
  "supino_reto": {
    name: "Supino Reto com Barra",
    muscle: "Peito",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg",
    video: "",
    steps: [
      "Deite-se no banco plano com os pés apoiados firmemente no chão.",
      "Segure a barra com uma pegada ligeiramente mais larga que a largura dos ombros.",
      "Retire a barra do suporte e desça-a lentamente até a linha do mamilo.",
      "Empurre a barra para cima estendendo os cotovelos, sem travá-los no topo."
    ],
    rest: 60,
    tips: "Não tire os glúteos do banco e evite bater a barra com força no peito."
  },
  "supino_inclinado_halter": {
    name: "Supino Inclinado com Halteres",
    muscle: "Peito",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Incline_Dumbbell_Press/0.jpg",
    video: "",
    steps: [
      "Ajuste o banco para uma inclinação entre 30 e 45 graus.",
      "Sente-se e apoie os halteres sobre as coxas, depois deite-se levantando os halteres.",
      "Desça os halteres de forma controlada até as laterais do peitoral superior.",
      "Empurre os halteres para cima alinhados com o peito, aproximando-os levemente."
    ],
    rest: 60,
    tips: "Mantenha os cotovelos a aproximadamente 45-60 graus em relação ao tronco."
  },
  "crucifixo_maquina": {
    name: "Crucifixo na Máquina (Peck Deck)",
    muscle: "Peito",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Butterfly/0.jpg",
    video: "",
    steps: [
      "Sente-se no aparelho mantendo as costas bem apoiadas.",
      "Segure os pegadores com os braços semi-flexionados.",
      "Feche os braços contraindo o peitoral até as mãos se encontrarem.",
      "Retorne lentamente à posição inicial."
    ],
    rest: 60,
    tips: "Mantenha o peito estufado e foque em 'esmagar' o muscle no meio do movimento."
  },
  "crucifixo_polia": {
    name: "Crossover na Polia (Crucifixo Cabo)",
    muscle: "Peito",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Cable_Crossover/0.jpg",
    video: "",
    steps: [
      "Posicione as polias na altura média ou alta e dê um passo à frente.",
      "Mantenha uma leve flexão nos cotovelos e incline levemente o tronco.",
      "Traga as mãos para frente e para baixo até se encontrarem, esmagando o peito.",
      "Abra os braços lentamente controlando a tensão do cabo."
    ],
    rest: 60,
    tips: "Evite usar o impulso do corpo, controle o movimento em ambas as fases."
  },
  "agachamento_barra": {
    name: "Agachamento Livre com Barra",
    muscle: "Pernas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Full_Squat/0.jpg",
    video: "",
    steps: [
      "Apoie a barra sobre a musculatura do trapézio.",
      "Afaste os pés na largura dos ombros, apontando os dedos ligeiramente para fora.",
      "Desça até que as coxas fiquem paralelas ao chão.",
      "Empurre o chão com os calcanhares para subir."
    ],
    rest: 60,
    tips: "Mantenha o peito aberto e não deixe os joelhos colapsarem para dentro."
  },
  "agachamento_hack": {
    name: "Agachamento Hack Máquina",
    muscle: "Pernas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Hack_Squat/0.jpg",
    video: "",
    steps: [
      "Posicione-se no Hack com os ombros apoiados e as costas firmes no encosto.",
      "Coloque os pés na plataforma na largura dos ombros.",
      "Destrave a máquina e agache de forma controlada até cerca de 90 graus.",
      "Empurre a plataforma para retornar, sem bloquear os joelhos no topo."
    ],
    rest: 60,
    tips: "Mantenha os calcanhares totalmente apoiados na plataforma durante todo o movimento."
  },
  "leg_press": {
    name: "Leg Press 45º",
    muscle: "Pernas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Leg_Press/0.jpg",
    video: "",
    steps: [
      "Sente-se no Leg Press e apoie os pés na plataforma na largura dos ombros.",
      "Destrave o aparelho e desça o peso flexionando os joelhos controladamente.",
      "Empurre a plataforma de volta sem hiperestender os joelhos no final."
    ],
    rest: 60,
    tips: "Não deixe a lombar descolar do encosto durante a descida do peso."
  },
  "cadeira_extensora": {
    name: "Cadeira Extensora",
    muscle: "Pernas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Leg_Extensions/0.jpg",
    video: "",
    steps: [
      "Sente-se na máquina com as costas bem apoiadas.",
      "Ajuste o rolo logo acima do peito do pé.",
      "Estenda os joelhos completamente, contraindo a coxa.",
      "Desça lentamente segurando o peso."
    ],
    rest: 60,
    tips: "Faça uma pausa de 1 segundo no topo da contração máxima."
  },
  "mesa_flexora": {
    name: "Mesa Flexora",
    muscle: "Pernas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Lying_Leg_Curls/0.jpg",
    video: "",
    steps: [
      "Deite-se de bruços na máquina.",
      "Posicione o rolo acima do calcanhar.",
      "Flexione os joelhos puxando o peso em direção aos glúteos.",
      "Retorne lentamente à posição estendida."
    ],
    rest: 60,
    tips: "Evite levantar o quadril do banco durante a execução."
  },
  "stiff_barra": {
    name: "Stiff com Barra",
    muscle: "Pernas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Stiff-Legged_Barbell_Deadlift/0.jpg",
    video: "",
    steps: [
      "Fique em pé segurando a barra com os braços estendidos à frente das coxas.",
      "Mantenha as pernas semi-estendidas (joelhos destravados) e costas retas.",
      "Incline o tronco para a frente empurrando o quadril para trás.",
      "Desça a barra rente às pernas até sentir o posterior alongar, depois suba contraindo os glúteos."
    ],
    rest: 60,
    tips: "Nunca curve a coluna lombar durante a descida; mantenha as escápulas ativas."
  },
  "panturrilha_maquina": {
    name: "Panturrilha Máquina",
    muscle: "Pernas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Standing_Calf_Raises/0.jpg",
    video: "",
    steps: [
      "Posicione os ombros sob as almofadas e as pontas dos pés no degrau.",
      "Desça os calcanhares o máximo que puder alongando a panturrilha.",
      "Suba ficando na ponta dos pés, contraindo no topo."
    ],
    rest: 60,
    tips: "Faça o movimento com a máxima amplitude possível."
  },
  "rosca_direta": {
    name: "Rosca Direta com Halteres",
    muscle: "Braços",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Alternate_Bicep_Curl/0.jpg",
    video: "",
    steps: [
      "Fique de pé com um halter em cada mão.",
      "Mantenha os cotovelos próximos ao tronco o tempo todo.",
      "Flexione os cotovelos, subindo os halteres em direção aos ombros."
    ],
    rest: 60,
    tips: "Evite balançar as costas ou usar o impulso do corpo."
  },
  "rosca_martelo": {
    name: "Rosca Martelo com Halteres",
    muscle: "Braços",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Hammer_Curls/0.jpg",
    video: "",
    steps: [
      "Fique em pé segurando os halteres com as palmas das mãos voltadas para dentro (pegada neutra).",
      "Mantenha os cotovelos colados ao tronco.",
      "Eleve os halteres flexionando os braços sem rotacionar os punhos.",
      "Desça lentamente controlando o movimento."
    ],
    rest: 60,
    tips: "Excelente exercício para trabalhar o braquiorradial (antebraço) e bíceps."
  },
  "triceps_pulley": {
    name: "Tríceps no Pulley com Corda",
    muscle: "Braços",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Triceps_Pushdown/0.jpg",
    video: "",
    steps: [
      "Em pé de frente para a polia alta, segure a corda.",
      "Mantenha os cotovelos colados ao lado do corpo.",
      "Puxe a corda para baixo até estender totalmente os braços, abrindo a corda no final.",
      "Retorne controlando a subida."
    ],
    rest: 60,
    tips: "Não deixe os cotovelos se moverem para frente na fase de subida."
  },
  "triceps_testa": {
    name: "Tríceps Testa com Barra EZ",
    muscle: "Braços",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/EZ-Bar_Triceps_Extension/0.jpg",
    video: "",
    steps: [
      "Deite-se no banco plano segurando a barra EZ acima do peito com braços estendidos.",
      "Flexione apenas os cotovelos, descendo a barra em direção à testa.",
      "Mantenha os cotovelos apontados para cima e paralelos (não abra para os lados).",
      "Estenda os cotovelos retornando à posição inicial."
    ],
    rest: 60,
    tips: "Controle muito bem a descida para evitar acidentes com a testa."
  },
  "desenvolvimento_ombro": {
    name: "Desenvolvimento de Ombros com Halteres",
    muscle: "Ombros",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Shoulder_Press/0.jpg",
    video: "",
    steps: [
      "Sente-se em um banco a 90 graus.",
      "Segure os halteres na altura dos ombros.",
      "Empurre os halteres para cima até estender os braços."
    ],
    rest: 60,
    tips: "Mantenha as escápulas apoiadas no banco."
  },
  "elevacao_lateral": {
    name: "Elevação Lateral com Halteres",
    muscle: "Ombros",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Side_Lateral_Raise/0.jpg",
    video: "",
    steps: [
      "Fique de pé com halteres ao lado do corpo.",
      "Eleve os braços lateralmente mantendo leve flexão nos cotovelos.",
      "Desça de forma controlada."
    ],
    rest: 60,
    tips: "Inicie o movimento focando em empurrar os halteres para os lados."
  },
  "elevacao_frontal": {
    name: "Elevação Frontal com Halteres",
    muscle: "Ombros",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Front_Raise/0.jpg",
    video: "",
    steps: [
      "Fique em pé com os halteres à frente das coxas.",
      "Eleve um braço de cada vez ou ambos para a frente até a altura dos ombros.",
      "Desça controladamente até a posição inicial."
    ],
    rest: 60,
    tips: "Não utilize impulsos das costas ou do quadril para erguer os pesos."
  },
  "remada_alta": {
    name: "Remada Alta na Polia",
    muscle: "Ombros",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Upright_Cable_Row/0.jpg",
    video: "",
    steps: [
      "Fique em pé de frente para a polia baixa, segurando a barra reta.",
      "Puxe a barra para cima rente ao corpo em direção ao queixo.",
      "Eleve os cotovelos mantendo-os sempre acima do nível das mãos.",
      "Desça lentamente resistindo à carga."
    ],
    rest: 60,
    tips: "Mantenha o abdômen ativado e a coluna ereta durante a puxada."
  },
  "remada_curvada": {
    name: "Remada Unilateral com Halter",
    muscle: "Costas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/One-Arm_Dumbbell_Row/0.jpg",
    video: "",
    steps: [
      "Apoie um joelho e a mão do mesmo lado em um banco plano.",
      "Puxe o halter em direção ao quadril.",
      "Desça lentamente controlando o peso."
    ],
    rest: 60,
    tips: "Concentre a força nas costas, puxando com o cotovelo."
  },
  "remada_baixa_triangulo": {
    name: "Remada Baixa Sentado com Triângulo",
    muscle: "Costas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Seated_Cable_Rows/0.jpg",
    video: "",
    steps: [
      "Sente-se no aparelho, apoie os pés e segure o puxador triângulo.",
      "Mantenha a postura ereta e puxe o triângulo em direção ao abdômen inferior.",
      "Aproxime as escápulas no final do movimento, contraindo bem as costas.",
      "Estenda os braços de forma controlada permitindo o alongamento dorsal."
    ],
    rest: 60,
    tips: "Evite balançar excessivamente o tronco para frente e para trás."
  },
  "puxada_frente": {
    name: "Puxada Frontal (Pulldown)",
    muscle: "Costas",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Wide-Grip_Lat_Pulldown/0.jpg",
    video: "",
    steps: [
      "Sente-se no aparelho de puxada e trave os joelhos.",
      "Segure a barra com a pegada aberta.",
      "Puxe a barra em direção à parte superior do peito.",
      "Retorne controlando o movimento."
    ],
    rest: 60,
    tips: "Estufe o peito e puxe focando em fechar as escápulas nas costas."
  },
  "prancha_abdominal": {
    name: "Prancha Abdominal",
    muscle: "Core",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Plank/0.jpg",
    video: "",
    steps: [
      "Apoie os antebraços e as pontas dos pés no chão.",
      "Mantenha o corpo alinhado e o abdômen contraído.",
      "Respire normalmente."
    ],
    rest: 60,
    tips: "Não deixe o quadril cair ou subir excessivamente."
  },
  "abdominal_infra": {
    name: "Abdominal Infra no Banco",
    muscle: "Core",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Flat_Bench_Lying_Leg_Raise/0.jpg",
    video: "",
    steps: [
      "Deite-se no banco de costas e segure o banco atrás da cabeça.",
      "Mantenha as pernas semi-estendidas e eleve-as até ficarem verticais.",
      "Desça as pernas lentamente até ficarem quase paralelas ao chão.",
      "Mantenha a lombar bem apoiada e pressione o abdômen."
    ],
    rest: 60,
    tips: "Faça o movimento de forma lenta e não deixe as pernas tocarem o chão."
  },
  "esteira": {
    name: "Cardio - Corrida na Esteira",
    muscle: "Cardio",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Treadmill_Running/0.jpg",
    video: "",
    steps: [
      "Suba na esteira, selecione a velocidade confortável de corrida.",
      "Mantenha uma passada firme e ritmada.",
      "Utilize a inclinação ideal se prescrita."
    ],
    rest: 60,
    tips: "Mantenha a postura ereta e atente-se ao amortecimento."
  },
  "bicicleta_ergometrica": {
    name: "Cardio - Bicicleta Ergométrica",
    muscle: "Cardio",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Bicycling/0.jpg",
    video: "",
    steps: [
      "Ajuste o selim na altura do quadril ao lado da bicicleta.",
      "Sente-se e pedale em ritmo constante mantendo a resistência adequada.",
      "Apoie as mãos suavemente no guidão."
    ],
    rest: 60,
    tips: "Evite balançar os quadris de um lado para o outro na pedalada."
  }
};


// 2. DEFAULT WORKOUT SPLITS (TREINO A, B, C)
const DEFAULT_FICHAS = [
  {
    id: "ficha_hipertrofia_pro",
    name: "Ficha Hipertrofia Pro (A/B/C)",
    objective: "Hipertrofia",
    level: "Intermediário",
    days: 3,
    time: 60,
    treinoA: {
      name: "Treino A - Peito, Ombro e Tríceps",
      exercises: [
        { id: "supino_reto", setsCount: 4, reps: "8-12", weight: 20 },
        { id: "crucifixo_maquina", setsCount: 3, reps: "10-15", weight: 15 },
        { id: "desenvolvimento_ombro", setsCount: 3, reps: "10-12", weight: 12 },
        { id: "elevacao_lateral", setsCount: 3, reps: "12-15", weight: 8 },
        { id: "triceps_pulley", setsCount: 4, reps: "10-12", weight: 15 }
      ]
    },
    treinoB: {
      name: "Treino B - Costas, Bíceps e Core",
      exercises: [
        { id: "puxada_frente", setsCount: 4, reps: "8-12", weight: 30 },
        { id: "remada_curvada", setsCount: 3, reps: "10-12", weight: 16 },
        { id: "rosca_direta", setsCount: 4, reps: "10-12", weight: 10 },
        { id: "prancha_abdominal", setsCount: 3, reps: "45 segundos", weight: 0 },
        { id: "esteira", setsCount: 1, reps: "15 min", weight: 0 }
      ]
    },
    treinoC: {
      name: "Treino C - Pernas Completas",
      exercises: [
        { id: "agachamento_barra", setsCount: 4, reps: "8-10", weight: 30 },
        { id: "leg_press", setsCount: 3, reps: "10-12", weight: 60 },
        { id: "cadeira_extensora", setsCount: 3, reps: "12-15", weight: 25 },
        { id: "mesa_flexora", setsCount: 3, reps: "10-12", weight: 20 },
        { id: "panturrilha_maquina", setsCount: 4, reps: "15-20", weight: 30 }
      ]
    }
  }
];

// 3. APPLICATION STATE
let state = {
  isLoggedIn: false,
  userName: "Fernando Carmo",
  currentFicha: null, // The active Ficha
  previousFicha: null, // Previous Ficha used as a non-repetition reference
  expirationAlertDismissed: false, // Flag to avoid repeatedly showing modal in a single session
  currentSplit: "A",  // "A", "B", or "C"
  history: [],        // Saved completed workouts or generated plans
  activeWorkout: null // { split: "A", currentExerciseIndex: 0, startTime: Date.now(), logs: [] }
};

// Login Logic
const performLogin = () => {
  const email = document.getElementById("login-email").value;
  if(email) {
    state.isLoggedIn = true;
    state.userName = email.split("@")[0];
    saveStateToStorage();
    document.getElementById("login-overlay").style.display = "none";
    
    // Update name in UI
    document.querySelectorAll(".user-info h4").forEach(el => el.textContent = state.userName);
  }
};

const checkLoginStatus = () => {
  if (state.isLoggedIn) {
    document.getElementById("login-overlay").style.display = "none";
    document.querySelectorAll(".user-info h4").forEach(el => el.textContent = state.userName);
  } else {
    document.getElementById("login-overlay").style.display = "flex";
  }
};

const performLogout = () => {
  if (confirm("Deseja sair da conta atual?")) {
    state.isLoggedIn = false;
    state.userName = "";
    saveStateToStorage();
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
    document.getElementById("login-overlay").style.display = "flex";
  }
};

// 4. SOUND EFFECTS SYNTHESIZER (WEB AUDIO API - OFFLINE FRIENDLY)
const playAlertSound = (type = "beep") => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === "beep") {
      // Warm synth beep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === "double-beep") {
      // Double beep for finish
      [0, 0.2].forEach((delay) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime); // C6 note
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.25);
        }, delay * 1000);
      });
    }
  } catch (e) {
    console.warn("Audio Context not supported or interaction required.", e);
  }
};

// 5. LOCAL STORAGE ENGINE
const loadStateFromStorage = () => {
  const saved = localStorage.getItem("treinox_ai_state");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Explicitly restore each field to avoid Object.assign array-merge bugs
      state.isLoggedIn = parsed.isLoggedIn !== undefined ? parsed.isLoggedIn : false;
      state.userName = parsed.userName || "";
      state.currentFicha = parsed.currentFicha || null;
      state.previousFicha = parsed.previousFicha || null;
      state.expirationAlertDismissed = parsed.expirationAlertDismissed !== undefined ? parsed.expirationAlertDismissed : false;
      state.currentSplit = parsed.currentSplit || "A";
      state.history = Array.isArray(parsed.history) ? parsed.history : [];
      state.activeWorkout = parsed.activeWorkout || null;
    } catch (e) {
      console.error("Error parsing storage state, resetting.", e);
      state.history = [];
    }
  } else {
    // Set default if empty ONLY on first load
    state.currentFicha = JSON.parse(JSON.stringify(DEFAULT_FICHAS[0]));
    state.history = [];
  }
  
  if (!state.history) {
    state.history = [];
  }
  saveStateToStorage();
};

const saveStateToStorage = () => {
  localStorage.setItem("treinox_ai_state", JSON.stringify(state));
};

// 6. ROUTER (TABS NAVIGATION)
const navigateTo = (pageId) => {
  // Hide active workout overlays
  closeRestTimer();
  
  // Update sidebar links active status
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
    if (item.dataset.page === pageId) {
      item.classList.add("active");
    }
  });

  // Mobile nav updates
  document.querySelectorAll(".mobile-nav-item").forEach(item => {
    item.classList.remove("active");
    if (item.dataset.page === pageId) {
      item.classList.add("active");
    }
  });

  // Hide all page sections
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add("active");
    
    // Trigger specific page load actions
    if (pageId === "dashboard") {
      renderDashboard();
    } else if (pageId === "biblioteca") {
      renderLibrary();
    } else if (pageId === "historico") {
      renderHistory();
    }
  }
};

// 7. RENDER FUNCTIONS

// Render current Ficha dashboard
const renderDashboard = () => {
  const container = document.getElementById("dashboard-workout-content");
  if (!container) return;

  const ficha = state.currentFicha;
  if (!ficha) {
    container.innerHTML = `
      <div class="card col-span-12 text-center py-10">
        <h2 class="font-headline-md mb-2">Nenhuma Ficha Ativa</h2>
        <p class="text-secondary mb-6">Crie uma ficha personalizada com IA ou escolha um plano padrão para começar.</p>
        <button class="btn-primary" onclick="navigateTo('generator')">Criar Ficha com IA</button>
      </div>
    `;
    return;
  }

  // Update header text
  document.getElementById("dashboard-ficha-title").textContent = ficha.name;
  document.getElementById("dashboard-ficha-info").textContent = `Foco: ${ficha.objective} | Nível: ${ficha.level}`;

  const validityContainer = document.getElementById("dashboard-ficha-validity");
  if (validityContainer) {
    if (ficha.expiresAt) {
      const daysLeft = Math.ceil((ficha.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
      const formattedExpiryDate = new Date(ficha.expiresAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });

      let badgeClass = "validity-badge valid";
      let statusText = `Validade: até ${formattedExpiryDate} (${daysLeft} dias restantes)`;

      if (daysLeft < 0) {
        badgeClass = "validity-badge expired";
        statusText = `Ficha expirada em ${formattedExpiryDate}! Crie uma nova ficha.`;
      } else if (daysLeft <= 3) {
        badgeClass = "validity-badge warning";
        statusText = `Vence em ${daysLeft} dias (${formattedExpiryDate}) - Prepare-se para renovar!`;
      }

      validityContainer.innerHTML = `
        <span class="${badgeClass}">
          <span class="material-symbols-outlined">schedule</span>
          ${statusText}
        </span>
      `;
    } else {
      validityContainer.innerHTML = "";
    }
  }

  // Get active split data
  const splitKey = `treino${state.currentSplit}`;
  const splitData = ficha[splitKey];

  if (!splitData) {
    container.innerHTML = `<div class="card col-span-12 text-center">Treino ${state.currentSplit} indisponível.</div>`;
    return;
  }

  // Render Workout Card
  let exerciseRowsHtml = "";
  splitData.exercises.forEach((exRef, idx) => {
    const dbEx = EXERCISES_DB[exRef.id];
    if (!dbEx) return;

    // Get last tracked load for this exercise
    const lastLoad = getLastLoad(exRef.id);
    const loadText = lastLoad !== null ? `${lastLoad} kg (Último)` : `${exRef.weight} kg (Sugerido)`;

    exerciseRowsHtml += `
      <div class="exercise-row">
        <div class="exercise-img-wrapper" onclick="openExerciseDetailsModal('${exRef.id}')">
          <img src="${dbEx.gif || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(dbEx.name) + '&background=1E1E2E&color=FF5E00&size=128&font-size=0.33'}" alt="${dbEx.name}" onerror="this.src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'">
          <div class="play-badge"><span class="material-symbols-outlined">play_arrow</span></div>
        </div>
        <div class="exercise-info-text">
          <h3 class="exercise-name">${dbEx.name}</h3>
          <div class="exercise-meta-tags">
            <span class="badge badge-orange">${dbEx.muscle}</span>
            <span class="badge badge-purple">${exRef.setsCount} séries</span>
            <span class="badge badge-teal">Rest: ${dbEx.rest}s</span>
          </div>
        </div>
        <div class="exercise-stat-box">
          <span class="material-symbols-outlined text-primary">fitness_center</span>
          <div>
            <span class="val">${loadText}</span>
          </div>
        </div>
        <div class="exercise-stat-box">
          <span class="material-symbols-outlined text-primary">repeat</span>
          <div>
            <span class="val">${exRef.reps} reps</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="card col-span-12">
      <div class="header-section" style="margin-bottom: 1.5rem;">
        <div>
          <h2 class="font-headline-md text-primary" style="font-size: 1.4rem;">${splitData.name}</h2>
          <p class="text-secondary" style="font-size: 0.85rem; margin-top: 0.25rem;">Prescrição diária com guia de execução integrada</p>
        </div>
        <button class="btn-primary" onclick="startWorkoutSession('${state.currentSplit}')">
          <span class="material-symbols-outlined">play_circle</span> Iniciar Treino
        </button>
      </div>
      
      <div class="exercise-list">
        ${exerciseRowsHtml}
      </div>
    </div>
  `;
};

// Render exercise library
const renderLibrary = () => {
  const container = document.getElementById("library-grid");
  if (!container) return;

  let html = "";
  Object.keys(EXERCISES_DB).forEach(key => {
    const ex = EXERCISES_DB[key];
    html += `
      <div class="card col-span-4" style="cursor: pointer;" onclick="openExerciseDetailsModal('${key}')">
        <div style="position: relative; border-radius: var(--border-radius-md); overflow: hidden; aspect-ratio: 16/9; background: #000; margin-bottom: 1rem;">
          <img src="${ex.gif || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(ex.name) + '&background=1A1A26&color=FF5E00&size=256&font-size=0.3'}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;" onerror="this.src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'" />
          <div style="position: absolute; bottom: 0.75rem; left: 0.75rem;">
            <span class="badge badge-orange">${ex.muscle}</span>
          </div>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,94,0,0.9); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--glow-orange);">
            <span class="material-symbols-outlined" style="color: white; font-size: 1.5rem;">play_arrow</span>
          </div>
        </div>
        <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${ex.name}</h3>
        <p class="text-secondary" style="font-size: 0.85rem; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
          ${ex.steps[0]}
        </p>
      </div>
    `;
  });

  container.innerHTML = html;
};

// Render Workout History list
const renderHistory = () => {
  const container = document.getElementById("history-timeline");
  if (!container) return;

  if (state.history.length === 0) {
    container.innerHTML = `
      <div class="card text-center py-10">
        <h3 class="font-headline-md mb-2">Nenhum treino no histórico</h3>
        <p class="text-secondary">Seus treinos concluídos aparecerão aqui, listando cargas, séries e tempos de execução.</p>
      </div>
    `;
    return;
  }

  let html = "";
  // Sort history newest first
  const sortedHistory = [...state.history].reverse();
  
  sortedHistory.forEach((session, sIdx) => {
    const formattedDate = new Date(session.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });

    html += `
      <div class="history-card" onclick="openHistoryDetailsModal(${state.history.length - 1 - sIdx})">
        <div class="history-info-left">
          <div class="history-icon-wrapper">
            <span class="material-symbols-outlined">task_alt</span>
          </div>
          <div class="history-details">
            <h3>Treino ${session.split} - Concluído</h3>
            <p>${formattedDate} • ${session.fichaName}</p>
          </div>
        </div>
        <div class="history-stats-right">
          <div class="history-stat">
            <span class="label">Duração</span>
            <span class="val" style="color: white;">${session.duration} min</span>
          </div>
          <div class="history-stat">
            <span class="label">Exercícios</span>
            <span class="val" style="color: white;">${session.logs.length}</span>
          </div>
          <div class="history-stat">
            <span class="label">Carga Máxima</span>
            <span class="val">${session.maxWeight} kg</span>
          </div>
          <button class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
            Ver Cargas
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
};

// 8. SESSION WORKOUT PLAYER ENGINE (FOCUS MODE)

const startWorkoutSession = (split) => {
  const ficha = state.currentFicha;
  if (!ficha) return;

  const splitKey = `treino${split}`;
  const splitData = ficha[splitKey];
  if (!splitData || splitData.exercises.length === 0) return;

  // Initialize active workout session state
  state.activeWorkout = {
    split: split,
    fichaName: ficha.name,
    currentExerciseIndex: 0,
    startTime: Date.now(),
    logs: [] // Will contain: { id: "supino_reto", sets: [ { setNum: 1, weight: 20, reps: 10, completed: true } ] }
  };

  // Hide dashboard page, show active workout page
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("active-workout").style.display = "block";
  
  // Hide normal navigation sidebar during active workout so user can focus
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.style.opacity = "0.5";
  const mobileNav = document.querySelector(".mobile-nav");
  if (mobileNav) mobileNav.style.display = "none";

  renderActiveWorkoutExercise();
};

const renderActiveWorkoutExercise = () => {
  const session = state.activeWorkout;
  const ficha = state.currentFicha;
  const splitData = ficha[`treino${session.split}`];
  const exRef = splitData.exercises[session.currentExerciseIndex];
  const dbEx = EXERCISES_DB[exRef.id];

  if (!dbEx) return;

  // Set header
  document.getElementById("workout-exercise-title").textContent = dbEx.name;
  document.getElementById("workout-exercise-subtitle").textContent = `Exercício ${session.currentExerciseIndex + 1} de ${splitData.exercises.length} • Foco em ${dbEx.muscle}`;
  
  const exImage = dbEx.gif || `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80`;

  // Render Exercise Illustration
  const videoCard = document.getElementById("workout-video-container");
  videoCard.innerHTML = `
    <div class="video-player-card" style="position: relative; overflow: hidden; max-width: 100%; border-radius: var(--border-radius-md); box-shadow: 0 4px 15px rgba(0,0,0,0.5); background: #1a1a2e;">
      <img src="${exImage}" alt="${dbEx.name}" style="width: 100%; display: block; max-height: 300px; object-fit: contain; background: #1a1a2e;" onerror="this.src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'; this.style.objectFit='cover';">
      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); padding: 1rem; text-align: center;">
        <span class="badge badge-orange">${dbEx.muscle}</span>
      </div>
    </div>
  `;

  // Render Exercise Steps & Tips
  const stepsList = dbEx.steps.map(step => `<li>${step}</li>`).join("");
  document.getElementById("workout-exercise-steps").innerHTML = `
    <h3 class="font-headline-sm mb-3 text-primary" style="font-size: 1.1rem;">Execução Correta</h3>
    <ol style="padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.5; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem;">
      ${stepsList}
    </ol>
    <div style="margin-top: 1.25rem; padding: 0.75rem 1rem; background: rgba(255, 179, 0, 0.08); border-left: 3px solid var(--secondary); border-radius: 4px; font-size: 0.85rem; color: #FFE082;">
      <strong>Dica Pro:</strong> ${dbEx.tips}
    </div>
  `;

  // Render Sets Tracker Table
  const setsContainer = document.getElementById("workout-sets-container");
  let rowsHtml = "";

  // Check if we already have logged sets for this active exercise to avoid losing data on return
  let loggedEx = session.logs.find(l => l.id === exRef.id);
  if (!loggedEx) {
    loggedEx = {
      id: exRef.id,
      sets: Array.from({ length: exRef.setsCount }, (_, k) => {
        // Fallback or last weights used
        const lastWeight = getLastLoad(exRef.id);
        return {
          setNum: k + 1,
          weight: lastWeight !== null ? lastWeight : exRef.weight,
          reps: parseInt(exRef.reps) || 10,
          completed: false
        };
      })
    };
    session.logs.push(loggedEx);
  }

  loggedEx.sets.forEach((set) => {
    rowsHtml += `
      <div class="set-row ${set.completed ? 'completed' : ''}" id="set-row-${exRef.id}-${set.setNum}">
        <div class="set-num">Série ${set.setNum}</div>
        <div>
          <div class="weight-input-wrapper">
            <input type="number" class="weight-input" value="${set.weight}" min="0" onchange="updateActiveSetVal('${exRef.id}', ${set.setNum}, 'weight', this.value)">
            <span class="weight-unit">kg</span>
          </div>
        </div>
        <div>
          <div class="reps-input-wrapper">
            <input type="number" class="reps-input" value="${set.reps}" min="0" onchange="updateActiveSetVal('${exRef.id}', ${set.setNum}, 'reps', this.value)">
            <span class="reps-unit">reps</span>
          </div>
        </div>
        <div>
          <input type="checkbox" id="chk-${exRef.id}-${set.setNum}" class="set-checkbox" ${set.completed ? 'checked' : ''} onchange="toggleSetCompletion('${exRef.id}', ${set.setNum}, this.checked)">
          <label for="chk-${exRef.id}-${set.setNum}" class="set-checkbox-label"></label>
        </div>
      </div>
    `;
  });

  setsContainer.innerHTML = `
    <h3 class="font-headline-sm mb-4" style="font-size: 1.15rem;">Cargas & Repetições</h3>
    <div class="sets-header">
      <div>Série</div>
      <div>Peso</div>
      <div>Reps</div>
      <div>Status</div>
    </div>
    <div style="display: flex; flex-direction: column;">
      ${rowsHtml}
    </div>
  `;

  // Update navigation buttons (Next/Prev/Finish)
  const navContainer = document.getElementById("workout-nav-controls");
  const isLast = session.currentExerciseIndex === splitData.exercises.length - 1;
  const isFirst = session.currentExerciseIndex === 0;

  navContainer.innerHTML = `
    <button class="btn-secondary" onclick="prevWorkoutExercise()" ${isFirst ? 'disabled style="opacity: 0.3;"' : ''}>
      <span class="material-symbols-outlined">chevron_left</span> Anterior
    </button>
    
    ${isLast ? `
      <button class="btn-primary" onclick="finishWorkoutSession()" style="background: var(--success-grad); box-shadow: var(--glow-green); border-color: var(--success);">
        <span class="material-symbols-outlined">celebration</span> Concluir Treino
      </button>
    ` : `
      <button class="btn-primary" onclick="nextWorkoutExercise()">
        Próximo <span class="material-symbols-outlined">chevron_right</span>
      </button>
    `}
  `;
};

// Handles change of values in active set inputs
const updateActiveSetVal = (exId, setNum, type, val) => {
  const session = state.activeWorkout;
  if (!session) return;
  const loggedEx = session.logs.find(l => l.id === exId);
  if (!loggedEx) return;
  const set = loggedEx.sets.find(s => s.setNum === setNum);
  if (!set) return;

  set[type] = parseFloat(val) || 0;
  saveStateToStorage();
};

// Triggered when clicking a set completion checkbox
const toggleSetCompletion = (exId, setNum, isChecked) => {
  const session = state.activeWorkout;
  if (!session) return;
  const loggedEx = session.logs.find(l => l.id === exId);
  if (!loggedEx) return;
  const set = loggedEx.sets.find(s => s.setNum === setNum);
  if (!set) return;

  set.completed = isChecked;
  
  // Highlight row visually
  const row = document.getElementById(`set-row-${exId}-${setNum}`);
  if (isChecked) {
    row.classList.add("completed");
    playAlertSound("beep");
    
    // Automatically trigger the Rest Timer!
    const dbEx = EXERCISES_DB[exId];
    if (dbEx && dbEx.rest > 0) {
      setTimeout(() => {
        openRestTimer(dbEx.rest, dbEx.name);
      }, 500); // 500ms delay for visual feedback
    }
  } else {
    row.classList.remove("completed");
  }

  saveStateToStorage();
};

// Video controls during execution
const toggleVideoPlay = () => {
  const video = document.getElementById("workout-video-player");
  const icon = document.getElementById("video-play-icon");
  if (!video) return;

  if (video.paused) {
    video.play();
    icon.textContent = "pause";
  } else {
    video.pause();
    icon.textContent = "play_arrow";
  }
};

const toggleVideoSound = () => {
  const video = document.getElementById("workout-video-player");
  const toggle = document.getElementById("video-sound-toggle");
  if (!video) return;

  if (video.muted) {
    video.muted = false;
    toggle.innerHTML = `<span class="material-symbols-outlined">volume_up</span>`;
  } else {
    video.muted = true;
    toggle.innerHTML = `<span class="material-symbols-outlined">volume_off</span>`;
  }
};

// Navigation within active workout
const nextWorkoutExercise = () => {
  const session = state.activeWorkout;
  const splitData = state.currentFicha[`treino${session.split}`];
  
  if (session.currentExerciseIndex < splitData.exercises.length - 1) {
    session.currentExerciseIndex++;
    renderActiveWorkoutExercise();
  }
};

const prevWorkoutExercise = () => {
  const session = state.activeWorkout;
  if (session.currentExerciseIndex > 0) {
    session.currentExerciseIndex--;
    renderActiveWorkoutExercise();
  }
};

// REST COUNTDOWN TIMER OVERLAY
let timerInterval = null;
let timerSecondsRemaining = 0;
let timerTotalDuration = 0;

const openRestTimer = (seconds, exerciseName) => {
  timerSecondsRemaining = seconds;
  timerTotalDuration = seconds;

  document.getElementById("timer-exercise-name").textContent = exerciseName;
  document.getElementById("rest-timer-screen").classList.add("active");
  
  updateRestTimerVisuals();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSecondsRemaining--;
    updateRestTimerVisuals();

    if (timerSecondsRemaining <= 0) {
      clearInterval(timerInterval);
      playAlertSound("double-beep");
      setTimeout(() => {
        closeRestTimer();
      }, 800);
    }
  }, 1000);
};

const updateRestTimerVisuals = () => {
  // Update numbers
  const mins = Math.floor(timerSecondsRemaining / 60);
  const secs = timerSecondsRemaining % 60;
  document.getElementById("timer-time-display").innerHTML = `
    ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}
    <span class="timer-subtext">Descanse</span>
  `;

  // Draw circular SVG progress bar
  const circle = document.getElementById("timer-circle-bar");
  if (!circle) return;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;

  const offset = circumference - (timerSecondsRemaining / timerTotalDuration) * circumference;
  circle.style.strokeDashoffset = offset;
};

const pauseRestTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("timer-pause-icon").textContent = "play_arrow";
  } else {
    document.getElementById("timer-pause-icon").textContent = "pause";
    timerInterval = setInterval(() => {
      timerSecondsRemaining--;
      updateRestTimerVisuals();
      if (timerSecondsRemaining <= 0) {
        clearInterval(timerInterval);
        playAlertSound("double-beep");
        closeRestTimer();
      }
    }, 1000);
  }
};

const adjustRestTimer = (amount) => {
  timerSecondsRemaining += amount;
  if (timerSecondsRemaining < 0) timerSecondsRemaining = 0;
  if (timerSecondsRemaining > timerTotalDuration) timerTotalDuration = timerSecondsRemaining;
  updateRestTimerVisuals();
};

const closeRestTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById("rest-timer-screen").classList.remove("active");
};

// FINISH WORKOUT AND RECORD STATS
const finishWorkoutSession = () => {
  const session = state.activeWorkout;
  if (!session) return;

  const durationMin = Math.max(1, Math.round((Date.now() - session.startTime) / 60000));
  
  // Calculate loads/weights
  let maxWeight = 0;
  let hasCompletedSet = false;

  session.logs.forEach(exLog => {
    exLog.sets.forEach(set => {
      if (set.completed) {
        hasCompletedSet = true;
        if (set.weight > maxWeight) {
          maxWeight = set.weight;
        }
      }
    });
  });

  // If no sets completed, alert
  if (!hasCompletedSet) {
    if (!confirm("Você não marcou nenhuma série como concluída. Deseja mesmo concluir o treino assim?")) {
      return;
    }
  }

  // Create completed history entry
  const historyEntry = {
    date: Date.now(),
    fichaName: session.fichaName,
    split: session.split,
    duration: durationMin,
    maxWeight: maxWeight,
    logs: session.logs.map(log => ({
      id: log.id,
      sets: log.sets.filter(s => s.completed).map(s => ({
        weight: s.weight,
        reps: s.reps
      }))
    })).filter(l => l.sets.length > 0) // Only save exercises with completed sets
  };

  // Add to state and save
  state.history.push(historyEntry);
  state.activeWorkout = null;
  saveStateToStorage();

  // Highlight user alert sound
  playAlertSound("double-beep");

  // Show normal navigation again
  document.getElementById("active-workout").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.style.opacity = "1";
  
  const width = window.innerWidth;
  if (width <= 768) {
    const mobileNav = document.querySelector(".mobile-nav");
    if (mobileNav) mobileNav.style.display = "flex";
  }

  alert("Parabéns! Seu treino foi concluído com sucesso e gravado no seu histórico!");
  navigateTo("historico");
};

const cancelActiveWorkout = () => {
  if (confirm("Tem certeza que deseja cancelar o treino atual? Suas séries não serão gravadas.")) {
    state.activeWorkout = null;
    saveStateToStorage();

    document.getElementById("active-workout").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.style.opacity = "1";
    
    if (window.innerWidth <= 768) {
      const mobileNav = document.querySelector(".mobile-nav");
      if (mobileNav) mobileNav.style.display = "flex";
    }
    navigateTo("dashboard");
  }
};

// Helpers for loading historic loads
const getLastLoad = (exId) => {
  // Go backwards through history to find the most recent set completed for this exercise
  for (let i = state.history.length - 1; i >= 0; i--) {
    const session = state.history[i];
    const log = session.logs.find(l => l.id === exId);
    if (log && log.sets && log.sets.length > 0) {
      return log.sets[0].weight; // return weight of first completed set
    }
  }
  return null;
};

// 9. MODALS VIEWER (EXERCISES AND HISTORY LOGS DETAILS)

const openExerciseDetailsModal = (exId) => {
  const ex = EXERCISES_DB[exId];
  if (!ex) return;

  const modal = document.getElementById("details-modal");
  const modalContent = document.getElementById("modal-body-content");
  
  document.getElementById("modal-title").textContent = ex.name;

  const stepsList = ex.steps.map(step => `<li>${step}</li>`).join("");

  const exImage = ex.gif || `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80`;

  modalContent.innerHTML = `
    <div style="border-radius: var(--border-radius-md); overflow: hidden; background: #1a1a2e; margin-bottom: 1.5rem; border: 1px solid var(--border-light); text-align: center;">
      <img src="${exImage}" alt="${ex.name}" style="max-width: 100%; max-height: 280px; object-fit: contain; display: block; margin: 0 auto; background: #1a1a2e;" onerror="this.parentElement.style.backgroundImage='url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80)'; this.parentElement.style.backgroundSize='cover'; this.style.display='none';">
    </div>
    
    <div style="margin-bottom: 1.25rem; display: flex; gap: 0.5rem;">
      <span class="badge badge-orange">${ex.muscle}</span>
      <span class="badge badge-teal">Descanso sugerido: ${ex.rest} segundos</span>
    </div>

    <h4 class="font-headline-sm text-primary mb-3" style="font-size: 1.1rem;">Como Executar</h4>
    <ol style="padding-left: 1.25rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
      ${stepsList}
    </ol>

    <div style="padding: 1rem; background: rgba(255, 179, 0, 0.08); border-left: 3px solid var(--secondary); border-radius: 4px; font-size: 0.9rem; color: #FFE082;">
      <strong>Dica Importante:</strong> ${ex.tips}
    </div>
  `;

  modal.classList.add("active");
};

const openHistoryDetailsModal = (idx) => {
  const session = state.history[idx];
  if (!session) return;

  const modal = document.getElementById("details-modal");
  const modalContent = document.getElementById("modal-body-content");
  
  const formattedDate = new Date(session.date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  document.getElementById("modal-title").textContent = `Treino ${session.split} - Detalhes`;

  let exerciseLogsHtml = "";
  session.logs.forEach(exLog => {
    const dbEx = EXERCISES_DB[exLog.id];
    const name = dbEx ? dbEx.name : exLog.id;

    let setsHtml = "";
    exLog.sets.forEach((set, sIdx) => {
      setsHtml += `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
          <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-secondary);">Série ${sIdx + 1}</span>
          <span style="font-weight: 800; font-size: 0.9rem; color: var(--success);">${set.weight} kg x ${set.reps} reps</span>
        </div>
      `;
    });

    exerciseLogsHtml += `
      <div class="card" style="padding: 1.25rem; margin-bottom: 1rem; border-color: rgba(0, 242, 155, 0.15);">
        <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: white; display: flex; align-items: center; gap: 0.5rem;">
          <span class="material-symbols-outlined text-success" style="font-size: 1.25rem;">task_alt</span> ${name}
        </h4>
        <div style="display: flex; flex-direction: column;">
          ${setsHtml}
        </div>
      </div>
    `;
  });

  modalContent.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <p style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Ficha</p>
      <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.25rem;">${session.fichaName}</h3>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${formattedDate} • ⏱️ ${session.duration} minutos de duração</p>
    </div>

    <h4 class="font-headline-sm mb-3" style="font-size: 1.1rem; border-top: 1px solid var(--border-light); padding-top: 1.25rem;">Cargas Registradas</h4>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      ${exerciseLogsHtml}
    </div>
  `;

  modal.classList.add("active");
};

const closeModal = () => {
  document.getElementById("details-modal").classList.remove("active");
};

// 10. INTELLIGENT WORKOUT SPLIT GENERATOR (HEURISTIC)

const selectGeneratorOption = (group, value, element) => {
  // Unselect others in same group
  const parent = element.parentNode;
  parent.querySelectorAll(".form-option-card").forEach(card => {
    card.classList.remove("selected");
  });
  element.classList.add("selected");
  
  // Set value hidden
  document.getElementById(`form-${group}`).value = value;
};

// Apagar ficha atual
const deleteCurrentFicha = () => {
  if (confirm("Tem certeza que deseja apagar sua ficha atual? Você precisará gerar uma nova.")) {
    state.currentFicha = null;
    state.activeWorkout = null;
    saveStateToStorage();
    renderDashboard();
    alert("Ficha apagada com sucesso.");
  }
};

// Apagar histórico
const clearHistory = () => {
  if (confirm("Tem certeza que deseja apagar todo o seu histórico de treinos? Essa ação não pode ser desfeita.")) {
    state.history = [];
    saveStateToStorage();
    renderHistory();
    alert("Histórico apagado com sucesso.");
  }
};

const generateIntelligentWorkout = () => {
  const name = document.getElementById("user-name-input").value.trim() || "Atleta treinox.ai";
  const objective = document.getElementById("form-objective").value;
  const level = document.getElementById("form-level").value;
  const days = parseInt(document.getElementById("form-days").value) || 3;
  const time = parseInt(document.getElementById("form-time").value) || 60;

  // Custom heuristic algorithm to build custom schedules
  const plans = {
    "Hipertrofia": {
      name: `Ficha Hipertrofia Elite (${name})`,
      treinoA: {
        name: "Treino A - Peito, Ombro e Tríceps",
        exercises: [
          { id: "supino_reto", setsCount: 4, reps: "8-12", weight: level === "Iniciante" ? 10 : 20 },
          { id: "crucifixo_maquina", setsCount: 3, reps: "10-15", weight: level === "Iniciante" ? 10 : 20 },
          { id: "desenvolvimento_ombro", setsCount: 3, reps: "10-12", weight: level === "Iniciante" ? 6 : 14 },
          { id: "elevacao_lateral", setsCount: 3, reps: "12-15", weight: level === "Iniciante" ? 4 : 10 },
          { id: "triceps_pulley", setsCount: 4, reps: "10-12", weight: level === "Iniciante" ? 10 : 20 }
        ]
      },
      treinoB: {
        name: "Treino B - Costas, Bíceps e Core",
        exercises: [
          { id: "puxada_frente", setsCount: 4, reps: "8-12", weight: level === "Iniciante" ? 20 : 35 },
          { id: "remada_curvada", setsCount: 3, reps: "10-12", weight: level === "Iniciante" ? 10 : 18 },
          { id: "rosca_direta", setsCount: 4, reps: "10-12", weight: level === "Iniciante" ? 6 : 12 },
          { id: "prancha_abdominal", setsCount: 3, reps: "45 segundos", weight: 0 },
          { id: "esteira", setsCount: 1, reps: "10 min", weight: 0 }
        ]
      },
      treinoC: {
        name: "Treino C - Pernas Completas",
        exercises: [
          { id: "agachamento_barra", setsCount: 4, reps: "8-10", weight: level === "Iniciante" ? 15 : 35 },
          { id: "leg_press", setsCount: 3, reps: "10-12", weight: level === "Iniciante" ? 30 : 80 },
          { id: "cadeira_extensora", setsCount: 3, reps: "12-15", weight: level === "Iniciante" ? 15 : 30 },
          { id: "mesa_flexora", setsCount: 3, reps: "10-12", weight: level === "Iniciante" ? 15 : 25 },
          { id: "panturrilha_maquina", setsCount: 4, reps: "15-20", weight: level === "Iniciante" ? 20 : 40 }
        ]
      }
    },
    "Emagrecimento": {
      name: `Ficha Queima Rápida & Definição (${name})`,
      treinoA: {
        name: "Treino A - Resistência Peito & Costas",
        exercises: [
          { id: "esteira", setsCount: 1, reps: "15 minutos", weight: 0 },
          { id: "supino_reto", setsCount: 3, reps: "15 reps", weight: level === "Iniciante" ? 8 : 16 },
          { id: "puxada_frente", setsCount: 3, reps: "15 reps", weight: level === "Iniciante" ? 15 : 25 },
          { id: "triceps_pulley", setsCount: 3, reps: "15 reps", weight: level === "Iniciante" ? 10 : 15 },
          { id: "prancha_abdominal", setsCount: 3, reps: "45 segundos", weight: 0 }
        ]
      },
      treinoB: {
        name: "Treino B - Resistência Pernas",
        exercises: [
          { id: "esteira", setsCount: 1, reps: "10 minutos", weight: 0 },
          { id: "leg_press", setsCount: 4, reps: "15 reps", weight: level === "Iniciante" ? 25 : 50 },
          { id: "cadeira_extensora", setsCount: 3, reps: "15 reps", weight: level === "Iniciante" ? 10 : 20 },
          { id: "panturrilha_maquina", setsCount: 3, reps: "20 reps", weight: level === "Iniciante" ? 15 : 30 },
          { id: "esteira", setsCount: 1, reps: "15 minutos", weight: 0 }
        ]
      },
      treinoC: {
        name: "Treino C - Ombros, Braços & Core",
        exercises: [
          { id: "desenvolvimento_ombro", setsCount: 3, reps: "15 reps", weight: level === "Iniciante" ? 6 : 12 },
          { id: "elevacao_lateral", setsCount: 3, reps: "15 reps", weight: level === "Iniciante" ? 4 : 8 },
          { id: "rosca_direta", setsCount: 3, reps: "15 reps", weight: level === "Iniciante" ? 4 : 10 },
          { id: "prancha_abdominal", setsCount: 4, reps: "60 segundos", weight: 0 },
          { id: "esteira", setsCount: 1, reps: "20 minutos", weight: 0 }
        ]
      }
    },
    "Condicionamento": {
      name: `Ficha Condicionamento & Saúde (${name})`,
      treinoA: {
        name: "Treino A - Full Body 1",
        exercises: [
          { id: "agachamento_barra", setsCount: 3, reps: "12 reps", weight: level === "Iniciante" ? 10 : 25 },
          { id: "supino_reto", setsCount: 3, reps: "12 reps", weight: level === "Iniciante" ? 10 : 20 },
          { id: "puxada_frente", setsCount: 3, reps: "12 reps", weight: level === "Iniciante" ? 15 : 25 },
          { id: "rosca_direta", setsCount: 2, reps: "15 reps", weight: level === "Iniciante" ? 6 : 10 },
          { id: "esteira", setsCount: 1, reps: "15 minutos", weight: 0 }
        ]
      },
      treinoB: {
        name: "Treino B - Core & Cardio",
        exercises: [
          { id: "esteira", setsCount: 1, reps: "30 minutos", weight: 0 },
          { id: "prancha_abdominal", setsCount: 4, reps: "45 segundos", weight: 0 },
          { id: "panturrilha_maquina", setsCount: 4, reps: "15 reps", weight: level === "Iniciante" ? 20 : 35 },
          { id: "crucifixo_maquina", setsCount: 3, reps: "12 reps", weight: level === "Iniciante" ? 10 : 20 },
          { id: "elevacao_lateral", setsCount: 3, reps: "12 reps", weight: level === "Iniciante" ? 4 : 8 }
        ]
      },
      treinoC: {
        name: "Treino C - Full Body 2",
        exercises: [
          { id: "leg_press", setsCount: 3, reps: "12 reps", weight: level === "Iniciante" ? 30 : 60 },
          { id: "desenvolvimento_ombro", setsCount: 3, reps: "12 reps", weight: level === "Iniciante" ? 6 : 12 },
          { id: "remada_curvada", setsCount: 3, reps: "12 reps", weight: level === "Iniciante" ? 10 : 18 },
          { id: "triceps_pulley", setsCount: 2, reps: "15 reps", weight: level === "Iniciante" ? 10 : 15 },
          { id: "esteira", setsCount: 1, reps: "15 minutos", weight: 0 }
        ]
      }
    }
  };

  if (state.currentFicha) {
    state.previousFicha = JSON.parse(JSON.stringify(state.currentFicha));
  }

  // Get selected validity weeks from form
  const validityWeeks = parseInt(document.getElementById("form-validity").value) || 4;

  // Select base and customize
  const selectedType = plans[objective] || plans["Hipertrofia"];
  
  // Clone selected plan structure
  const newFicha = JSON.parse(JSON.stringify(selectedType));
  newFicha.id = "ficha_" + Date.now();
  newFicha.objective = objective;
  newFicha.level = level;
  newFicha.days = days;
  newFicha.time = time;
  newFicha.name = `${newFicha.name} - ${days}x na semana (${time} min)`;
  newFicha.createdAt = Date.now();
  newFicha.validityWeeks = validityWeeks;
  newFicha.expiresAt = Date.now() + validityWeeks * 7 * 24 * 60 * 60 * 1000;

  // Dynamic intelligent rotation to prevent repeating previous exercises
  const prevIds = getPreviousExerciseIds();
  ["treinoA", "treinoB", "treinoC"].forEach(tKey => {
    if (newFicha[tKey] && newFicha[tKey].exercises) {
      newFicha[tKey].exercises = newFicha[tKey].exercises.map(ex => {
        const rotatedId = getAlternativeExercise(ex.id, prevIds);
        return {
          ...ex,
          id: rotatedId
        };
      });
    }
  });

  // Active new ficha in state
  state.currentFicha = newFicha;
  state.currentSplit = "A";
  state.expirationAlertDismissed = false; // Reset expiration alert for new ficha
  saveStateToStorage();

  // Add Ficha created log to history
  state.history.push({
    date: Date.now(),
    fichaName: newFicha.name,
    split: "N/A",
    duration: 0,
    maxWeight: 0,
    logs: []
  });
  saveStateToStorage();

  // Play alert success
  playAlertSound("double-beep");

  alert(`Ficha "${newFicha.name}" criada com sucesso pelo treinox.ai!`);
  navigateTo("dashboard");
};

// Rotation and Validity Helper Functions
const getAlternativeExercise = (exId, previousExerciseIds) => {
  const alternatives = {
    "supino_reto": "supino_inclinado_halter",
    "supino_inclinado_halter": "supino_reto",
    "crucifixo_maquina": "crucifixo_polia",
    "crucifixo_polia": "crucifixo_maquina",
    "agachamento_barra": "agachamento_hack",
    "agachamento_hack": "agachamento_barra",
    "leg_press": "stiff_barra",
    "stiff_barra": "leg_press",
    "cadeira_extensora": "leg_press",
    "mesa_flexora": "stiff_barra",
    "rosca_direta": "rosca_martelo",
    "rosca_martelo": "rosca_direta",
    "triceps_pulley": "triceps_testa",
    "triceps_testa": "triceps_pulley",
    "desenvolvimento_ombro": "remada_alta",
    "remada_alta": "desenvolvimento_ombro",
    "elevacao_lateral": "elevacao_frontal",
    "elevacao_frontal": "elevacao_lateral",
    "remada_curvada": "remada_baixa_triangulo",
    "remada_baixa_triangulo": "remada_curvada",
    "puxada_frente": "remada_baixa_triangulo",
    "prancha_abdominal": "abdominal_infra",
    "abdominal_infra": "prancha_abdominal",
    "esteira": "bicicleta_ergometrica",
    "bicicleta_ergometrica": "esteira"
  };
  
  const alt = alternatives[exId];
  if (alt && previousExerciseIds.includes(exId)) {
    return alt;
  }
  return exId;
};

const getPreviousExerciseIds = () => {
  if (!state.previousFicha) return [];
  const ids = [];
  ["treinoA", "treinoB", "treinoC"].forEach(tKey => {
    const split = state.previousFicha[tKey];
    if (split && split.exercises) {
      split.exercises.forEach(ex => ids.push(ex.id));
    }
  });
  return ids;
};

const dismissExpirationModal = () => {
  const modal = document.getElementById("expiration-modal");
  if (modal) modal.classList.remove("active");
  state.expirationAlertDismissed = true;
  saveStateToStorage();
};

const renewFichaFromExpiration = () => {
  dismissExpirationModal();
  navigateTo("generator");
};

const checkFichaExpiration = () => {
  const ficha = state.currentFicha;
  if (!ficha || !ficha.expiresAt) return;

  const daysLeft = Math.ceil((ficha.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));

  if (daysLeft <= 3 && !state.expirationAlertDismissed) {
    const modal = document.getElementById("expiration-modal");
    const daysLabel = document.getElementById("expiration-days-left");
    if (modal) {
      if (daysLabel) {
        daysLabel.textContent = daysLeft > 0 ? daysLeft : "0";
      }
      modal.classList.add("active");
    }
  }
};

// 11. STARTUP ENGINE INITIALIZATION
window.addEventListener("DOMContentLoaded", () => {
  // Load state
  loadStateFromStorage();

  // Attach close event to modals
  const modalClose = document.getElementById("modal-close");
  if (modalClose) modalClose.addEventListener("click", closeModal);

  // Set initial split selector click events
  document.querySelectorAll(".split-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".split-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentSplit = btn.dataset.split;
      saveStateToStorage();
      renderDashboard();
    });
  });

  // Initialize Login Status
  checkLoginStatus();

  // Navigate to Dashboard initially
  navigateTo("dashboard");

  // Check if current ficha is expiring
  checkFichaExpiration();

  // Register Service Worker for PWA capabilities
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js")
      .then((reg) => console.log("[PWA] Service Worker registered:", reg.scope))
      .catch((err) => console.error("[PWA] Service Worker registration failed:", err));
  }
});
