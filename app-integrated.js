// ─── UTILITIES ─────────────────────────────────────────────────────────────

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

// ─── AUTH ─────────────────────────────────────────────────────────────────

const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function performLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Preencha todos os campos!');
    return;
  }

  // Simular autenticação
  const user = {
    id: 'user_' + Date.now(),
    email: sanitizeInput(email),
    name: email.split('@')[0],
    loginTime: new Date().toISOString()
  };

  localStorage.setItem('currentUser', safeStringify(user));
  localStorage.setItem('userWorkouts', safeStringify([]));
  
  document.getElementById('auth-overlay').style.display = 'none';
  document.getElementById('app-container').style.display = 'block';
  document.getElementById('user-welcome').textContent = user.name.toUpperCase();
}

function performRegister() {
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const age = parseInt(document.getElementById('register-age').value);
  const weight = parseFloat(document.getElementById('register-weight').value);
  const height = parseInt(document.getElementById('register-height').value);

  if (!name || !email || !password || !age || !weight || !height) {
    alert('Preencha todos os campos!');
    return;
  }

  const bmi = calculateBMI(weight, height);

  const user = {
    id: 'user_' + Date.now(),
    name: sanitizeInput(name),
    email: sanitizeInput(email),
    age: age,
    weight: weight,
    height: height,
    bmi: bmi,
    registrationDate: new Date().toISOString()
  };

  localStorage.setItem('currentUser', safeStringify(user));
  localStorage.setItem('userBiometrics', safeStringify({ age, weight, height, bmi }));
  localStorage.setItem('userWorkouts', safeStringify([]));

  switchAuthScreen('login');
  alert('Conta criada com sucesso! Faça login.');
}

function switchAuthScreen(screen) {
  document.getElementById('login-screen').style.display = screen === 'login' ? 'block' : 'none';
  document.getElementById('register-screen').style.display = screen === 'register' ? 'block' : 'none';
}

function performLogout() {
  localStorage.removeItem('currentUser');
  location.reload();
}

// ─── INITIALIZATION ────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (user) {
    // Usuário já logado
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    document.getElementById('user-welcome').textContent = user.name.toUpperCase();
  } else {
    // Mostrar tela de login
    document.getElementById('auth-overlay').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
  }

  // Setup Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registrado'))
      .catch(err => console.log('Erro SW:', err));
  }

  // Initialize screen navigation
  setupScreenNavigation();
});

// ─── SCREEN NAVIGATION ────────────────────────────────────────────────────

function setupScreenNavigation() {
  // Show dashboard by default
  showScreen('dashboard');

  // Add event listeners to nav buttons
  document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
}

function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
    screen.style.display = 'none';
  });

  // Show selected screen
  const screenMap = {
    'dashboard': 'screen-dashboard',
    'biblioteca': 'screen-biblioteca',
    'perfil': 'screen-perfil',
    'treino': 'screen-treino',
    'historico': 'screen-historico'
  };

  const screenId_mapped = screenMap[screenId];
  if (screenId_mapped) {
    const screen = document.getElementById(screenId_mapped);
    if (screen) {
      screen.style.display = 'block';
      screen.classList.add('active');
      window.scrollTo(0, 0);
    }
  }
}

// ─── LIBRARY FILTERS ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Setup filter chips
    const chips = document.querySelectorAll('#screen-biblioteca .flex-shrink-0');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => {
          c.classList.remove('bg-primary-fixed', 'text-on-primary-fixed');
          c.classList.add('bg-surface-container', 'text-on-surface-variant');
        });
        chip.classList.add('bg-primary-fixed', 'text-on-primary-fixed');
        chip.classList.remove('bg-surface-container', 'text-on-surface-variant');
      });
    });

    // Setup search filter
    const searchInput = document.querySelector('#screen-biblioteca input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('#screen-biblioteca .group');
        cards.forEach(card => {
          const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
          card.style.display = title.includes(term) ? 'block' : 'none';
        });
      });
    }

    // Setup timer in workout screen
    setupWorkoutTimer();
  }, 100);
});

// ─── WORKOUT TIMER ────────────────────────────────────────────────────────

function setupWorkoutTimer() {
  const toggleBtn = document.getElementById('toggleTimer');
  if (!toggleBtn) return;

  let isPaused = false;

  toggleBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    const icon = toggleBtn.querySelector('.material-symbols-outlined');
    icon.textContent = isPaused ? 'play_arrow' : 'pause';
    toggleBtn.classList.toggle('border-primary-fixed', !isPaused);
  });
}

// ─── WORKOUT DATA PERSISTENCE ────────────────────────────────────────────

function saveWorkout(workout) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return;

  const workouts = JSON.parse(localStorage.getItem('userWorkouts') || '[]');
  workouts.push({
    ...workout,
    userId: user.id,
    date: new Date().toISOString()
  });

  // Limit to last 50 workouts
  if (workouts.length > 50) {
    workouts.shift();
  }

  localStorage.setItem('userWorkouts', safeStringify(workouts));
}

function getWorkoutHistory() {
  return JSON.parse(localStorage.getItem('userWorkouts') || '[]');
}

// ─── GLOBAL FUNCTIONS ─────────────────────────────────────────────────────

window.performLogin = performLogin;
window.performRegister = performRegister;
window.switchAuthScreen = switchAuthScreen;
window.performLogout = performLogout;
window.showScreen = showScreen;

console.log('✅ App integrated successfully!');
