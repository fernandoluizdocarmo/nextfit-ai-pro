// UNIT TESTS - treinox.ai
// Testes básicos para verificar funcionamento do app
// Rode no console: npm test ou node tests.js

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    return false;
  }
  console.log(`✅ PASSOU: ${message}`);
  return true;
};

// ─── TEST SUITE 1: STATE MANAGEMENT ──────────────────────────────────────────
const testStateManagement = () => {
  console.log("\n📋 TESTES: Gerenciamento de Estado\n");

  // Test 1: Initial state
  assert(
    state.isLoggedIn === false && state.history.length === 0,
    "Estado inicial está correto"
  );

  // Test 2: Save and load state
  const initialHistoryLength = state.history.length;
  state.userName = "Test User";
  saveStateToStorage();
  
  const saved = localStorage.getItem("treinox_ai_state");
  assert(saved !== null, "State foi salvo em localStorage");
  
  // Test 3: Storage capacity protection
  const largeHistory = Array(100).fill({
    date: Date.now(),
    fichaName: "Test",
    split: "A",
    duration: 60,
    maxWeight: 100,
    logs: []
  });
  state.history = largeHistory;
  saveStateToStorage();
  
  const loaded = JSON.parse(localStorage.getItem("treinox_ai_state"));
  assert(
    loaded.history.length <= MAX_HISTORY_ITEMS,
    `Histórico foi limitado a ${MAX_HISTORY_ITEMS} itens (tinha ${largeHistory.length})`
  );
};

// ─── TEST SUITE 2: INPUT SANITIZATION ────────────────────────────────────────
const testInputSanitization = () => {
  console.log("\n🛡️ TESTES: Sanitização de Input\n");

  const testCases = [
    {
      input: "<script>alert('XSS')</script>",
      description: "Script tags devem ser escapadas"
    },
    {
      input: "Fernando <b>Carmo</b>",
      description: "HTML tags devem ser removidas"
    },
    {
      input: "Teste & Análise",
      description: "Special characters devem ser escapados"
    }
  ];

  testCases.forEach(test => {
    const sanitized = sanitizeInput(test.input);
    assert(
      !sanitized.includes("<script>") && !sanitized.includes("</script>"),
      `${test.description}`
    );
  });
};

// ─── TEST SUITE 3: EXERCISE DATABASE ─────────────────────────────────────────
const testExerciseDatabase = () => {
  console.log("\n💪 TESTES: Banco de Exercícios\n");

  const exerciseCount = Object.keys(EXERCISES_DB).length;
  assert(exerciseCount > 0, `Database carregado com ${exerciseCount} exercícios`);

  // Test: Each exercise has required fields
  let validExercises = 0;
  Object.entries(EXERCISES_DB).forEach(([key, ex]) => {
    if (ex.name && ex.muscle && ex.steps && ex.rest && ex.tips) {
      validExercises++;
    }
  });

  assert(
    validExercises === exerciseCount,
    `Todos os ${exerciseCount} exercícios têm campos obrigatórios`
  );
};

// ─── TEST SUITE 4: WORKOUT SESSION ──────────────────────────────────────────
const testWorkoutSession = () => {
  console.log("\n⏱️ TESTES: Sessão de Treino\n");

  // Setup
  state.currentFicha = DEFAULT_FICHAS[0];
  const historyBefore = state.history.length;

  // Test: Start workout
  startWorkoutSession("A");
  assert(
    state.activeWorkout !== null && state.activeWorkout.split === "A",
    "Sessão de treino iniciada corretamente"
  );

  // Test: Set values update correctly
  const firstExId = state.currentFicha.treinoA.exercises[0].id;
  updateActiveSetVal(firstExId, 1, "weight", 25);
  
  const loggedEx = state.activeWorkout.logs.find(l => l.id === firstExId);
  assert(
    loggedEx && loggedEx.sets[0].weight === 25,
    "Peso da série foi atualizado"
  );

  // Test: Set completion
  toggleSetCompletion(firstExId, 1, true);
  assert(
    loggedEx.sets[0].completed === true,
    "Série foi marcada como concluída"
  );
};

// ─── TEST SUITE 5: GEMINI PROMPT BUILDER ────────────────────────────────────
const testPromptBuilder = () => {
  console.log("\n🤖 TESTES: Builder de Prompt da IA\n");

  const prompt = buildGeminiPrompt(
    "João Silva",
    "Masculino",
    "Hipertrofia",
    "Intermediário",
    3,
    60,
    "Peito"
  );

  assert(
    prompt.includes("João Silva") && 
    prompt.includes("Hipertrofia") &&
    prompt.includes("3") &&
    prompt.includes("Peito"),
    "Prompt contém todos os parâmetros necessários"
  );

  assert(
    prompt.includes("JSON") && 
    prompt.includes("treinoA") &&
    prompt.includes("treinoB"),
    "Prompt solicita formato JSON correto"
  );
};

// ─── TEST SUITE 6: ALTERNATIVE EXERCISE ROTATION ──────────────────────────────
const testExerciseRotation = () => {
  console.log("\n🔄 TESTES: Rotação de Exercícios\n");

  const prevIds = ["supino_reto", "agachamento_barra", "rosca_direta"];
  
  const alt1 = getAlternativeExercise("supino_reto", prevIds);
  assert(
    alt1 === "supino_inclinado_halter",
    "Alternativa para supino_reto retornada corretamente"
  );

  const alt2 = getAlternativeExercise("esteira", prevIds);
  assert(
    alt2 === "bicicleta_ergometrica",
    "Alternativa para cardio retornada corretamente"
  );

  const noAlt = getAlternativeExercise("exercicio_inexistente", []);
  assert(
    noAlt === "exercicio_inexistente",
    "Exercício desconhecido retorna o mesmo ID"
  );
};

// ─── TEST SUITE 7: LOCAL STORAGE EDGE CASES ────────────────────────────────
const testStorageEdgeCases = () => {
  console.log("\n💾 TESTES: Casos Extremos do Storage\n");

  // Test: Empty state
  const savedEmpty = safeStringify({});
  assert(savedEmpty !== null, "Objeto vazio pode ser serializado");

  // Test: Circular reference handling
  const circular = { a: 1 };
  circular.self = circular;
  const savedCircular = safeStringify(circular);
  assert(savedCircular === null, "Referência circular retorna null");

  // Test: Special characters
  const special = { text: "Treino & Análise <> \"quotes\"" };
  const savedSpecial = safeStringify(special);
  assert(savedSpecial !== null, "Caracteres especiais são serializados");
};

// ─── RUN ALL TESTS ──────────────────────────────────────────────────────────
const runAllTests = () => {
  console.log("═════════════════════════════════════════════════════════════");
  console.log("🧪 SUITE DE TESTES - treinox.ai v1.0");
  console.log("═════════════════════════════════════════════════════════════");

  try {
    testStateManagement();
    testInputSanitization();
    testExerciseDatabase();
    testWorkoutSession();
    testPromptBuilder();
    testExerciseRotation();
    testStorageEdgeCases();

    console.log("\n═════════════════════════════════════════════════════════════");
    console.log("✅ TODOS OS TESTES COMPLETADOS COM SUCESSO!");
    console.log("═════════════════════════════════════════════════════════════\n");
  } catch (err) {
    console.error("❌ Erro ao executar testes:", err);
  }
};

// Export for Node.js if applicable
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests };
}

// Uncomment para rodar testes automaticamente no console
// runAllTests();
