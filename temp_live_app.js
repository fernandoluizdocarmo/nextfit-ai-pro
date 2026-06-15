// NEXTFIT PRO - APPLICATION ENGINE
// Handles state, routing, database, timer, workout builder, and local storage persistence.

// ─── UTILITY: INPUT SANITIZATION ─────────────────────────────────────────────
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str; // textContent escapa HTML automaticamente
  return div.innerHTML;
};

// ─── UTILITY: SAFE JSON STORAGE ────────────────────────────────────────────── 
const safeStringify = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error('Erro ao serializar objeto para storage:', e);
    return null;
  }
};

// ─── UTILITY: CALCULATE BMI ────────────────────────────────────────────────────
const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
};

// ─── UTILITY: GET BMI CATEGORY ────────────────────────────────────────────────
const getBMICategory = (bmi) => {
  if (!bmi) return "desconhecida";
  if (bmi < 18.5) return "Abaixo do peso";
  if (bmi < 25) return "Peso normal";
  if (bmi < 30) return "Sobrepeso";
  return "Obesidade";
};

// 1. EXERCISE DATABASE (WITH RELIABLE YOUTUBE IFRAMES AND STEP-BY-STEP INSTRUCTIONS)
const EXERCISES_DB = {
  "supino_reto": {
    name: "Supino Reto com Barra",
    muscle: "Peito",
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg",
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
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/EZ-Bar_Skullcrusher/0.jpg",
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
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Front_Dumbbell_Raise/0.jpg",
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
    gif: "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Running_Treadmill/0.jpg",
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
    steps: [
      "Ajuste o selim na altura do quadril ao lado da bicicleta.",
      "Sente-se e pedale em ritmo constante mantendo a resistência adequada.",
      "Apoie as mãos suavemente no guidão."
    ],
    rest: 60,
    tips: "Evite balançar os quadris de um lado para o outro na pedalada."
  },
  "agachamento_frontal": {
      "name": "Agachamento Frontal com Barra",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Front_Squat_Clean_Grip/0.jpg",
      "steps": [
          "Apoie a barra nos ombros anteriorizados cruzando os braços ou na pegada olímpica.",
          "Desça mantendo o tronco o mais vertical possível para enfatizar os quadríceps.",
          "Suba empurrando os calcanhares contra o solo."
      ],
      "rest": 60,
      "tips": "Exige bastante mobilidade de punho e força no core para manter a coluna ereta."
  },
  "agachamento_sumo": {
      "name": "Agachamento Sumô",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Sumo_Deadlift/0.jpg",
      "steps": [
          "Afaste os pés além da largura dos ombros com as pontas viradas para fora (~45 graus).",
          "Desça o quadril de forma vertical, mantendo os joelhos alinhados com a ponta dos pés.",
          "Retorne contraindo os glúteos e a parte interna da coxa."
      ],
      "rest": 60,
      "tips": "Excelente ativação de adutores e glúteos. Mantenha o peito aberto o tempo todo."
  },
  "agachamento_smith": {
      "name": "Agachamento no Smith",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Smith_Machine_Bench_Press/0.jpg",
      "steps": [
          "Posicione-se under a barra do Smith com os pés ligeiramente à frente.",
          "Destrave a barra girando os punhos e realize o agachamento controladamente.",
          "Empurre a plataforma/solo para retornar à posição inicial."
      ],
      "rest": 60,
      "tips": "Excelente para focar na coxa reduzindo a carga de estabilização da coluna."
  },
  "leg_press_horizontal": {
      "name": "Leg Press Horizontal",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Leg_Press/0.jpg",
      "steps": [
          "Sente-se no aparelho e apoie os pés na plataforma na largura dos ombros.",
          "Destrave a plataforma e flexione os joelhos controladamente trazendo-os ao peito.",
          "Empurre a plataforma estendendo as pernas sem bloquear totalmente os joelhos."
      ],
      "rest": 60,
      "tips": "Mantenha a lombar apoiada firme no encosto do banco em todo o percurso."
  },
  "belt_squat": {
      "name": "Belt Squat (Agachamento com Cinturão)",
      "muscle": "Pernas",
      "gif": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "steps": [
          "Prenda o cinturão na polia baixa ou máquina de Belt Squat.",
          "Fique em pé com os pés na plataforma e coluna alinhada.",
          "Realize o agachamento mantendo o quadril para trás e o peso nos calcanhares."
      ],
      "rest": 60,
      "tips": "Ótimo para quem tem problemas na coluna, pois elimina totalmente a carga axial sobre os ombros."
  },
  "afundo": {
      "name": "Afundo com Halteres",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Lunges/0.jpg",
      "steps": [
          "Fique em pé com um halter em cada mão nas laterais do corpo.",
          "Dê um passo à frente mantendo a outra perna atrás.",
          "Desça o joelho de trás em direção ao chão até quase tocá-lo."
      ],
      "rest": 60,
      "tips": "Mantenha o alinhamento do joelho da frente com a ponta do pé para evitar lesões."
  },
  "passada": {
      "name": "Passada Caminhando",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Bodyweight_Walking_Lunge/0.jpg",
      "steps": [
          "Dê um passo à frente flexionando os joelhos em afundo.",
          "Impulsione o corpo para frente trazendo a perna de trás em um novo passo à frente.",
          "Caminhe de forma fluida alternando as pernas."
      ],
      "rest": 60,
      "tips": "Foque na estabilidade e equilíbrio mantendo o core contraído."
  },
  "agachamento_bulgaro": {
      "name": "Agachamento Búlgaro",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Split_Squat_with_Dumbbells/0.jpg",
      "steps": [
          "Apoie o peito de um pé atrás em um banco plano ou degrau elevado.",
          "Com a perna da frente, realize o agachamento descendo o quadril de forma linear.",
          "Empurre o chão com a perna da frente para retornar."
      ],
      "rest": 60,
      "tips": "Foco intenso no quadríceps e glúteo. Não deixe o tronco curvar excessivamente para a frente."
  },
  "step_up": {
      "name": "Step-up (Subida no Banco)",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Step-up_with_Knee_Raise/0.jpg",
      "steps": [
          "Apoie um pé totalmente em cima de um banco resistente.",
          "Suba estendendo a perna de apoio até ficar totalmente ereto sobre o banco.",
          "Desça de forma lenta resistindo à gravidade com a mesma perna."
      ],
      "rest": 60,
      "tips": "Tente não dar impulso com o pé que ficou no chão, faça a força apenas com a perna de cima."
  },
  "cadeira_flexora": {
      "name": "Cadeira Flexora",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Seated_Leg_Curl/0.jpg",
      "steps": [
          "Sente-se no aparelho alinhando os joelhos com o eixo de rotação da máquina.",
          "Flexione os joelhos trazendo o rolo para baixo e para trás.",
          "Retorne estendendo as pernas de forma lenta e controlada."
      ],
      "rest": 60,
      "tips": "Mantenha o quadril e a lombar bem pressionados no encosto do assento."
  },
  "good_morning": {
      "name": "Good Morning com Barra",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Good_Morning/0.jpg",
      "steps": [
          "Apoie la barra nos ombros (trapézio) exatamente como no agachamento.",
          "Com leve flexão nos joelhos, incline o tronco à frente empurrando o quadril para trás.",
          "Retorne contraindo fortemente os glúteos e posterior de coxa."
      ],
      "rest": 60,
      "tips": "Excelente para a cadeia posterior. Mantenha a coluna neutra e a lombar ativada o tempo todo."
  },
  "cadeira_abdutora": {
      "name": "Cadeira Abdutora",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Thigh_Abductor/0.jpg",
      "steps": [
          "Sente-se na máquina apoiando a lateral externa das coxas nas almofadas.",
          "Afaste as pernas contra a resistência empurrando para as laterais.",
          "Retorne de forma controlada mantendo a tensão."
      ],
      "rest": 60,
      "tips": "Para focar mais no glúteo médio, incline ligeiramente o tronco para a frente."
  },
  "cadeira_adutora": {
      "name": "Cadeira Adutora",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Thigh_Adductor/0.jpg",
      "steps": [
          "Sente-se afastando as pernas e apoiando a lateral interna das coxas.",
          "Feche as pernas contra a resistência até aproximar as almofadas.",
          "Abra lentamente resistindo ao retorno do peso."
      ],
      "rest": 60,
      "tips": "Trabalha a parte interna da coxa (adutores). Mantenha movimentos fluidos e sem trancos."
  },
  "panturrilha_sentada": {
      "name": "Panturrilha Sentada",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Seated_Calf_Raise/0.jpg",
      "steps": [
          "Sente-se na máquina, posicione o apoio sobre as coxas e a ponta dos pés no degrau.",
          "Eleve os calcanhares para liberar a trava de segurança.",
          "Desça os calcanhares para alongar e suba até a contração máxima da panturrilha."
      ],
      "rest": 60,
      "tips": "Trabalha especificamente o músculo sóleo. Faça pausas de 1s no topo e embaixo."
  },
  "panturrilha_leg_press": {
      "name": "Panturrilha no Leg Press",
      "muscle": "Pernas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Calf_Press/0.jpg",
      "steps": [
          "Sente-se no Leg Press, apoie apenas a ponta dos pés na borda inferior da plataforma.",
          "Realize a flexão plantar empurrando a plataforma apenas com os pés.",
          "Retorne alongando a panturrilha controladamente."
      ],
      "rest": 60,
      "tips": "Mantenha os joelhos semi-flexionados (destravados) e não faça força com as pernas."
  },
  "rosca_alternada": {
      "name": "Rosca Alternada com Halteres",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Alternate_Bicep_Curl/0.jpg",
      "steps": [
          "Fique em pé segurando os halteres com as palmas voltadas para o corpo.",
          "Suba um halter rotacionando o punho para cima (supinação) no meio do caminho.",
          "Desça controladamente e repita com o outro braço."
      ],
      "rest": 60,
      "tips": "Mantenha o cotovelo fixo ao lado do corpo, evitando jogá-lo para frente."
  },
  "rosca_scott": {
      "name": "Rosca Scott com Barra EZ",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Preacher_Curl/0.jpg",
      "steps": [
          "Apoie os braços no banco Scott, mantendo as axilas firmes no topo do encosto.",
          "Segure a barra EZ com as palmas para cima e flexione os braços trazendo a barra.",
          "Desça lentamente resistindo ao peso."
      ],
      "rest": 60,
      "tips": "Evite estender os cotovelos a 100% na descida para preservar o tendão do bíceps."
  },
  "rosca_concentrada": {
      "name": "Rosca Concentrada com Halter",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Concentration_Curls/0.jpg",
      "steps": [
          "Sente-se no banco, afaste as pernas e apoie o cotovelo no interno da coxa correspondente.",
          "Flexione o braço trazendo o halter em direção ao ombro.",
          "Desça lentamente controlando o peso."
      ],
      "rest": 60,
      "tips": "Isolamento extremo de bíceps. Evite mover o tronco durante a execução."
  },
  "rosca_polia": {
      "name": "Rosca Direta na Polia",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Standing_Biceps_Cable_Curl/0.jpg",
      "steps": [
          "De pé, de frente para a polia baixa, segurando a barra reta ou curva.",
          "Flexione os braços trazendo as mãos em direção aos ombros.",
          "Retorne estendendo lentamente resistindo ao cabo."
      ],
      "rest": 60,
      "tips": "O cabo mantém a tensão mecânica constante durante todo o arco do movimento."
  },
  "rosca_inversa": {
      "name": "Rosca Inversa com Halteres",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Standing_Dumbbell_Reverse_Curl/0.jpg",
      "steps": [
          "Segure halteres à frente das coxas com pegada pronada (palmas para trás).",
          "Flexione os cotovelos trazendo o peso para cima.",
          "Desça de forma lenta e controlada."
      ],
      "rest": 60,
      "tips": "Foco no braquiorradial (antebraço) e parte externa do bíceps."
  },
  "rosca_21": {
      "name": "Rosca 21 com Barra EZ",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/EZ-Bar_Curl/0.jpg",
      "steps": [
          "Faça 7 repetições parciais saindo debaixo até a metade.",
          "Faça mais 7 repetições parciais da metade até o topo.",
          "Finalize com 7 repetições completas por toda a amplitude."
      ],
      "rest": 60,
      "tips": "Excelente técnica de sobrecarga metabólica. Controle o ritmo e evite impulsos."
  },
  "rosca_spider": {
      "name": "Rosca Spider",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Spider_Curl/0.jpg",
      "steps": [
          "Deite-se de bruços em um banco inclinado a 45 graus com braços estendidos ao solo.",
          "Segure a barra EZ e flexione os cotovelos elevando a carga.",
          "Desça lentamente controlando a extensão."
      ],
      "rest": 60,
      "tips": "Por ter os braços pendidos à frente, isola o bíceps removendo qualquer ajuda do ombro."
  },
  "rosca_inclinada": {
      "name": "Rosca Inclinada com Halteres",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Incline_Dumbbell_Curl/0.jpg",
      "steps": [
          "Sente-se em um banco inclinado a 45 graus segurando halteres nas laterais do corpo.",
          "Mantendo os ombros para trás, flexione os cotovelos trazendo os pesos.",
          "Desça controladamente sentindo o alongamento do bíceps."
      ],
      "rest": 60,
      "tips": "Enfatiza a cabeça longa do bíceps devido à posição de pré-alongamento."
  },
  "triceps_barra": {
      "name": "Tríceps no Pulley com Barra",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Triceps_Pushdown_-_V-Bar_Attachment/0.jpg",
      "steps": [
          "Em pé na polia alta, segure a barra reta ou em V com as palmas para baixo.",
          "Mantendo os cotovelos rentes ao corpo, empurre a barra estendendo totalmente os braços.",
          "Retorne flexionando controladamente até o peito."
      ],
      "rest": 60,
      "tips": "Permite trabalhar com cargas mais elevadas em comparação com a corda."
  },
  "triceps_frances": {
      "name": "Tríceps Francês com Halter",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Standing_One-Arm_Dumbbell_Triceps_Extension/0.jpg",
      "steps": [
          "Fique em pé ou sentado segurando o halter acima da cabeça com o braço estendido.",
          "Flexione o cotovelo descendo o halter por trás da nuca de forma controlada.",
          "Estenda o braço apontando o cotovelo para o alto para retornar."
      ],
      "rest": 60,
      "tips": "Excelente estímulo para a porção longa do tríceps. Mantenha o cotovelo fechado."
  },
  "triceps_coice": {
      "name": "Tríceps Coice com Halter",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Tricep_Dumbbell_Kickback/0.jpg",
      "steps": [
          "Incline o tronco à frente apoiando uma mão e o joelho em um banco plano.",
          "Mantenha o cotovelo do braço livre colado à costela e flexionado a 90 graus.",
          "Estenda o cotovelo para trás até alinhar o braço completamente paralelo ao chão."
      ],
      "rest": 60,
      "tips": "Evite movimentar o ombro ou balançar o halter. O movimento deve ser 100% no cotovelo."
  },
  "supino_fechado": {
      "name": "Supino Fechado com Barra",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Close-Grip_Barbell_Bench_Press/0.jpg",
      "steps": [
          "Deite-se no banco plano e segure a barra com pegada na largura dos ombros.",
          "Desça a barra lentamente direcionando os cotovelos para baixo rente às costelas.",
          "Empurre a barra estendendo os braços com foco no tríceps."
      ],
      "rest": 60,
      "tips": "Evite uma pegada excessivamente fechada para não sobrecarregar as articulações dos punhos."
  },
  "mergulho_paralelas": {
      "name": "Mergulho nas Paralelas",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dips_-_Triceps_Version/0.jpg",
      "steps": [
          "Sustente o corpo nas barras paralelas mantendo os cotovelos travados.",
          "Flexione os cotovelos descendo o corpo até formar um ângulo reto nos braços.",
          "Empurre firmemente de volta para cima estendendo as articulações."
      ],
      "rest": 60,
      "tips": "Mantenha o tronco o mais vertical possível para direcionar o esforço aos tríceps."
  },
  "triceps_unilateral_polia": {
      "name": "Tríceps Unilateral na Polia",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Standing_Low-Pulley_One-Arm_Triceps_Extension/0.jpg",
      "steps": [
          "Posicione-se em frente à polia alta segurando o cabo sem manopla.",
          "Estenda o braço puxando o cabo para baixo até contrair totalmente o tríceps.",
          "Retorne de forma controlada até o ponto de flexão máxima."
      ],
      "rest": 60,
      "tips": "Excelente para corrigir assimetrias de força muscular entre os membros."
  },
  "triceps_banco": {
      "name": "Tríceps no Banco",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Bench_Dips/0.jpg",
      "steps": [
          "Apoie as mãos na borda de um banco plano e os calcanhares no chão (ou outro banco).",
          "Flexione os cotovelos descendo o quadril rente ao banco traseiro.",
          "Suba estendendo totalmente os braços empurrando o banco."
      ],
      "rest": 60,
      "tips": "Mantenha o abdômen ativado e evite afastar o tronco do banco durante a execução."
  },
  "extensao_acima_cabeca": {
      "name": "Extensão de Tríceps acima da Cabeça",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Triceps_Overhead_Extension_with_Rope/0.jpg",
      "steps": [
          "Segure a corda na polia média/alta, dê um passo à frente de costas para a máquina.",
          "Estenda os braços à frente, acima da linha da cabeça, puxando a corda.",
          "Retorne flexionando os cotovelos controladamente por trás da cabeça."
      ],
      "rest": 60,
      "tips": "Garante alongamento máximo da porção longa do tríceps sob tensão contínua."
  },
  "rosca_punho": {
      "name": "Rosca de Punho",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Palms-Down_Wrist_Curl_Over_A_Bench/0.jpg",
      "steps": [
          "Apoie os antebraços em um banco segurando os halteres com as palmas para cima.",
          "Flexione apenas os punhos puxando a carga em direção ao antebraço.",
          "Desça estendendo os punhos de forma controlada."
      ],
      "rest": 60,
      "tips": "Excelente isolamento para os músculos flexores do antebraço."
  },
  "rosca_inversa_punho": {
      "name": "Rosca Inversa de Punho",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Palms-Down_Dumbbell_Wrist_Curl_Over_A_Bench/0.jpg",
      "steps": [
          "Apoie os antebraços em um banco segurando halteres com as palmas para baixo.",
          "Estenda os punhos trazendo as costas das mãos para cima.",
          "Retorne lentamente alongando a porção extensora do antebraço."
      ],
      "rest": 60,
      "tips": "Foque nos extensores do antebraço. Faça movimentos curtos e precisos."
  },
  "farmers_walk": {
      "name": "Farmer's Walk",
      "muscle": "Braços",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Farmers_Walk/0.jpg",
      "steps": [
          "Segure um halter pesado em cada mão e mantenha os ombros alinhados.",
          "Caminhe a distância ou tempo estipulados mantendo postura ereta e abdômen contraído.",
          "Mantenha passos curtos e ritmo firme."
      ],
      "rest": 60,
      "tips": "Fortalece intensamente a pegada, trapézios, antebraços e estabilizadores do core."
  },
  "hang_barra_fixa": {
      "name": "Hang na Barra Fixa",
      "muscle": "Braços",
      "gif": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "steps": [
          "Segure na barra fixa e fique com o corpo suspenso.",
          "Ative as escápulas mantendo os ombros firmes longe das orelhas.",
          "Mantenha a sustentação e respiração estáveis pelo tempo estipulado."
      ],
      "rest": 60,
      "tips": "Excelente para a saúde dos ombros, descompressão da coluna e força de pegada."
  },
  "supino_inclinado_barra": {
      "name": "Supino Inclinado com Barra",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg",
      "steps": [
          "Deite-se no banco inclinado e segure a barra em pegada média.",
          "Retire a barra e desça-a controladamente até encostar na linha superior do peito.",
          "Empurre verticalmente de volta até estender os braços."
      ],
      "rest": 60,
      "tips": "Enfatiza a porção clavicular (superior) do peitoral."
  },
  "supino_declinado": {
      "name": "Supino Declinado com Barra",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Decline_Barbell_Bench_Press/0.jpg",
      "steps": [
          "Prenda os pés nos rolos e deite no banco declinado.",
          "Desça a barra controladamente em direção ao peitoral inferior.",
          "Empurre estendendo os braços mantendo a força no peito."
      ],
      "rest": 60,
      "tips": "Trabalha a parte inferior do peitoral, reduzindo a ativação dos ombros."
  },
  "supino_halter": {
      "name": "Supino Reto com Halteres",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Bench_Press/0.jpg",
      "steps": [
          "Deite no banco plano segurando os halteres com os cotovelos a 90 graus.",
          "Empurre os halteres para cima aproximando-os levemente no topo.",
          "Desça controladamente alongando o peito ao máximo."
      ],
      "rest": 60,
      "tips": "Permite maior amplitude de movimento e ajuste anatômico das articulações em comparação com a barra."
  },
  "supino_smith": {
      "name": "Supino no Smith",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Smith_Machine_Bench_Press/0.jpg",
      "steps": [
          "Deite sob a barra do Smith de forma centralizada.",
          "Destrave a barra e desça até quase tocar o peitoral.",
          "Empurre verticalmente estendendo os cotovelos."
      ],
      "rest": 60,
      "tips": "Excelente para trabalhar com falha concêntrica devido às travas de segurança da guia metálica."
  },
  "crucifixo_reto": {
      "name": "Crucifixo Reto com Halteres",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Flyes/0.jpg",
      "steps": [
          "Deite no banco plano segurando os halteres com os braços estendidos e palmas viradas uma para a outra.",
          "Abra os braços lateralmente mantendo leve flexão nos cotovelos para isolar.",
          "Feche os braços unindo os halteres de volta no topo."
      ],
      "rest": 60,
      "tips": "Evite dobrar os cotovelos em excesso para não transformar o movimento em supino."
  },
  "crucifixo_inclinado": {
      "name": "Crucifixo Inclinado com Halteres",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Incline_Dumbbell_Flyes/0.jpg",
      "steps": [
          "Deite no banco inclinado segurando os halteres.",
          "Abra os braços em arco lateral controlando a descida do peso.",
          "Feche os braços contraindo o peitoral superior."
      ],
      "rest": 60,
      "tips": "Concentre a força no peito e evite encostar os halteres no topo para manter a tensão ativa."
  },
  "crucifixo_declinado": {
      "name": "Crucifixo Declinado com Halteres",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Decline_Dumbbell_Flyes/0.jpg",
      "steps": [
          "Deite no banco declinado e segure os halteres.",
          "Abra lateralmente sentindo o alongamento do peito inferior.",
          "Feche subindo os pesos com controle."
      ],
      "rest": 60,
      "tips": "Mantenha a estabilidade dos pés nas travas do banco."
  },
  "flexao_braço": {
      "name": "Flexão de Braços",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Pushups/0.jpg",
      "steps": [
          "Apoie as mãos e as pontas dos pés no chão com o corpo em prancha alinhada.",
          "Flexione os cotovelos descendo o peito até próximo ao solo.",
          "Empurre o chão estendendo os braços de volta ao topo."
      ],
      "rest": 60,
      "tips": "Mantenha o abdômen ativado para evitar a queda ou elevação excessiva do quadril."
  },
  "pullover": {
      "name": "Pullover com Halter",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Bent-Arm_Dumbbell_Pullover/0.jpg",
      "steps": [
          "Deite de costas no banco reto apoiando as costas e segurando o halter acima do peito.",
          "Desça o halter para trás da cabeça mantendo os cotovelos semi-flexionados.",
          "Puxe o halter de volta à posição inicial sobre o peito."
      ],
      "rest": 60,
      "tips": "Trabalha tanto a porção inferior do peitoral quanto os músculos latíssimos do dorso."
  },
  "barra_fixa_pronada": {
      "name": "Barra Fixa Pronada (Pull-up)",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Pullups/0.jpg",
      "steps": [
          "Segure a barra com pegada pronada (palmas para a frente) mais aberta que os ombros.",
          "Puxe o corpo para cima até passar o queixo da altura da barra.",
          "Desça lentamente resistindo à gravidade até estender os braços."
      ],
      "rest": 60,
      "tips": "Foque em puxar direcionando os cotovelos para baixo, ativando as dorsais."
  },
  "barra_fixa_supinada": {
      "name": "Barra Fixa Supinada (Chin-up)",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Chin-Up/0.jpg",
      "steps": [
          "Segure a barra com pegada supinada (palmas voltadas para você) na largura dos ombros.",
          "Puxe o corpo trazendo o peito em direção à barra.",
          "Desça lentamente alongando as costas."
      ],
      "rest": 60,
      "tips": "Excelente ativação de bíceps em conjunto com o latíssimo do dorso."
  },
  "puxada_fechada": {
      "name": "Puxada Frontal Fechada",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Close-Grip_Front_Lat_Pulldown/0.jpg",
      "steps": [
          "Segure o puxador triângulo na polia alta da máquina.",
          "Puxe o puxador em direção ao peitoral inferior inclinando o tronco levemente para trás.",
          "Retorne estendendo totalmente os braços controlando o peso."
      ],
      "rest": 60,
      "tips": "Isola os músculos dorsais médios e o redondo maior. Mantenha os ombros para baixo."
  },
  "pulldown_corda": {
      "name": "Pulldown na Polia com Corda",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Rope_Straight-Arm_Pulldown/0.jpg",
      "steps": [
          "Em pé de frente para a polia alta, incline o tronco segurando a corda com braços estendidos.",
          "Puxe a corda para baixo trazendo as mãos ao lado do quadril com cotovelos semi-flexionados fixos.",
          "Retorne lentamente alongando as costas."
      ],
      "rest": 60,
      "tips": "Excelente isolamento das dorsais sem fadigar o bíceps."
  },
  "remada_curvada_barra": {
      "name": "Remada Curvada com Barra",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Bent_Over_Barbell_Row/0.jpg",
      "steps": [
          "Incline o tronco à frente a ~45 graus destravando os joelhos e alinhando as costas.",
          "Puxe a barra em direção ao abdômen inferior (linha do umbigo).",
          "Desça a barra de forma controlada até estender os braços."
      ],
      "rest": 60,
      "tips": "Mantenha o abdômen travado e a lombar rígida para estabilizar a carga."
  },
  "remada_unilateral": {
      "name": "Remada Unilateral com Halter (Serrote)",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/One-Arm_Dumbbell_Row/0.jpg",
      "steps": [
          "Apoie um joelho e a mão do mesmo lado em um banco plano, mantendo a coluna reta.",
          "Puxe o halter com o outro braço trazendo o cotovelo em direção ao quadril.",
          "Desça o halter controladamente permitindo o alongamento da dorsal."
      ],
      "rest": 60,
      "tips": "Puxe o peso focando em acionar as costas primeiro, evitando tensionar o bíceps antes do tempo."
  },
  "remada_cavalinho": {
      "name": "Remada Cavalinho (T-bar)",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/T-Bar_Row_with_Handle/0.jpg",
      "steps": [
          "Posicione os pés na plataforma e incline o tronco segurando o puxador.",
          "Puxe o peso trazendo a barra em direção ao abdômen médio.",
          "Estenda os braços controlando o retorno da carga."
      ],
      "rest": 60,
      "tips": "Mantenha a coluna ereta e evite dar trancos com o quadril durante a puxada."
  },
  "remada_articulada_maquina": {
      "name": "Remada Articulada na Máquina",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Leverage_Iso_Row/0.jpg",
      "steps": [
          "Ajuste a altura do banco e apoie o peitoral no suporte frontal.",
          "Puxe as manoplas contraindo as costas e aproximando as escápulas.",
          "Retorne lentamente alongando as dorsais."
      ],
      "rest": 60,
      "tips": "Excelente para treinar costas de forma pesada e segura eliminando estresse na lombar."
  },
  "remada_invertida": {
      "name": "Remada Invertida",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Inverted_Row/0.jpg",
      "steps": [
          "Posicione-se embaixo de uma barra fixa ajustada na altura do quadril.",
          "Segure na barra suspensa com calcanhares no chão e corpo em prancha rígida.",
          "Puxe o peitoral em direção à barra contraindo as costas."
      ],
      "rest": 60,
      "tips": "Excelente exercício com peso corporal para fortalecimento da postura escapular."
  },
  "levantamento_terra": {
      "name": "Levantamento Terra com Barra",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Deadlift/0.jpg",
      "steps": [
          "Posicione-se com as canelas próximas à barra no chão, pés na largura do quadril.",
          "Segure la barra, ative as escápulas e empurre o solo estendendo o corpo.",
          "Retorne descendo o quadril e a barra rente às pernas de forma firme."
      ],
      "rest": 60,
      "tips": "Exercício composto de força máxima. A coluna lombar nunca deve flexionar/curvar durante o movimento."
  },
  "encolhimento_trapezio": {
      "name": "Encolhimento de Ombros",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Shrug/0.jpg",
      "steps": [
          "Fique em pé segurando barra ou halteres à frente.",
          "Eleve os ombros verticalmente na direção das orelhas.",
          "Desça de forma controlada alongando a musculatura superior."
      ],
      "rest": 60,
      "tips": "Não rotacione os ombros; o movimento correto é puramente vertical para cima e para baixo."
  },
  "face_pull": {
      "name": "Face Pull na Polia",
      "muscle": "Ombros",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Face_Pull/0.jpg",
      "steps": [
          "Ajuste a corda na polia na altura do rosto.",
          "Puxe a corda em direção à testa, afastando os braços e rotacionando os punhos para fora.",
          "Retorne controladamente sentindo a ativação dos ombros posteriores."
      ],
      "rest": 60,
      "tips": "Excelente exercício corretivo para postura e estabilidade da articulação glenoumeral."
  },
  "extensao_lombar": {
      "name": "Extensão Lombar (Banco Romano)",
      "muscle": "Core",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Hyperextensions_Back_Extensions/0.jpg",
      "steps": [
          "Apoie o quadril no suporte do banco romano travando os tornozelos.",
          "Incline o tronco para baixo mantendo a coluna ereta.",
          "Suba o tronco ativando glúteos e eretores da espinha."
      ],
      "rest": 60,
      "tips": "Evite realizar uma hiperextensão excessiva no topo (jogar as costas muito para trás)."
  },
  "hip_thrust": {
      "name": "Elevação Pélvica (Hip Thrust)",
      "muscle": "Glúteos",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Hip_Thrust/0.jpg",
      "steps": [
          "Apoie a parte superior das costas em um banco plano.",
          "Posicione a barra acolchoada na linha do quadril.",
          "Empurre o quadril para cima apoiando a força nos calcanhares."
      ],
      "rest": 60,
      "tips": "O principal construtor de glúteos. Faça força direcionando os joelhos para fora."
  },
  "glute_bridge": {
      "name": "Ponte de Glúteo",
      "muscle": "Glúteos",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Glute_Bridge/0.jpg",
      "steps": [
          "Deite-se no colchonete com joelhos dobrados e pés firmes no chão.",
          "Eleve o quadril em direção ao teto contraindo fortemente os glúteos.",
          "Desça lentamente até tocar levemente o solo."
      ],
      "rest": 60,
      "tips": "Ótima ativação para quem quer trabalhar glúteos sem sobrecarregar a lombar."
  },
  "coice_polia": {
      "name": "Glúteo Coice na Polia",
      "muscle": "Glúteos",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Glute_Kickback/0.jpg",
      "steps": [
          "Prenda a tornozeleira na polia baixa e fique de frente para o aparelho.",
          "Incline levemente o tronco e empurre a perna estendida para trás e para cima.",
          "Retorne controladamente segurando a carga."
      ],
      "rest": 60,
      "tips": "Evite curvar ou girar a coluna lombar; o movimento deve se concentrar no glúteo."
  },
  "swing_kettlebell": {
      "name": "Swing com Kettlebell",
      "muscle": "Glúteos",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/One-Arm_Kettlebell_Swings/0.jpg",
      "steps": [
          "Com o kettlebell entre as pernas, empurre o quadril para trás inclinando o tronco.",
          "Estenda o quadril de forma explosiva jogando o peso para frente até a altura dos ombros.",
          "Deixe o peso retornar flexionando o quadril."
      ],
      "rest": 60,
      "tips": "O movimento de swing deve ser gerado pelo quadril e glúteos, não pelos ombros ou braços."
  },
  "flexao_inclinada": {
      "name": "Flexão Inclinada",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Pushups/0.jpg",
      "steps": [
          "Apoie as mãos em uma superfície elevada (banco ou caixa) mais aberta que a largura dos ombros.",
          "Mantenha o corpo alinhado em prancha e desça o peito em direção à borda.",
          "Empurre de volta estendendo os braços."
      ],
      "rest": 60,
      "tips": "Excelente variação para iniciantes ou para finalizar o treino reduzindo a intensidade."
  },
  "flexao_declinada": {
      "name": "Flexão Declinada",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Decline_Push-Up/0.jpg",
      "steps": [
          "Apoie as pontas dos pés em um banco ou superfície elevada e as mãos no chão.",
          "Desça o peito em direção ao chão mantendo o corpo rígido em prancha.",
          "Empurre o chão para retornar à posição inicial."
      ],
      "rest": 60,
      "tips": "Aumenta significativamente a carga de trabalho na porção superior do peito e ombro anterior."
  },
  "flexao_diamante": {
      "name": "Flexão Diamante",
      "muscle": "Peito",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Pushups_Close_and_Wide_Hand_Positions/0.jpg",
      "steps": [
          "Posicione as mãos próximas no chão, unindo polegares e indicadores em formato de diamante.",
          "Desça o peito mantendo os cotovelos bem fechados e rentes às costelas.",
          "Empurre estendendo totalmente os braços focando no tríceps."
      ],
      "rest": 60,
      "tips": "Foco extremo no tríceps e na porção interna do peitoral."
  },
  "barra_fixa_neutra": {
      "name": "Barra Fixa Neutra",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Pullups/0.jpg",
      "steps": [
          "Segure a barra pelas manoplas paralelas em pegada neutra.",
          "Puxe o corpo para cima até o queixo passar as mãos flexionando os cotovelos.",
          "Desça controladamente alongando totalmente a musculatura dorsal."
      ],
      "rest": 60,
      "tips": "Pegada anatômica mais segura e confortável para quem tem desconforto nos punhos ou ombros."
  },
  "puxada_articulada": {
      "name": "Puxada Articulada",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Leverage_High_Row/0.jpg",
      "steps": [
          "Sente-se no aparelho articulado ajustando o rolo nos joelhos.",
          "Segure as manoplas e puxe-as de forma independente para baixo e para trás.",
          "Retorne controladamente sentindo o alongamento da dorsal."
      ],
      "rest": 60,
      "tips": "A articulação independente ajuda a corrigir assimetrias musculares e de força entre os lados."
  },
  "terra_romeno": {
      "name": "Levantamento Terra Romeno",
      "muscle": "Costas",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Romanian_Deadlift/0.jpg",
      "steps": [
          "Fique em pé segurando a barra na linha das coxas na pegada pronada.",
          "Incline o tronco mantendo a barra colada nas pernas e empurrando o quadril para trás.",
          "Suba estendendo o quadril contraindo fortemente os glúteos e posterior."
      ],
      "rest": 60,
      "tips": "Diferente do Stiff, permite leve flexão nos joelhos para maximizar a ativação glútea."
  },
  "coice_maquina": {
      "name": "Glúteo Coice na Máquina",
      "muscle": "Glúteos",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Glute_Kickback/0.jpg",
      "steps": [
          "Posicione-se no aparelho apoiando o peito no suporte e o pé na placa.",
          "Empurre a placa para trás e para cima estendendo a coxa contra a resistência.",
          "Retorne de forma controlada resistindo à carga."
      ],
      "rest": 60,
      "tips": "Mantenha o abdômen contraído para evitar hiperextensão da lombar no topo da contração."
  },
  "frog_pump": {
      "name": "Frog Pump",
      "muscle": "Glúteos",
      "gif": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "steps": [
          "Deite-se de costas, una as solas dos pés (posição de sapo) e traga-os perto do quadril.",
          "Eleve o quadril em direção ao teto contraindo fortemente os glúteos.",
          "Desça de forma controlada até quase tocar o colchonete."
      ],
      "rest": 60,
      "tips": "Isolador de glúteos puro. Excelente para ativação pré-treino."
  },
  "cable_pull_through": {
      "name": "Cable Pull-Through",
      "muscle": "Glúteos",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Pull_Through/0.jpg",
      "steps": [
          "Fique de costas para a polia baixa, segurando a corda por entre as pernas.",
          "Flexione o quadril inclinando o tronco com joelhos destravados.",
          "Estenda o quadril empurrando-o para a frente e contraindo glúteos."
      ],
      "rest": 60,
      "tips": "Mova-se apenas no quadril (dobradiça). Os braços servem apenas como cabos de conexão."
  },
  "kickback_caneleira": {
      "name": "Glúteo Kickback com Caneleira",
      "muscle": "Glúteos",
      "gif": "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Glute_Kickback/0.jpg",
      "steps": [
          "Fique em quatro apoios no colchonete.",
          "Eleve uma perna estendida para trás e para cima, esmagando o glúteo no pico.",
          "Desça lentamente controlando o peso da caneleira."
      ],
      "rest": 60,
      "tips": "Mantenha o tronco e pescoço alinhados. Execute o movimento sem balançar o corpo."
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
  userEmail: "",
  userName: "",
  userProfile: {
    age: null,
    weight: null,
    height: null,
    bmi: null
  },
  currentFicha: null, // The active Ficha
  previousFicha: null, // Previous Ficha used as a non-repetition reference
  expirationAlertDismissed: false, // Flag to avoid repeatedly showing modal in a single session
  currentSplit: "A",  // "A", "B", or "C"
  history: [],        // Saved completed workouts or generated plans
  activeWorkout: null, // { split: "A", currentExerciseIndex: 0, startTime: Date.now(), logs: [] }
  // User storage (simplified - for demo purposes)
  users: {} // { email: { password, name, profile: { age, weight, height } } }
};

// ─── STATE LOCK: Prevent duplicate requests ────────────────────────────────────
let isGeneratingWorkout = false;
const MAX_HISTORY_ITEMS = 50; // Limitar histórico para não overflow localStorage

// ─── AUTHENTICATION FUNCTIONS ──────────────────────────────────────────────────

const switchAuthScreen = (screen) => {
  const registerScreen = document.getElementById("register-screen");
  const authOverlay = document.getElementById("auth-overlay");
  
  if (registerScreen) {
    registerScreen.style.display = "block";
  }
  if (authOverlay) {
    authOverlay.classList.remove("login-active");
    authOverlay.classList.add("register-active");
    authOverlay.scrollTop = 0; // Garantir que volte ao topo
  }
};

// Registration Logic
const performRegister = () => {
  const nameInput = document.getElementById("register-name");
  const passwordInput = document.getElementById("register-password");
  const ageInput = document.getElementById("register-age");
  const weightInput = document.getElementById("register-weight");
  const heightInput = document.getElementById("register-height");
  
  const name = (nameInput.value || "").trim();
  const password = (passwordInput.value || "").trim();
  const age = parseInt(ageInput.value) || null;
  const weight = parseFloat(weightInput.value) || null;
  const height = parseInt(heightInput.value) || null;

  // Validação
  if (!name || !password || !age || !weight || !height) {
    alert("⚠️ Por favor, preencha todos os campos.");
    return;
  }

  if (password.length < 6) {
    alert("⚠️ Senha deve ter pelo menos 6 caracteres.");
    return;
  }

  // Verificar se nome já existe
  if (state.users[name]) {
    alert("⚠️ Este nome já está registrado.");
    return;
  }

  // Registrar usuário
  state.users[name] = {
    password: password, // em produção, usar hash!
    name: sanitizeInput(name),
    profile: {
      age: age,
      weight: weight,
      height: height,
      bmi: calculateBMI(weight, height)
    }
  };

  // Fazer login automaticamente
  state.isLoggedIn = true;
  localStorage.setItem('treinox_ai_session_active', 'true');
  localStorage.setItem('treinox_ai_last_email', name);
  localStorage.setItem('treinox_ai_last_password', password);
  state.userEmail = name;
  state.userName = state.users[name].name;
  state.userProfile = state.users[name].profile;
  
  // Limpar dados de treino para que a nova conta inicie vazia (sem a ficha padrão)
  state.currentFicha = null;
  state.previousFicha = null;
  state.history = [];
  state.activeWorkout = null;
  
  saveStateToStorage();
  checkLoginStatus();
  
  // Atualizar UI
  updateUserUI();
  populateGeneratorForm();
  console.log("✅ Conta criada com sucesso:", state.userName);
};

// Login Logic (kept as dummy/fallback helper)
const performLogin = () => {
  // Login directly bypassed to registration
  alert("⚠️ Operação indisponível. Cadastre-se diretamente.");
};

const populateGeneratorForm = () => {
  const nameInput = document.getElementById("user-name-input");
  const ageInput = document.getElementById("form-age");
  const weightInput = document.getElementById("form-weight");
  const heightInput = document.getElementById("form-height");

  if (nameInput && state.userName) {
    nameInput.value = state.userName;
  }
  if (state.userProfile) {
    if (ageInput && state.userProfile.age) ageInput.value = state.userProfile.age;
    if (weightInput && state.userProfile.weight) weightInput.value = state.userProfile.weight;
    if (heightInput && state.userProfile.height) heightInput.value = state.userProfile.height;
  }
};

const checkLoginStatus = () => {
  const authOverlay = document.getElementById("auth-overlay");
  const appContainer = document.getElementById("app-container");
  const mobileNav = document.getElementById("mobileTaskbar");

  if (state.isLoggedIn) {
    if (authOverlay) authOverlay.style.display = "none";
    if (appContainer) appContainer.style.display = "block";
    if (mobileNav) mobileNav.style.display = "flex";
    updateUserUI();
    populateGeneratorForm();
  } else {
    if (authOverlay) authOverlay.style.display = "flex";
    if (appContainer) appContainer.style.display = "none";
    if (mobileNav) mobileNav.style.display = "none";
    switchAuthScreen("register");
  }
};

const updateUserUI = () => {
  try {
    const sidebarName = document.getElementById("sidebar-user-name");
    if (sidebarName) sidebarName.textContent = state.userName;
    
    const sidebarRole = document.getElementById("sidebar-user-role");
    if (sidebarRole) sidebarRole.textContent = "Membro";
    
    document.querySelectorAll(".user-info h4").forEach(el => {
      if (el) el.textContent = state.userName;
    });
  } catch (e) {
    console.warn("Erro ao atualizar UI do usuário:", e.message);
  }
};

const performLogout = () => {
  if (confirm("Deseja sair da conta atual?")) {
    state.isLoggedIn = false;
    localStorage.removeItem('treinox_ai_session_active');
    state.userEmail = "";
    state.userName = "";
    state.userProfile = { age: null, weight: null, height: null, bmi: null };
    state.currentFicha = null;
    state.history = [];
    state.activeWorkout = null;
    saveStateToStorage();
    
    const regName = document.getElementById("register-name");
    const regPass = document.getElementById("register-password");
    const regAge = document.getElementById("register-age");
    const regWeight = document.getElementById("register-weight");
    const regHeight = document.getElementById("register-height");
    
    if (regName) regName.value = "";
    if (regPass) regPass.value = "";
    if (regAge) regAge.value = "";
    if (regWeight) regWeight.value = "";
    if (regHeight) regHeight.value = "";
    
    checkLoginStatus();
  }
};

// ─── PROFILE MANAGEMENT FUNCTIONS ──────────────────────────────────────────────

let isEditMode = false;

const toggleEditMode = () => {
  isEditMode = !isEditMode;
  
  const viewMode = document.getElementById("profile-view-mode");
  const editMode = document.getElementById("profile-edit-mode");
  const editBtn = document.getElementById("edit-mode-btn-text");
  
  if (isEditMode) {
    viewMode.style.display = "none";
    editMode.style.display = "block";
    editBtn.textContent = "Cancelar";
    
    // Preencher formulário com dados atuais
    document.getElementById("edit-name").value = state.userName;
    document.getElementById("edit-age").value = state.userProfile.age || "";
    document.getElementById("edit-weight").value = state.userProfile.weight || "";
    document.getElementById("edit-height").value = state.userProfile.height || "";
  } else {
    viewMode.style.display = "block";
    editMode.style.display = "none";
    editBtn.textContent = "Editar Perfil";
  }
};

const saveProfileChanges = () => {
  const name = (document.getElementById("edit-name").value || "").trim();
  const age = parseInt(document.getElementById("edit-age").value) || null;
  const weight = parseFloat(document.getElementById("edit-weight").value) || null;
  const height = parseInt(document.getElementById("edit-height").value) || null;
  
  if (!name || !age || !weight || !height) {
    alert("⚠️ Por favor, preencha todos os campos.");
    return;
  }
  
  if (age < 15 || age > 100) {
    alert("⚠️ Idade deve estar entre 15 e 100 anos.");
    return;
  }
  
  if (weight < 30 || weight > 250) {
    alert("⚠️ Peso deve estar entre 30kg e 250kg.");
    return;
  }
  
  if (height < 130 || height > 220) {
    alert("⚠️ Altura deve estar entre 130cm e 220cm.");
    return;
  }
  
  // Atualizar dados
  state.userName = sanitizeInput(name);
  state.userProfile.age = age;
  state.userProfile.weight = weight;
  state.userProfile.height = height;
  state.userProfile.bmi = calculateBMI(weight, height);
  
  // Atualizar no users storage também
  if (state.users[state.userEmail]) {
    state.users[state.userEmail].name = state.userName;
    state.users[state.userEmail].profile = { ...state.userProfile };
  }
  
  saveStateToStorage();
  updateUserUI();
  renderProfile();
  populateGeneratorForm();
  toggleEditMode();
  
  alert("✅ Perfil atualizado com sucesso!");
};

const renderProfile = () => {
  document.getElementById("profile-user-name").textContent = state.userName;
  document.getElementById("profile-user-email").textContent = state.userEmail;
  
  // View mode
  document.getElementById("profile-display-name").textContent = state.userName || "-";
  document.getElementById("profile-display-age").textContent = state.userProfile.age ? `${state.userProfile.age} anos` : "-";
  document.getElementById("profile-display-weight").textContent = state.userProfile.weight ? `${state.userProfile.weight} kg` : "-";
  document.getElementById("profile-display-height").textContent = state.userProfile.height ? `${state.userProfile.height} cm` : "-";
  
  const bmi = state.userProfile.bmi;
  const bmiCat = getBMICategory(bmi);
  document.getElementById("profile-display-bmi").textContent = bmi ? bmi.toFixed(1) : "-";
  document.getElementById("profile-display-bmi-cat").textContent = bmiCat;
};

const changePassword = () => {
  const newPassword = prompt("Digite sua nova senha (mínimo 6 caracteres):");
  
  if (newPassword === null) return; // Cancelado
  
  if (!newPassword || newPassword.trim().length < 6) {
    alert("⚠️ Senha deve ter pelo menos 6 caracteres.");
    return;
  }
  
  // Atualizar senha
  if (state.users[state.userEmail]) {
    state.users[state.userEmail].password = newPassword.trim();
    saveStateToStorage();
    alert("✅ Senha alterada com sucesso!");
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
      state.isLoggedIn = localStorage.getItem('treinox_ai_session_active') === 'true';
      state.userEmail = parsed.userEmail || "";
      state.userName = parsed.userName || "";
      state.userProfile = parsed.userProfile || { age: null, weight: null, height: null, bmi: null };
      state.users = parsed.users || {};
      
      // Limpeza solicitada de todos os usuários cadastrados
      if (!localStorage.getItem("treinox_ai_users_wiped_v1")) {
        state.users = {};
        state.isLoggedIn = false;
        state.userEmail = "";
        state.userName = "";
        state.userProfile = { age: null, weight: null, height: null, bmi: null };
        localStorage.removeItem('treinox_ai_session_active');
        localStorage.setItem("treinox_ai_users_wiped_v1", "true");
      }
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
  try {
    // Limitar histórico aos últimos MAX_HISTORY_ITEMS para evitar overflow
    const stateToBeSaved = {
      ...state,
      history: state.history.slice(-MAX_HISTORY_ITEMS)
    };

    const serialized = safeStringify(stateToBeSaved);
    if (!serialized) {
      console.error("Falha ao serializar state para storage");
      return;
    }

    localStorage.setItem("treinox_ai_state", serialized);
    console.log(`💾 State salvo (${state.history.length} treinos no histórico)`);
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn("⚠️ localStorage cheio! Removendo histórico antigo...");
      state.history = state.history.slice(-10); // Manter apenas últimos 10
      try {
        localStorage.setItem("treinox_ai_state", safeStringify({
          ...state,
          history: state.history
        }));
        console.log("✅ Storage compactado");
      } catch (e2) {
        console.error("Erro crítico ao salvar state:", e2);
      }
    } else {
      console.error("Erro ao salvar state para localStorage:", e);
    }
  }
};

// 6. ROUTER (TABS NAVIGATION)
window.navigateTo = (pageId) => {
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

  // Restaurar visibilidade da barra de tarefas e resetar scroll no mobile ao trocar de tela
  if (typeof window.resetMobileTaskbar === "function") {
    window.resetMobileTaskbar();
  }
  window.scrollTo(0, 0);
  const mainContent = document.querySelector('.main-content');
  if (mainContent) mainContent.scrollTop = 0;

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
    } else if (pageId === "generator") {
      populateGeneratorForm();
    } else if (pageId === "historico") {
      renderHistory();
    } else if (pageId === "perfil") {
      renderProfile();
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
  const sexLabel = ficha.sex ? `Sexo: ${ficha.sex} | ` : '';
  document.getElementById("dashboard-ficha-info").textContent = `${sexLabel}Foco: ${ficha.objective} | Nível: ${ficha.level}${ficha.emphasis ? ` | Ênfase: ${ficha.emphasis}` : ''}`;

  // Inject AI badge if AI-generated
  const fichaInfoEl = document.getElementById("dashboard-ficha-info");
  const existingBadge = document.getElementById("ai-generated-badge");
  if (existingBadge) existingBadge.remove();
  const existingRationale = document.getElementById("ai-rationale-banner");
  if (existingRationale) existingRationale.remove();

  if (ficha.aiGenerated) {
    // Badge next to title
    const badge = document.createElement("span");
    badge.id = "ai-generated-badge";
    badge.innerHTML = `<span class="material-symbols-outlined" style="font-size:0.85rem;vertical-align:middle;">smart_toy</span> Gemini AI`;
    badge.style.cssText = `
      display: inline-flex; align-items: center; gap: 0.3rem;
      background: linear-gradient(135deg, #FF6B00, #FF9A00);
      color: white; font-size: 0.7rem; font-weight: 700;
      padding: 0.2rem 0.6rem; border-radius: 20px;
      margin-left: 0.5rem; letter-spacing: 0.04em;
      vertical-align: middle; text-transform: uppercase;
    `;
    document.getElementById("dashboard-ficha-title").appendChild(badge);

    // AI rationale banner
    if (ficha.aiRationale) {
      const rationale = document.createElement("div");
      rationale.id = "ai-rationale-banner";
      rationale.style.cssText = `
        margin-top: 0.75rem; padding: 0.7rem 1rem;
        background: rgba(255,107,0,0.08); border-left: 3px solid #FF6B00;
        border-radius: 4px; font-size: 0.82rem; color: rgba(255,255,255,0.7);
        display: flex; align-items: flex-start; gap: 0.5rem; line-height: 1.5;
      `;
      rationale.innerHTML = `<span class="material-symbols-outlined" style="font-size:1rem;color:#FF6B00;flex-shrink:0;margin-top:0.05rem;">lightbulb</span><span><strong style="color:#FF9A00;">IA explica:</strong> ${ficha.aiRationale}</span>`;
      fichaInfoEl.parentNode.insertBefore(rationale, fichaInfoEl.nextSibling);
    }
  }

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
          ${dbEx.videoUrl ? `
            <video style="width: 100%; height: 100%; object-fit: cover;" autoplay muted loop>
              <source src="${dbEx.videoUrl}" type="video/mp4">
              <img src="${dbEx.gif}" alt="${dbEx.name}">
            </video>
          ` : `
            <img src="${dbEx.gif || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(dbEx.name) + '&background=1E1E2E&color=FF5E00&size=128&font-size=0.33'}" alt="${dbEx.name}" onerror="this.src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'">
          `}
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
    <div class="video-player-card" style="position: relative; overflow: hidden; max-width: 100%; border-radius: var(--border-radius-md); box-shadow: 0 4px 15px rgba(0,0,0,0.5); background: #1a1a2e; aspect-ratio: 16/9;">
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
    <div style="border-radius: var(--border-radius-md); overflow: hidden; background: #1a1a2e; margin-bottom: 1.5rem; border: 1px solid var(--border-light); text-align: center; position: relative; aspect-ratio: 16/9;">
      ${ex.videoUrl ? `
        <video style="width: 100%; height: 100%; object-fit: cover;" controls autoplay>
          <source src="${ex.videoUrl}" type="video/mp4">
          <img src="${exImage}" alt="${ex.name}">
        </video>
      ` : `
        <img src="${exImage}" alt="${ex.name}" style="max-width: 100%; max-height: 300px; object-fit: contain; display: block; margin: 0 auto; background: #1a1a2e;" onerror="this.src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80';">
      `}
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

// ─── GEMINI AI WORKOUT GENERATOR ─────────────────────────────────────────────

const AVAILABLE_EXERCISES = {
  supino_reto: "Supino Reto com Barra (Peito)",
  supino_inclinado_halter: "Supino Inclinado com Halteres (Peito)",
  crucifixo_maquina: "Crucifixo na Máquina - Peck Deck (Peito)",
  crucifixo_polia: "Crossover na Polia (Peito)",
  agachamento_barra: "Agachamento Livre com Barra (Pernas/Glúteos)",
  agachamento_hack: "Agachamento Hack Máquina (Pernas)",
  leg_press: "Leg Press 45° (Pernas/Glúteos)",
  cadeira_extensora: "Cadeira Extensora (Quadríceps)",
  mesa_flexora: "Mesa Flexora (Posterior de coxa)",
  stiff_barra: "Stiff com Barra (Posterior de coxa/Glúteos)",
  panturrilha_maquina: "Panturrilha Máquina (Panturrilha)",
  rosca_direta: "Rosca Direta com Halteres (Bíceps)",
  rosca_martelo: "Rosca Martelo com Halteres (Bíceps/Antebraço)",
  triceps_pulley: "Tríceps no Pulley com Corda (Tríceps)",
  triceps_testa: "Tríceps Testa com Barra EZ (Tríceps)",
  desenvolvimento_ombro: "Desenvolvimento de Ombros com Halteres (Ombros)",
  elevacao_lateral: "Elevação Lateral com Halteres (Ombros)",
  elevacao_frontal: "Elevação Frontal com Halteres (Ombros)",
  remada_alta: "Remada Alta na Polia (Ombros/Trapézio)",
  remada_curvada: "Remada Unilateral com Halter (Costas)",
  remada_baixa_triangulo: "Remada Baixa Sentado com Triângulo (Costas)",
  puxada_frente: "Puxada Frontal Pulldown (Costas/Latíssimo)",
  prancha_abdominal: "Prancha Abdominal (Core/Abdômen)",
  abdominal_infra: "Abdominal Infra no Banco (Core/Abdômen)",
  esteira: "Cardio - Corrida na Esteira (Cardio)",
  bicicleta_ergometrica: "Cardio - Bicicleta Ergométrica (Cardio)",
  agachamento_frontal: "Agachamento Frontal com Barra (Pernas)",
  agachamento_sumo: "Agachamento Sumô (Pernas/Glúteos)",
  agachamento_smith: "Agachamento no Smith (Pernas)",
  leg_press_horizontal: "Leg Press Horizontal (Pernas)",
  belt_squat: "Belt Squat (Agachamento com Cinturão) (Pernas)",
  afundo: "Afundo com Halteres (Pernas/Glúteos)",
  passada: "Passada Caminhando (Pernas/Glúteos)",
  agachamento_bulgaro: "Agachamento Búlgaro (Pernas/Glúteos)",
  step_up: "Step-up (Subida no Banco) (Pernas/Glúteos)",
  cadeira_flexora: "Cadeira Flexora (Pernas)",
  good_morning: "Good Morning com Barra (Pernas)",
  cadeira_abdutora: "Cadeira Abdutora (Pernas/Glúteos)",
  cadeira_adutora: "Cadeira Adutora (Pernas)",
  panturrilha_sentada: "Panturrilha Sentada (Panturrilha)",
  panturrilha_leg_press: "Panturrilha no Leg Press (Panturrilha)",
  rosca_alternada: "Rosca Alternada com Halteres (Bíceps)",
  rosca_scott: "Rosca Scott com Barra EZ (Bíceps)",
  rosca_concentrada: "Rosca Concentrada com Halter (Bíceps)",
  rosca_polia: "Rosca Direta na Polia (Bíceps)",
  rosca_inversa: "Rosca Inversa com Halteres (Bíceps/Antebraço)",
  rosca_21: "Rosca 21 com Barra EZ (Bíceps)",
  rosca_spider: "Rosca Spider (Bíceps)",
  rosca_inclinada: "Rosca Inclinada com Halteres (Bíceps)",
  triceps_barra: "Tríceps no Pulley com Barra (Tríceps)",
  triceps_frances: "Tríceps Francês com Halter (Tríceps)",
  triceps_coice: "Tríceps Coice com Halter (Tríceps)",
  supino_fechado: "Supino Fechado com Barra (Tríceps/Peito)",
  mergulho_paralelas: "Mergulho nas Paralelas (Tríceps/Peito)",
  triceps_unilateral_polia: "Tríceps Unilateral na Polia (Tríceps)",
  triceps_banco: "Tríceps no Banco (Tríceps)",
  extensao_acima_cabeca: "Extensão de Tríceps acima da Cabeça (Tríceps)",
  rosca_punho: "Rosca de Punho (Antebraço)",
  rosca_inversa_punho: "Rosca Inversa de Punho (Antebraço)",
  farmers_walk: "Farmer's Walk (Antebraço/Core)",
  hang_barra_fixa: "Hang na Barra Fixa (Antebraço/Costas)",
  supino_inclinado_barra: "Supino Inclinado com Barra (Peito)",
  supino_declinado: "Supino Declinado com Barra (Peito)",
  supino_halter: "Supino Reto com Halteres (Peito)",
  supino_smith: "Supino no Smith (Peito)",
  crucifixo_reto: "Crucifixo Reto com Halteres (Peito)",
  crucifixo_inclinado: "Crucifixo Inclinado com Halteres (Peito)",
  crucifixo_declinado: "Crucifixo Declinado com Halteres (Peito)",
  crossover_alto: "Crossover Alto na Polia (Peito)",
  crossover_medio: "Crossover Médio na Polia (Peito)",
  crossover_baixo: "Crossover Baixo na Polia (Peito)",
  flexao_braço: "Flexão de Braços (Peito)",
  pullover: "Pullover com Halter (Peito/Costas)",
  barra_fixa_pronada: "Barra Fixa Pronada (Costas)",
  barra_fixa_supinada: "Barra Fixa Supinada (Costas)",
  puxada_fechada: "Puxada Frontal Fechada (Costas)",
  pulldown_corda: "Pulldown na Polia com Corda (Costas)",
  remada_curvada_barra: "Remada Curvada com Barra (Costas)",
  remada_unilateral: "Remada Unilateral com Halter (Serrote) (Costas)",
  remada_cavalinho: "Remada Cavalinho (T-bar) (Costas)",
  remada_articulada_maquina: "Remada Articulada na Máquina (Costas)",
  remada_invertida: "Remada Invertida (Costas)",
  levantamento_terra: "Levantamento Terra com Barra (Costas/Pernas)",
  encolhimento_trapezio: "Encolhimento de Ombros (Costas/Trapézio)",
  face_pull: "Face Pull na Polia (Ombros/Costas)",
  extensao_lombar: "Extensão Lombar (Core/Abdômen)",
  hip_thrust: "Elevação Pélvica (Hip Thrust) (Glúteos)",
  glute_bridge: "Ponte de Glúteo (Glúteos)",
  coice_polia: "Glúteo Coice na Polia (Glúteos)",
  swing_kettlebell: "Swing com Kettlebell (Glúteos/Core)",
  flexao_inclinada: "Flexão Inclinada (Peito)",
  flexao_declinada: "Flexão Declinada (Peito)",
  flexao_diamante: "Flexão Diamante (Peito)",
  barra_fixa_neutra: "Barra Fixa Neutra (Costas)",
  puxada_articulada: "Puxada Articulada (Costas)",
  terra_romeno: "Levantamento Terra Romeno (Costas/Glúteos)",
  coice_maquina: "Glúteo Coice na Máquina (Glúteos)",
  frog_pump: "Frog Pump (Glúteos)",
  cable_pull_through: "Cable Pull-Through (Glúteos)",
  kickback_caneleira: "Glúteo Kickback com Caneleira (Glúteos)"
};

const buildGeminiPrompt = (name, sex, objective, level, days, time, emphasis, age, weight, height, bmi, historySummary = "") => {
  const exerciseList = Object.entries(AVAILABLE_EXERCISES)
    .map(([id, desc]) => `- ${id}: ${desc}`)
    .join("\n");

  const splitNames = days <= 2
    ? "treinoA e treinoB (somente 2 treinos)"
    : "treinoA, treinoB e treinoC (3 treinos no esquema A/B/C)";

  const isFemale = sex && sex.toLowerCase().includes("feminino");
  const bmiCategory = getBMICategory(bmi);
  
  // Age-specific guidance
  let ageSpecificGuidance = "";
  if (age < 25) {
    ageSpecificGuidance = `\nADAptações para JOVENS (<25 anos):
- Recuperação rápida: pode fazer volume maior
- Foco em técnica e aprendizagem motora
- Permite mais volume de treino
- Atenção: articulações ainda em desenvolvimento, cuidado com pesos muito pesados sem técnica`;
  } else if (age >= 25 && age < 40) {
    ageSpecificGuidance = `\nADAPTAÇÕES para ADULTOS (25-40 anos):
- Auge da performance atlética
- Pode combinar força, volume e intensidade
- Recuperação ainda ótima
- Aproveitar para ganhos significativos`;
  } else if (age >= 40) {
    ageSpecificGuidance = `\nADAPTAÇÕES para ADULTOS 40+ ANOS:
- Recuperação mais lenta: mais dias de descanso entre treinos
- Mobilidade é essencial: adicionar alongamento pré/pós treino
- Prevenção de lesão: técnica perfeita > peso pesado
- Treinos mais curtos mas eficientes (~45-50 min ideal)
- Evitar supino pesado todas as semanas
- Focar em amplitude de movimento completa`;
  }
  
  // Body composition guidance
  let bodyCompositionGuidance = "";
  if (bmiCategory === "Abaixo do peso") {
    bodyCompositionGuidance = `\nDados Físicos: IMC ${bmi} (${bmiCategory})
- Prioridade: GANHO DE PESO com foco em massa muscular
- Aumento calórico + treino de força (hipertrofia)
- Mais séries (4-5) por exercício
- Mais dias de treino se recuperação permitir
- Não priorize cardio intenso`;
  } else if (bmiCategory === "Peso normal") {
    bodyCompositionGuidance = `\nDados Físicos: IMC ${bmi} (${bmiCategory})
- Peso saudável: pode focar totalmente no objetivo
- Balancear força/hipertrofia com mobilidade
- 3 séries por exercício é ideal`;
  } else if (bmiCategory === "Sobrepeso") {
    bodyCompositionGuidance = `\nDados Físicos: IMC ${bmi} (${bmiCategory})
- Prioridade: Perda de gordura com preservação muscular
- Incluir cardio leve entre treinos (não interferir na recuperação)
- Manter força com pesos moderados
- Séries um pouco menores (2-3) para maior volume total
- Repouso mais curto entre séries (30-45s)`;
  } else {
    bodyCompositionGuidance = `\nDados Físicos: IMC ${bmi} (${bmiCategory})
- Prioridade: Emagrecimento com cuidado articular
- Treinos mais leves em intensidade, mais em volume
- Cardio fundamental mas não excessivo
- Começar com pesos menores para aprender técnica
- Focar em movimento correto acima de tudo`;
  }
  
  const sexSpecificGuidance = isFemale 
    ? `
ADAPTAÇÕES ESPECÍFICAS PARA MULHERES:
- PRIORIDADE 1: Glúteos (agachamento, leg press, stiff, rosca búlgara)
- PRIORIDADE 2: Pernas/Coxas (leg press, hack squat, extensora, flexora)
- PRIORIDADE 3: Costas e Postura (remadas, lat pulldown, puxada)
- PRIORIDADE 4: Abdomen e Core (prancha, abdominal máquina, cable crunch)
- REDUZIR: Foco em bíceps/tríceps - usar apenas complementares
- INTENSIDADE: Mais volume (3-4 séries) com reps moderadas (10-15) do que peso muito pesado
- SEGURANÇA: Priorizar exercícios com controle de movimento e boa forma biomecânica
- CARGA: Mais conservador que homens com mesmo nível (reduzir ~10-15% das cargas iniciais)
    `
    : `
ADAPTAÇÕES ESPECÍFICAS PARA HOMENS:
- PRIORIDADE 1: Peito, Costa e Ombros (supino, desenvolvimento, remadas, puxada)
- PRIORIDADE 2: Braços (rosca direta, rosca martelo, tríceps, cable crunch)
- PRIORIDADE 3: Pernas (agachamento, leg press, stiff)
- INTENSIDADE: Combinar força (6-8 reps) com volume (8-12 reps)
- OBJETIVO: Ganho de força e hipertrofia
- CARGA: Trabalhar com cargas mais desafiadoras para estimular ganho muscular
    `;

  return `Você é um personal trainer especialista em musculação. Crie uma ficha de treino personalizada completa em JSON para o seguinte aluno:

Nome: ${name}
Sexo: ${sex}
DADOS BIOMÉTRICOS:
- Idade: ${age} anos
- Peso: ${weight} kg
- Altura: ${height} cm
- IMC: ${bmi} (${bmiCategory})

Objetivo: ${objective}
Nível: ${level}
Dias de treino por semana: ${days}
Tempo disponível por sessão: ${time} minutos
${emphasis ? `Ênfase muscular desejada: ${emphasis}` : "Sem ênfase específica"}

IMPORTANTE: Use APENAS os IDs exatos da lista abaixo. Não invente exercícios novos.

EXERCÍCIOS DISPONÍVEIS:
${exerciseList}

${ageSpecificGuidance}
${bodyCompositionGuidance}
${sexSpecificGuidance}

${historySummary ? `INFORMAÇÕES DE HISTÓRICO DE TREINOS ANTERIORES:
O aluno já realizou treinos com as seguintes cargas máximas recentemente. Use essas cargas como referência de força para progredir a dificuldade:
${historySummary}
` : ''}

RETORNE APENAS um objeto JSON válido com exatamente esta estrutura (sem nenhum texto antes ou depois do JSON):
{
  "name": "Nome da ficha (inclua o nome do aluno)",
  "objective": "${objective}",
  "level": "${level}",
  "days": ${days},
  "time": ${time},
  "emphasis": "${emphasis || ""}",
  "aiGenerated": true,
  "aiRationale": "Breve explicação (1-2 frases) de por que você montou essa ficha assim considerando idade (${age}), peso (${weight}kg), altura (${height}cm) e objetivo",
  "treinoA": {
    "name": "Treino A - [grupos musculares]",
    "exercises": [
      { "id": "id_do_exercicio", "setsCount": 3, "reps": "8-12", "weight": 20 }
    ]
  },
  "treinoB": {
    "name": "Treino B - [grupos musculares]",
    "exercises": [
      { "id": "id_do_exercicio", "setsCount": 3, "reps": "10-15", "weight": 15 }
    ]
  },
  "treinoC": {
    "name": "Treino C - [grupos musculares]",
    "exercises": [
      { "id": "id_do_exercicio", "setsCount": 3, "reps": "8-12", "weight": 20 }
    ]
  }
}

Regras:
- Para cada treino, inclua entre 4 e 6 exercícios
- Distribua os grupos musculares seguindo as prioridades acima para ${sex}
- Sugira cargas iniciais (weight em kg) REALISTAS para nível ${level}, idade ${age}, peso ${weight}kg e categoria de peso ${bmiCategory}
- Para cardio (esteira, bicicleta), use setsCount: 1 e reps em formato texto como "20 minutos"
- Para prancha/abdominal, use reps em texto como "40 segundos"
- Se days <= 2, retorne apenas treinoA e treinoB (deixe treinoC igual ao treinoB)
- Adapte a intensidade ao tempo disponível por sessão (${time} minutos)
- MUITO IMPORTANTE: Considere a idade e recuperação (quanto mais velho, menos volume)
- MUITO IMPORTANTE: Adapt cargas de acordo com IMC (sobrepeso = começar mais leve, abaixo do peso = pode focar em força)`;
};

const showAILoadingOverlay = () => {
  let overlay = document.getElementById("ai-loading-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "ai-loading-overlay";
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(18, 18, 28, 0.92); backdrop-filter: blur(12px);
      z-index: 9999; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 1.5rem;
    `;
    overlay.innerHTML = `
      <div style="position: relative; width: 80px; height: 80px;">
        <div style="
          width: 80px; height: 80px; border-radius: 50%;
          border: 3px solid rgba(255, 107, 0, 0.2);
          border-top-color: #FF6B00;
          animation: ai-spin 0.9s linear infinite;
        "></div>
        <span class="material-symbols-outlined" style="
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          font-size: 2rem; color: #FF6B00;
          animation: ai-pulse 1.5s ease-in-out infinite;
        ">smart_toy</span>
      </div>
      <div style="text-align: center; max-width: 320px;">
        <h3 style="font-size: 1.3rem; font-weight: 800; color: white; margin-bottom: 0.5rem;">
          IA Gerando sua Ficha...
        </h3>
        <p id="ai-loading-status" style="font-size: 0.9rem; color: rgba(255,255,255,0.6); line-height: 1.5;">
          Analisando seu perfil e montando o treino ideal com Gemini AI
        </p>
      </div>
      <style>
        @keyframes ai-spin { to { transform: rotate(360deg); } }
        @keyframes ai-pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
      </style>
    `;
    document.body.appendChild(overlay);
  } else {
    overlay.style.display = "flex";
  }
};

const hideAILoadingOverlay = () => {
  const overlay = document.getElementById("ai-loading-overlay");
  if (overlay) overlay.style.display = "none";
};

const updateAILoadingStatus = (msg) => {
  const el = document.getElementById("ai-loading-status");
  if (el) el.textContent = msg;
};

const generateIntelligentWorkout = async () => {
  // Prevenir requisições duplicadas
  if (isGeneratingWorkout) {
    alert("⏳ Já está gerando uma ficha. Aguarde...");
    return;
  }

  const nameInput = document.getElementById("user-name-input").value.trim();
  const name = sanitizeInput(nameInput) || "Atleta treinox.ai";
  const sex = document.getElementById("form-sex").value || "Masculino";
  const objective = document.getElementById("form-objetivo")?.value || "Hipertrofia";
  const level = document.getElementById("form-nivel")?.value || "Intermediário";
  const days = parseInt(document.getElementById("form-frequencia")?.value) || 3;
  const time = parseInt(document.getElementById("form-time")?.value) || 60;
  const emphasis = sanitizeInput(document.getElementById("form-emphasis")?.value.trim());
  const validityWeeks = parseInt(document.getElementById("form-validity")?.value) || 4;
  
  // Capture user biometric data
  const age = parseInt(document.getElementById("form-age").value) || 30;
  const weight = parseFloat(document.getElementById("form-weight").value) || 80;
  const height = parseInt(document.getElementById("form-height").value) || 180;
  
  // Validate biometric data
  if (age < 15 || age > 100 || weight < 30 || weight > 250 || height < 130 || height > 220) {
    alert("⚠️ Verifique seus dados biométricos (idade, peso, altura).");
    return;
  }
  
  // Save to user profile in state
  const bmi = calculateBMI(weight, height);
  state.userProfile = { age, weight, height, bmi };
  saveStateToStorage();

  // Validar inputs obrigatórios
  if (!objective || !level) {
    alert("⚠️ Por favor, selecione Objetivo e Nível.");
    return;
  }

  isGeneratingWorkout = true;
  
  // Try AI generation first
  showAILoadingOverlay();

  try {
    updateAILoadingStatus("Conectando ao Gemini AI e analisando seu perfil...");
    const prompt = buildGeminiPrompt(name, sex, objective, level, days, time, emphasis, age, weight, height, bmi);

    const response = await fetch("/api/generate-workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      timeout: 35000 // 35 segundos
    });

    if (!response.ok) {
      let details = "";
      try {
        const errJson = await response.json();
        if (errJson.raw?.error?.message) {
          details = errJson.raw.error.message;
        } else {
          details = errJson.error || JSON.stringify(errJson);
        }
      } catch (e) {
        details = "Erro desconhecido";
      }
      throw new Error(`Servidor respondeu com status ${response.status} - ${details}`);
    }

    const responseData = await response.json();
    if (responseData.error) throw new Error(responseData.error);

    updateAILoadingStatus("Validando e aplicando a ficha gerada pela IA...");

    // Parse the JSON returned by Gemini
    let aiData;
    try {
      if (responseData.workout && !responseData.workout.rawContent) {
        aiData = responseData.workout;
      } else {
        const text = responseData.text || (responseData.workout && responseData.workout.rawContent) || "";
        // Gemini sometimes wraps in ```json ... ``` blocks, strip those
        const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
        aiData = JSON.parse(cleaned);
      }
    } catch (parseErr) {
      throw new Error("A IA retornou uma resposta em formato inválido. Tentando geração local...");
    }

    // Validate that all exercise IDs exist in our DB
    const validIds = Object.keys(EXERCISES_DB);
    const sanitizeExercises = (exercises) => {
      if (!Array.isArray(exercises)) return [];
      return exercises.filter(ex => {
        if (!validIds.includes(ex.id)) {
          console.warn(`[AI] Exercício desconhecido ignorado: ${ex.id}`);
          return false;
        }
        return true;
      }).map(ex => ({
        id: ex.id,
        setsCount: Math.max(1, parseInt(ex.setsCount) || 3),
        reps: String(ex.reps || "10-12"),
        weight: Math.max(0, parseFloat(ex.weight) || 0)
      }));
    };

    if (state.currentFicha) {
      state.previousFicha = JSON.parse(JSON.stringify(state.currentFicha));
    }

    const newFicha = {
      id: "ficha_ai_" + Date.now(),
      name: aiData.name || `Ficha IA ${objective} (${name})`,
      objective,
      level,
      days,
      time,
      sex,
      emphasis: emphasis || null,
      aiGenerated: true,
      aiRationale: aiData.aiRationale || null,
      treinoA: {
        name: aiData.treinoA?.name || "Treino A",
        exercises: sanitizeExercises(aiData.treinoA?.exercises)
      },
      treinoB: {
        name: aiData.treinoB?.name || "Treino B",
        exercises: sanitizeExercises(aiData.treinoB?.exercises)
      },
      treinoC: {
        name: aiData.treinoC?.name || "Treino C",
        exercises: sanitizeExercises(aiData.treinoC?.exercises || aiData.treinoB?.exercises)
      },
      createdAt: Date.now(),
      validityWeeks,
      expiresAt: Date.now() + validityWeeks * 7 * 24 * 60 * 60 * 1000
    };

    // Ensure treinos have at least some exercises (fallback per-treino if AI messed up)
    ["treinoA", "treinoB", "treinoC"].forEach(key => {
      if (!newFicha[key] || newFicha[key].exercises.length === 0) {
        console.warn(`[AI] ${key} ficou sem exercícios válidos, usando fallback heurístico`);
        newFicha[key] = generateHeuristicFicha(objective, level, name)[key];
      }
    });

    state.currentFicha = newFicha;
    state.currentSplit = "A";
    state.expirationAlertDismissed = false;
    saveStateToStorage();

    state.history.push({
      date: Date.now(),
      fichaName: newFicha.name,
      split: "N/A",
      duration: 0,
      maxWeight: 0,
      logs: []
    });
    saveStateToStorage();

    hideAILoadingOverlay();
    playAlertSound("double-beep");

    // Show AI rationale if available
    const rationaleMsg = newFicha.aiRationale
      ? `\n\n💡 IA explica: ${newFicha.aiRationale}`
      : "";
    alert(`🤖 Ficha "${newFicha.name}" gerada com sucesso pela IA Gemini!${rationaleMsg}`);
    navigateTo("dashboard");

  } catch (aiError) {
    console.error("[AI] Erro na geração com Gemini:", aiError.message);
    hideAILoadingOverlay();

    // Fallback to heuristic
    console.log("[AI] Usando gerador heurístico como fallback...");
    generateHeuristicWorkout({
      name, sex, objective, level, days, time, emphasis,
      validityWeeks,
      fallbackReason: aiError.message
    });
  } finally {
    isGeneratingWorkout = false;
  }
};

window.handleGenerateWorkout = generateIntelligentWorkout;

// ─── HEURISTIC GENERATOR (kept as fallback) ───────────────────────────────────

const generateHeuristicFicha = (objective, level, name = "Atleta") => {
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

  return plans[objective] || plans["Hipertrofia"];
};

const generateHeuristicWorkout = ({ name, sex, objective, level, days, time, emphasis, validityWeeks, fallbackReason }) => {
  if (state.currentFicha) {
    state.previousFicha = JSON.parse(JSON.stringify(state.currentFicha));
  }

  const selectedType = generateHeuristicFicha(objective, level, name);

  const newFicha = JSON.parse(JSON.stringify(selectedType));
  newFicha.id = "ficha_" + Date.now();
  newFicha.objective = objective;
  newFicha.level = level;
  newFicha.days = days;
  newFicha.time = time;
  newFicha.sex = sex || null;
  newFicha.emphasis = emphasis || null;
  newFicha.name = `${newFicha.name} - ${days}x na semana (${time} min)`;
  newFicha.createdAt = Date.now();
  newFicha.validityWeeks = validityWeeks;
  newFicha.expiresAt = Date.now() + validityWeeks * 7 * 24 * 60 * 60 * 1000;
  newFicha.aiGenerated = false;

  const prevIds = getPreviousExerciseIds();
  ["treinoA", "treinoB", "treinoC"].forEach(tKey => {
    if (newFicha[tKey] && newFicha[tKey].exercises) {
      newFicha[tKey].exercises = newFicha[tKey].exercises.map(ex => ({
        ...ex,
        id: getAlternativeExercise(ex.id, prevIds)
      }));
    }
  });

  state.currentFicha = newFicha;
  state.currentSplit = "A";
  state.expirationAlertDismissed = false;
  saveStateToStorage();

  state.history.push({
    date: Date.now(),
    fichaName: newFicha.name,
    split: "N/A",
    duration: 0,
    maxWeight: 0,
    logs: []
  });
  saveStateToStorage();

  playAlertSound("double-beep");

  const fallbackNote = fallbackReason
    ? `\n\n⚠️ A IA não estava disponível (${fallbackReason}). Ficha gerada pelo motor local.`
    : "";
  alert(`Ficha "${newFicha.name}" criada com sucesso!${fallbackNote}`);
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

  // Initialize Profile Page
  if (state.isLoggedIn) {
    updateUserUI();
    renderProfile();
  }

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

  // ─── OFFLINE/ONLINE MONITORING ────────────────────────────────────────────
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    const statusEl = document.body;
    
    if (!isOnline) {
      console.warn("⚠️ Sem conexão com a internet - modo offline ativado");
      statusEl.setAttribute("data-offline", "true");
    } else {
      console.log("✅ Conexão restaurada");
      statusEl.removeAttribute("data-offline");
    }
  };

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  
  // Check initial status
  updateOnlineStatus();



  // Local fallback workout generator
  window.generateLocalWorkout = (name, objective, level, days, equipamentos) => {
    const templates = {
      "Ganho Muscular": {
        "Iniciante": {
          name: `Ficha Ganho Muscular Iniciante (${name})`,
          treinoA: {
            name: "Treino A - Peito, Ombro e Tríceps",
            exercises: [
              { id: "supino_reto", setsCount: 3, reps: "10-12", weight: 10 },
              { id: "crucifixo_maquina", setsCount: 3, reps: "12-15", weight: 8 },
              { id: "desenvolvimento_ombro", setsCount: 3, reps: "10-12", weight: 6 },
              { id: "triceps_pulley", setsCount: 3, reps: "10-12", weight: 8 }
            ]
          },
          treinoB: {
            name: "Treino B - Costas e Bíceps",
            exercises: [
              { id: "puxada_frente", setsCount: 3, reps: "10-12", weight: 15 },
              { id: "remada_curvada", setsCount: 3, reps: "10-12", weight: 10 },
              { id: "rosca_direta", setsCount: 3, reps: "10-12", weight: 6 },
              { id: "prancha_abdominal", setsCount: 3, reps: "30 segundos", weight: 0 }
            ]
          },
          treinoC: {
            name: "Treino C - Pernas",
            exercises: [
              { id: "agachamento_barra", setsCount: 3, reps: "10-12", weight: 15 },
              { id: "leg_press", setsCount: 3, reps: "10-12", weight: 40 },
              { id: "cadeira_extensora", setsCount: 3, reps: "12-15", weight: 15 },
              { id: "mesa_flexora", setsCount: 3, reps: "10-12", weight: 12 }
            ]
          }
        },
        "Intermediário": {
          name: `Ficha Ganho Muscular Intermediário (${name})`,
          treinoA: {
            name: "Treino A - Peito, Ombro e Tríceps",
            exercises: [
              { id: "supino_reto", setsCount: 4, reps: "8-10", weight: 20 },
              { id: "crucifixo_maquina", setsCount: 3, reps: "10-12", weight: 15 },
              { id: "desenvolvimento_ombro", setsCount: 3, reps: "10-12", weight: 12 },
              { id: "elevacao_lateral", setsCount: 3, reps: "12-15", weight: 8 },
              { id: "triceps_pulley", setsCount: 3, reps: "10-12", weight: 15 }
            ]
          },
          treinoB: {
            name: "Treino B - Costas e Bíceps",
            exercises: [
              { id: "puxada_frente", setsCount: 4, reps: "8-10", weight: 30 },
              { id: "remada_curvada", setsCount: 3, reps: "10-12", weight: 18 },
              { id: "rosca_direta", setsCount: 3, reps: "10-12", weight: 10 },
              { id: "prancha_abdominal", setsCount: 3, reps: "45 segundos", weight: 0 }
            ]
          },
          treinoC: {
            name: "Treino C - Pernas",
            exercises: [
              { id: "agachamento_barra", setsCount: 4, reps: "8-10", weight: 30 },
              { id: "leg_press", setsCount: 3, reps: "10-12", weight: 60 },
              { id: "cadeira_extensora", setsCount: 3, reps: "12-15", weight: 25 },
              { id: "mesa_flexora", setsCount: 3, reps: "10-12", weight: 20 }
            ]
          }
        },
        "Avançado": {
          name: `Ficha Ganho Muscular Avançado (${name})`,
          treinoA: {
            name: "Treino A - Peito, Ombro e Tríceps",
            exercises: [
              { id: "supino_reto", setsCount: 4, reps: "6-8", weight: 30 },
              { id: "supino_inclinado_halter", setsCount: 3, reps: "8-10", weight: 22 },
              { id: "crucifixo_maquina", setsCount: 3, reps: "10-12", weight: 20 },
              { id: "desenvolvimento_ombro", setsCount: 4, reps: "6-8", weight: 18 },
              { id: "elevacao_lateral", setsCount: 3, reps: "10-12", weight: 12 },
              { id: "triceps_pulley", setsCount: 4, reps: "8-10", weight: 20 }
            ]
          },
          treinoB: {
            name: "Treino B - Costas e Bíceps",
            exercises: [
              { id: "puxada_frente", setsCount: 4, reps: "6-8", weight: 40 },
              { id: "remada_curvada", setsCount: 4, reps: "8-10", weight: 25 },
              { id: "remada_baixa_triangulo", setsCount: 3, reps: "8-10", weight: 35 },
              { id: "rosca_direta", setsCount: 3, reps: "8-10", weight: 14 },
              { id: "rosca_martelo", setsCount: 3, reps: "10-12", weight: 12 }
            ]
          },
          treinoC: {
            name: "Treino C - Pernas",
            exercises: [
              { id: "agachamento_barra", setsCount: 4, reps: "6-8", weight: 50 },
              { id: "leg_press", setsCount: 3, reps: "8-10", weight: 100 },
              { id: "cadeira_extensora", setsCount: 3, reps: "10-12", weight: 35 },
              { id: "mesa_flexora", setsCount: 3, reps: "8-10", weight: 30 },
              { id: "stiff_barra", setsCount: 3, reps: "8-10", weight: 25 }
            ]
          }
        }
      },
      "Perda de Gordura": {
        "Iniciante": {
          name: `Ficha Perda de Gordura Iniciante (${name})`,
          treinoA: {
            name: "Treino A - Full Body",
            exercises: [
              { id: "agachamento_barra", setsCount: 3, reps: "12-15", weight: 10 },
              { id: "supino_reto", setsCount: 3, reps: "12-15", weight: 8 },
              { id: "puxada_frente", setsCount: 3, reps: "12-15", weight: 12 },
              { id: "esteira", setsCount: 1, reps: "20 minutos", weight: 0 }
            ]
          },
          treinoB: {
            name: "Treino B - Full Body",
            exercises: [
              { id: "leg_press", setsCount: 3, reps: "12-15", weight: 30 },
              { id: "desenvolvimento_ombro", setsCount: 3, reps: "12-15", weight: 6 },
              { id: "remada_curvada", setsCount: 3, reps: "12-15", weight: 8 },
              { id: "bicicleta_ergometrica", setsCount: 1, reps: "20 minutos", weight: 0 }
            ]
          },
          treinoC: {
            name: "Treino C - Full Body",
            exercises: [
              { id: "prancha_abdominal", setsCount: 4, reps: "40 segundos", weight: 0 },
              { id: "abdominal_infra", setsCount: 3, reps: "12-15", weight: 0 },
              { id: "rosca_direta", setsCount: 3, reps: "12-15", weight: 5 },
              { id: "esteira", setsCount: 1, reps: "25 minutos", weight: 0 }
            ]
          }
        },
        "Intermediário": {
          name: `Ficha Perda de Gordura Intermediário (${name})`,
          treinoA: {
            name: "Treino A - Full Body",
            exercises: [
              { id: "agachamento_barra", setsCount: 3, reps: "12-15", weight: 20 },
              { id: "supino_reto", setsCount: 3, reps: "12-15", weight: 15 },
              { id: "puxada_frente", setsCount: 3, reps: "12-15", weight: 25 },
              { id: "esteira", setsCount: 1, reps: "30 minutos", weight: 0 }
            ]
          },
          treinoB: {
            name: "Treino B - Full Body",
            exercises: [
              { id: "leg_press", setsCount: 3, reps: "12-15", weight: 60 },
              { id: "desenvolvimento_ombro", setsCount: 3, reps: "12-15", weight: 12 },
              { id: "remada_curvada", setsCount: 3, reps: "12-15", weight: 16 },
              { id: "bicicleta_ergometrica", setsCount: 1, reps: "30 minutos", weight: 0 }
            ]
          },
          treinoC: {
            name: "Treino C - Core & Cardio",
            exercises: [
              { id: "prancha_abdominal", setsCount: 4, reps: "50 segundos", weight: 0 },
              { id: "abdominal_infra", setsCount: 3, reps: "15-20", weight: 0 },
              { id: "rosca_direta", setsCount: 3, reps: "12-15", weight: 10 },
              { id: "triceps_pulley", setsCount: 3, reps: "12-15", weight: 10 },
              { id: "esteira", setsCount: 1, reps: "35 minutos", weight: 0 }
            ]
          }
        },
        "Avançado": {
          name: `Ficha Perda de Gordura Avançado (${name})`,
          treinoA: {
            name: "Treino A - Full Body",
            exercises: [
              { id: "agachamento_barra", setsCount: 3, reps: "12-15", weight: 35 },
              { id: "supino_reto", setsCount: 3, reps: "12-15", weight: 25 },
              { id: "puxada_frente", setsCount: 3, reps: "12-15", weight: 40 },
              { id: "rosca_direta", setsCount: 2, reps: "12-15", weight: 12 },
              { id: "esteira", setsCount: 1, reps: "20 minutos", weight: 0 }
            ]
          },
          treinoB: {
            name: "Treino B - Full Body",
            exercises: [
              { id: "leg_press", setsCount: 3, reps: "12-15", weight: 100 },
              { id: "desenvolvimento_ombro", setsCount: 3, reps: "12-15", weight: 18 },
              { id: "remada_curvada", setsCount: 3, reps: "12-15", weight: 25 },
              { id: "triceps_pulley", setsCount: 2, reps: "12-15", weight: 18 },
              { id: "bicicleta_ergometrica", setsCount: 1, reps: "25 minutos", weight: 0 }
            ]
          },
          treinoC: {
            name: "Treino C - Core & Cardio",
            exercises: [
              { id: "prancha_abdominal", setsCount: 4, reps: "60 segundos", weight: 0 },
              { id: "abdominal_infra", setsCount: 3, reps: "20 reps", weight: 0 },
              { id: "elevation_lateral", setsCount: 3, reps: "12-15", weight: 10 },
              { id: "mesa_flexora", setsCount: 3, reps: "12-15", weight: 20 },
              { id: "esteira", setsCount: 1, reps: "40 minutos", weight: 0 }
            ]
          }
        }
      },
      "Força": {
        "Iniciante": {
          name: `Ficha Força Iniciante (${name})`,
          treinoA: {
            name: "Treino A - Força Peito e Costas",
            exercises: [
              { id: "supino_reto", setsCount: 4, reps: "6-8", weight: 12 },
              { id: "puxada_frente", setsCount: 4, reps: "6-8", weight: 18 },
              { id: "rosca_direta", setsCount: 3, reps: "6-8", weight: 7 }
            ]
          },
          treinoB: {
            name: "Treino B - Força Pernas",
            exercises: [
              { id: "agachamento_barra", setsCount: 4, reps: "6-8", weight: 18 },
              { id: "leg_press", setsCount: 3, reps: "8-10", weight: 50 }
            ]
          },
          treinoC: {
            name: "Treino C - Força Ombros",
            exercises: [
              { id: "desenvolvimento_ombro", setsCount: 4, reps: "6-8", weight: 8 },
              { id: "remada_alta", setsCount: 3, reps: "8-10", weight: 12 }
            ]
          }
        },
        "Intermediário": {
          name: `Ficha Força Intermediário (${name})`,
          treinoA: {
            name: "Treino A - Força Peito e Costas",
            exercises: [
              { id: "supino_reto", setsCount: 5, reps: "5-7", weight: 25 },
              { id: "puxada_frente", setsCount: 5, reps: "5-7", weight: 35 },
              { id: "rosca_direta", setsCount: 3, reps: "6-8", weight: 12 },
              { id: "triceps_pulley", setsCount: 3, reps: "6-8", weight: 16 }
            ]
          },
          treinoB: {
            name: "Treino B - Força Pernas",
            exercises: [
              { id: "agachamento_barra", setsCount: 5, reps: "5-7", weight: 35 },
              { id: "leg_press", setsCount: 4, reps: "6-8", weight: 90 },
              { id: "stiff_barra", setsCount: 3, reps: "6-8", weight: 20 }
            ]
          },
          treinoC: {
            name: "Treino C - Força Ombros",
            exercises: [
              { id: "desenvolvimento_ombro", setsCount: 4, reps: "6-8", weight: 16 },
              { id: "remada_alta", setsCount: 3, reps: "6-8", weight: 18 },
              { id: "elevacao_lateral", setsCount: 3, reps: "8-10", weight: 10 }
            ]
          }
        },
        "Avançado": {
          name: `Ficha Força Avançado (${name})`,
          treinoA: {
            name: "Treino A - Força Peito e Costas",
            exercises: [
              { id: "supino_reto", setsCount: 6, reps: "3-5", weight: 40 },
              { id: "supino_inclinado_halter", setsCount: 4, reps: "5-7", weight: 28 },
              { id: "puxada_frente", setsCount: 6, reps: "3-5", weight: 50 },
              { id: "remada_curvada", setsCount: 4, reps: "5-7", weight: 32 }
            ]
          },
          treinoB: {
            name: "Treino B - Força Pernas",
            exercises: [
              { id: "agachamento_barra", setsCount: 6, reps: "3-5", weight: 60 },
              { id: "leg_press", setsCount: 4, reps: "5-7", weight: 140 },
              { id: "stiff_barra", setsCount: 4, reps: "5-7", weight: 35 }
            ]
          },
          treinoC: {
            name: "Treino C - Força Ombros",
            exercises: [
              { id: "desenvolvimento_ombro", setsCount: 5, reps: "5-7", weight: 25 },
              { id: "remada_alta", setsCount: 4, reps: "5-7", weight: 28 },
              { id: "rosca_direta", setsCount: 3, reps: "5-7", weight: 18 },
              { id: "triceps_pulley", setsCount: 3, reps: "6-8", weight: 24 }
            ]
          }
        }
      },
      "Resistência": {
        "Iniciante": {
          name: `Ficha Resistência Iniciante (${name})`,
          treinoA: {
            name: "Treino A - Cardio Leve",
            exercises: [
              { id: "esteira", setsCount: 1, reps: "30 minutos", weight: 0 },
              { id: "prancha_abdominal", setsCount: 3, reps: "30 segundos", weight: 0 }
            ]
          },
          treinoB: {
            name: "Treino B - Cardio Moderado",
            exercises: [
              { id: "bicicleta_ergometrica", setsCount: 1, reps: "35 minutos", weight: 0 },
              { id: "abdominal_infra", setsCount: 3, reps: "10 reps", weight: 0 }
            ]
          },
          treinoC: {
            name: "Treino C - Cardio Intenso",
            exercises: [
              { id: "esteira", setsCount: 1, reps: "20 minutos", weight: 0 },
              { id: "bicicleta_ergometrica", setsCount: 1, reps: "20 minutos", weight: 0 }
            ]
          }
        },
        "Intermediário": {
          name: `Ficha Resistência Intermediário (${name})`,
          treinoA: {
            name: "Treino A - Força & Cardio",
            exercises: [
              { id: "agachamento_barra", setsCount: 3, reps: "12-15", weight: 20 },
              { id: "esteira", setsCount: 1, reps: "30 minutos", weight: 0 },
              { id: "prancha_abdominal", setsCount: 3, reps: "45 segundos", weight: 0 }
            ]
          },
          treinoB: {
            name: "Treino B - Força & Cardio",
            exercises: [
              { id: "supino_reto", setsCount: 3, reps: "12-15", weight: 15 },
              { id: "bicicleta_ergometrica", setsCount: 1, reps: "35 minutos", weight: 0 },
              { id: "abdominal_infra", setsCount: 3, reps: "15 reps", weight: 0 }
            ]
          },
          treinoC: {
            name: "Treino C - Cardio Intenso",
            exercises: [
              { id: "esteira", setsCount: 1, reps: "25 minutos", weight: 0 },
              { id: "bicicleta_ergometrica", setsCount: 1, reps: "25 minutos", weight: 0 },
              { id: "prancha_abdominal", setsCount: 4, reps: "50 segundos", weight: 0 }
            ]
          }
        },
        "Avançado": {
          name: `Ficha Resistência Avançado (${name})`,
          treinoA: {
            name: "Treino A - HIIT Intenso",
            exercises: [
              { id: "esteira", setsCount: 1, reps: "40 minutos (HIIT)", weight: 0 },
              { id: "prancha_abdominal", setsCount: 5, reps: "60 segundos", weight: 0 }
            ]
          },
          treinoB: {
            name: "Treino B - Força com Cardio",
            exercises: [
              { id: "agachamento_barra", setsCount: 4, reps: "10-12", weight: 35 },
              { id: "leg_press", setsCount: 3, reps: "10-12", weight: 90 },
              { id: "bicicleta_ergometrica", setsCount: 1, reps: "30 minutos", weight: 0 }
            ]
          },
          treinoC: {
            name: "Treino C - Endurance",
            exercises: [
              { id: "esteira", setsCount: 1, reps: "50 minutos", weight: 0 },
              { id: "abdominal_infra", setsCount: 4, reps: "20 reps", weight: 0 }
            ]
          }
        }
      }
    };

    const config = templates[objective]?.[level];
    if (!config) {
      // Fallback to hipertrofia intermediária
      return templates["Ganho Muscular"]["Intermediário"];
    }

    return {
      id: `ficha_local_${Date.now()}`,
      ...config,
      objective,
      level,
      days,
      time: 60
    };
  };

  // Show AI loading overlay
  window.showAILoadingOverlay = () => {
    let overlay = document.getElementById("ai-loading-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "ai-loading-overlay";
      overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(18, 18, 28, 0.92); backdrop-filter: blur(12px);
        z-index: 9999; display: flex; flex-direction: column;
        align-items: center; justify-content: center; gap: 2rem;
      `;
      overlay.innerHTML = `
        <div style="text-align: center;">
          <div style="
            width: 80px; height: 80px;
            border: 4px solid rgba(255,94,0,0.2);
            border-top: 4px solid #FF5E00;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 2rem;
          "></div>
          <h2 style="color: white; font-size: 1.5rem; margin-bottom: 0.5rem;">Gerando sua ficha...</h2>
          <p style="color: #94A3B8; font-size: 1rem;">Deixe a IA analisar seus dados (10-15s)</p>
          <style>
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    overlay.style.display = "flex";
  };

  window.hideAILoadingOverlay = () => {
    const overlay = document.getElementById("ai-loading-overlay");
    if (overlay) overlay.style.display = "none";
  };
})();

// ─────────────────────────────────────────────────────────
// MOBILE PILL MENU & BOTTOM SHEET LOGIC
// ─────────────────────────────────────────────────────────
window.toggleMobileMenu = (forceState) => {
  console.log("[DEBUG] toggleMobileMenu called with forceState =", forceState);
  const backdrop = document.getElementById('bottomSheetBackdrop');
  const menu = document.getElementById('bottomSheetMenu');
  
  if (!backdrop || !menu) {
    console.warn("[DEBUG] backdrop or menu not found in DOM!", { backdrop, menu });
    return;
  }
  
  const isActive = backdrop.classList.contains('active');
  const newState = forceState !== undefined ? forceState : !isActive;
  
  console.log("[DEBUG] Current active state:", isActive, "-> New state:", newState);
  
  if (newState) {
    backdrop.classList.add('active');
    menu.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
  } else {
    backdrop.classList.remove('active');
    menu.classList.remove('active');
    document.body.style.overflow = '';
  }
};

(function() {
  let lastScrollY = window.scrollY || 0;
  
  window.resetMobileTaskbar = () => {
    const taskbars = document.querySelectorAll('nav[class*="fixed"][class*="bottom-0"], .mobile-nav');
    taskbars.forEach(bar => bar.classList.remove('hidden-taskbar'));
    lastScrollY = 0;
  };
  
  function handleScroll(currentScrollY) {
    if (window.innerWidth > 768) return;
    
    const taskbars = document.querySelectorAll('nav[class*="fixed"][class*="bottom-0"], .mobile-nav');
    if (taskbars.length === 0) return;
    
    // Se o treino estiver ativo, a barra de tarefas móvel já está oculta via display: none
    if (state.activeWorkout) return;
    
    // Sempre mostrar o menu quando estiver no topo da página
    if (currentScrollY <= 10) {
      taskbars.forEach(bar => bar.classList.remove('hidden-taskbar'));
      lastScrollY = currentScrollY;
      return;
    }
    
    if (Math.abs(currentScrollY - lastScrollY) < 10) return;
    
    // Oculta ao rolar para baixo (tela desce) e mostra ao rolar para cima (tela sobe)
    if (currentScrollY > lastScrollY) {
      taskbars.forEach(bar => bar.classList.add('hidden-taskbar'));
    } else {
      taskbars.forEach(bar => bar.classList.remove('hidden-taskbar'));
    }
    
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', () => {
    handleScroll(window.scrollY || 0);
  }, { passive: true });

  // Fallback / support for potential layouts scrolling main-content container
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.addEventListener('scroll', () => {
      handleScroll(mainContent.scrollTop || 0);
    }, { passive: true });
  }
})();

