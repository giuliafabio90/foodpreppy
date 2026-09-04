// Costanti e logica pura del pianificatore: nessun accesso al DOM qui,
// cosi la stessa logica e testabile e riusabile dai componenti React.

export const DAYS = ["Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato", "Domenica"];
export const MEAL_TYPES = ["colazione", "pranzo", "cena", "spuntino"];
export const MEAL_LABELS = { colazione: "Colazione", pranzo: "Pranzo", cena: "Cena", spuntino: "Spuntino" };
export const MEAL_SHORT = { colazione: "Col", pranzo: "Pra", cena: "Cen", spuntino: "Spu" };
export const PALETTE_HUES = [8, 150, 28, 200, 95, 340, 45, 280, 190, 50, 320, 120, 33, 60, 250, 10];

export const DEFAULT_CATEGORIES = [
  { id: "carne-rossa", name: "Carne rossa", weeklyFrequency: 2, meals: ["pranzo", "cena"] },
  { id: "carne-bianca", name: "Carne bianca", weeklyFrequency: 3, meals: ["pranzo", "cena"] },
  { id: "pesce", name: "Pesce", weeklyFrequency: 3, meals: ["pranzo", "cena"] },
  { id: "frutti-mare", name: "Frutti di mare", weeklyFrequency: 1, meals: ["pranzo", "cena"] },
  { id: "legumi", name: "Legumi", weeklyFrequency: 3, meals: ["pranzo", "cena"] },
  { id: "pasta", name: "Pasta", weeklyFrequency: 4, meals: ["pranzo", "cena"] },
  { id: "riso", name: "Riso", weeklyFrequency: 2, meals: ["pranzo", "cena"] },
  { id: "altri-cereali", name: "Altri cereali (farro, orzo, quinoa, avena)", weeklyFrequency: 2, meals: ["colazione", "pranzo", "cena"] },
  { id: "uova", name: "Uova", weeklyFrequency: 3, meals: ["colazione", "pranzo", "cena"] },
  { id: "frutta-secca", name: "Frutta secca", weeklyFrequency: 7, meals: ["colazione", "spuntino"] },
  { id: "frutta", name: "Frutta", weeklyFrequency: 7, meals: ["colazione", "spuntino"] },
  { id: "verdura", name: "Verdura", weeklyFrequency: 14, meals: ["pranzo", "cena"] },
  { id: "latticini", name: "Latticini e formaggi", weeklyFrequency: 5, meals: ["colazione", "spuntino"] },
  { id: "tuberi", name: "Tuberi (patate, ecc.)", weeklyFrequency: 2, meals: ["pranzo", "cena"] },
  { id: "grassi", name: "Grassi e condimenti", weeklyFrequency: 0, meals: ["colazione", "pranzo", "cena", "spuntino"] },
  { id: "dolci", name: "Dolci e snack", weeklyFrequency: 0, meals: ["spuntino"] },
];

export const DEFAULT_MACRO_RANGES = {
  colazione: { p: [15, 25], c: [45, 60], f: [20, 30] },
  pranzo: { p: [25, 35], c: [35, 50], f: [20, 30] },
  cena: { p: [30, 40], c: [25, 40], f: [20, 30] },
  spuntino: { p: [15, 30], c: [30, 50], f: [20, 40] },
};

export const DEFAULT_SETTINGS = {
  dailyCalories: 2000,
  mealSplit: { colazione: 20, pranzo: 35, cena: 35, spuntino: 10 },
  spuntiniPerDay: 1,
  freeMealsTarget: 2,
  freeSlots: ["Sabato|cena|0", "Domenica|pranzo|0"],
  skippedSlots: [],
  macroRanges: DEFAULT_MACRO_RANGES,
};

// Database nutrizionale integrato (valori medi per 100 g, fonti tipo CREA/INRAN).
// L'app non puo leggere il contenuto della pagina esterna incollata come link
// (limite di sicurezza del browser): il link resta un riferimento cliccabile,
// le calorie/macro si calcolano sempre da qui.
export const INGREDIENT_DB = [
  { id: "manzo-magro", name: "Manzo magro (fesa)", categoryId: "carne-rossa", kcal100: 106, protein100: 21.8, carbs100: 0, fat100: 2.1 },
  { id: "vitello", name: "Vitello (fesa)", categoryId: "carne-rossa", kcal100: 107, protein100: 21.3, carbs100: 0, fat100: 2.2 },
  { id: "maiale-lonza", name: "Maiale (lonza)", categoryId: "carne-rossa", kcal100: 121, protein100: 21.3, carbs100: 0, fat100: 3.8 },
  { id: "macinato-manzo", name: "Manzo macinato magro", categoryId: "carne-rossa", kcal100: 137, protein100: 20.0, carbs100: 0, fat100: 6.0 },
  { id: "pollo-petto", name: "Pollo (petto)", categoryId: "carne-bianca", kcal100: 100, protein100: 23.0, carbs100: 0, fat100: 1.0 },
  { id: "pollo-coscia", name: "Pollo (coscia, senza pelle)", categoryId: "carne-bianca", kcal100: 119, protein100: 20.0, carbs100: 0, fat100: 4.0 },
  { id: "tacchino-petto", name: "Tacchino (petto)", categoryId: "carne-bianca", kcal100: 98, protein100: 22.5, carbs100: 0, fat100: 0.7 },
  { id: "coniglio", name: "Coniglio", categoryId: "carne-bianca", kcal100: 118, protein100: 21.0, carbs100: 0, fat100: 3.5 },
  { id: "merluzzo", name: "Merluzzo / nasello", categoryId: "pesce", kcal100: 82, protein100: 17.8, carbs100: 0, fat100: 0.7 },
  { id: "salmone", name: "Salmone", categoryId: "pesce", kcal100: 208, protein100: 20.0, carbs100: 0, fat100: 13.6 },
  { id: "tonno-fresco", name: "Tonno fresco", categoryId: "pesce", kcal100: 144, protein100: 23.5, carbs100: 0, fat100: 4.9 },
  { id: "orata", name: "Orata / branzino", categoryId: "pesce", kcal100: 100, protein100: 20.0, carbs100: 0, fat100: 2.0 },
  { id: "sgombro", name: "Sgombro", categoryId: "pesce", kcal100: 205, protein100: 19.0, carbs100: 0, fat100: 14.0 },
  { id: "gamberi", name: "Gamberi", categoryId: "frutti-mare", kcal100: 71, protein100: 13.6, carbs100: 1.5, fat100: 1.4 },
  { id: "cozze-vongole", name: "Cozze / vongole (polpa)", categoryId: "frutti-mare", kcal100: 84, protein100: 12.0, carbs100: 3.4, fat100: 2.0 },
  { id: "calamari", name: "Calamari", categoryId: "frutti-mare", kcal100: 68, protein100: 14.9, carbs100: 1.2, fat100: 0.9 },
  { id: "ceci", name: "Ceci (cotti)", categoryId: "legumi", kcal100: 139, protein100: 8.9, carbs100: 20.8, fat100: 2.6 },
  { id: "lenticchie", name: "Lenticchie (cotte)", categoryId: "legumi", kcal100: 116, protein100: 9.0, carbs100: 20.0, fat100: 0.5 },
  { id: "fagioli", name: "Fagioli borlotti (cotti)", categoryId: "legumi", kcal100: 91, protein100: 6.6, carbs100: 16.0, fat100: 0.5 },
  { id: "piselli", name: "Piselli (cotti)", categoryId: "legumi", kcal100: 80, protein100: 5.4, carbs100: 14.0, fat100: 0.4 },
  { id: "pasta-semola", name: "Pasta di semola (cruda)", categoryId: "pasta", kcal100: 353, protein100: 12.5, carbs100: 71.0, fat100: 1.5 },
  { id: "pasta-integrale", name: "Pasta integrale (cruda)", categoryId: "pasta", kcal100: 335, protein100: 13.0, carbs100: 66.2, fat100: 2.5 },
  { id: "riso", name: "Riso (crudo)", categoryId: "riso", kcal100: 332, protein100: 6.7, carbs100: 74.4, fat100: 0.6 },
  { id: "riso-integrale", name: "Riso integrale (crudo)", categoryId: "riso", kcal100: 337, protein100: 7.5, carbs100: 72.0, fat100: 2.8 },
  { id: "farro", name: "Farro (crudo)", categoryId: "altri-cereali", kcal100: 335, protein100: 15.1, carbs100: 67.1, fat100: 2.5 },
  { id: "orzo", name: "Orzo perlato (crudo)", categoryId: "altri-cereali", kcal100: 328, protein100: 10.4, carbs100: 69.0, fat100: 1.5 },
  { id: "quinoa", name: "Quinoa (cruda)", categoryId: "altri-cereali", kcal100: 368, protein100: 14.1, carbs100: 64.2, fat100: 6.1 },
  { id: "avena", name: "Avena (fiocchi)", categoryId: "altri-cereali", kcal100: 375, protein100: 13.0, carbs100: 62.0, fat100: 7.0 },
  { id: "uovo", name: "Uovo di gallina (intero)", categoryId: "uova", kcal100: 128, protein100: 12.4, carbs100: 0.7, fat100: 8.7 },
  { id: "mandorle", name: "Mandorle", categoryId: "frutta-secca", kcal100: 603, protein100: 22.0, carbs100: 4.6, fat100: 54.0 },
  { id: "noci", name: "Noci", categoryId: "frutta-secca", kcal100: 689, protein100: 14.3, carbs100: 4.4, fat100: 68.1 },
  { id: "nocciole", name: "Nocciole", categoryId: "frutta-secca", kcal100: 655, protein100: 13.8, carbs100: 4.7, fat100: 64.1 },
  { id: "mela", name: "Mela", categoryId: "frutta", kcal100: 52, protein100: 0.3, carbs100: 13.8, fat100: 0.2 },
  { id: "banana", name: "Banana", categoryId: "frutta", kcal100: 89, protein100: 1.1, carbs100: 22.8, fat100: 0.3 },
  { id: "arancia", name: "Arancia", categoryId: "frutta", kcal100: 47, protein100: 0.9, carbs100: 11.8, fat100: 0.1 },
  { id: "kiwi", name: "Kiwi", categoryId: "frutta", kcal100: 61, protein100: 1.1, carbs100: 14.7, fat100: 0.5 },
  { id: "fragole", name: "Fragole", categoryId: "frutta", kcal100: 32, protein100: 0.7, carbs100: 7.7, fat100: 0.3 },
  { id: "zucchine", name: "Zucchine", categoryId: "verdura", kcal100: 17, protein100: 1.2, carbs100: 2.4, fat100: 0.3 },
  { id: "spinaci", name: "Spinaci", categoryId: "verdura", kcal100: 23, protein100: 2.9, carbs100: 3.6, fat100: 0.4 },
  { id: "broccoli", name: "Broccoli", categoryId: "verdura", kcal100: 34, protein100: 2.8, carbs100: 4.0, fat100: 0.4 },
  { id: "pomodoro", name: "Pomodoro", categoryId: "verdura", kcal100: 19, protein100: 0.9, carbs100: 3.5, fat100: 0.2 },
  { id: "carote", name: "Carote", categoryId: "verdura", kcal100: 41, protein100: 0.9, carbs100: 9.6, fat100: 0.2 },
  { id: "insalata", name: "Insalata / lattuga", categoryId: "verdura", kcal100: 15, protein100: 1.4, carbs100: 2.2, fat100: 0.2 },
  { id: "peperoni", name: "Peperoni", categoryId: "verdura", kcal100: 20, protein100: 1.0, carbs100: 4.2, fat100: 0.2 },
  { id: "melanzane", name: "Melanzane", categoryId: "verdura", kcal100: 25, protein100: 1.0, carbs100: 5.7, fat100: 0.2 },
  { id: "yogurt-greco", name: "Yogurt greco intero", categoryId: "latticini", kcal100: 97, protein100: 9.0, carbs100: 3.6, fat100: 5.0 },
  { id: "yogurt-magro", name: "Yogurt bianco magro", categoryId: "latticini", kcal100: 46, protein100: 4.5, carbs100: 5.6, fat100: 0.4 },
  { id: "latte-ps", name: "Latte parzialmente scremato", categoryId: "latticini", kcal100: 46, protein100: 3.3, carbs100: 4.9, fat100: 1.6 },
  { id: "parmigiano", name: "Parmigiano reggiano", categoryId: "latticini", kcal100: 392, protein100: 33.0, carbs100: 0, fat100: 28.4 },
  { id: "mozzarella", name: "Mozzarella", categoryId: "latticini", kcal100: 253, protein100: 18.7, carbs100: 0.7, fat100: 19.5 },
  { id: "ricotta", name: "Ricotta vaccina", categoryId: "latticini", kcal100: 146, protein100: 8.8, carbs100: 3.5, fat100: 10.9 },
  { id: "patate", name: "Patate", categoryId: "tuberi", kcal100: 77, protein100: 2.0, carbs100: 17.6, fat100: 0.1 },
  { id: "olio-evo", name: "Olio extravergine d'oliva", categoryId: "grassi", kcal100: 899, protein100: 0, carbs100: 0, fat100: 99.9 },
  { id: "burro", name: "Burro", categoryId: "grassi", kcal100: 758, protein100: 0.6, carbs100: 0.1, fat100: 83.0 },
  { id: "zucchero", name: "Zucchero", categoryId: "dolci", kcal100: 392, protein100: 0, carbs100: 99.8, fat100: 0 },
  { id: "cioccolato-fondente", name: "Cioccolato fondente", categoryId: "dolci", kcal100: 546, protein100: 7.5, carbs100: 46.0, fat100: 34.0 },
  { id: "pane", name: "Pane comune", categoryId: "altro", kcal100: 275, protein100: 8.0, carbs100: 55.0, fat100: 1.0 },
  { id: "farina", name: "Farina 00", categoryId: "altro", kcal100: 340, protein100: 11.0, carbs100: 74.0, fat100: 1.0 },
];

export const EXAMPLE_RECIPES = [
  {
    id: "ex-pasta", name: "Pasta al pomodoro e basilico (esempio)", link: "", categoryId: "pasta",
    meals: ["pranzo", "cena"], notes: "Esempio: sostituiscila con una tua ricetta",
    ingredients: [
      { ingredientId: "pasta-semola", grams: 90 },
      { ingredientId: "pomodoro", grams: 200 },
      { ingredientId: "olio-evo", grams: 10 },
      { ingredientId: "parmigiano", grams: 10 },
    ],
  },
  {
    id: "ex-pollo", name: "Petto di pollo con verdure (esempio)", link: "", categoryId: "carne-bianca",
    meals: ["pranzo", "cena"], notes: "Esempio",
    ingredients: [
      { ingredientId: "pollo-petto", grams: 180 },
      { ingredientId: "zucchine", grams: 150 },
      { ingredientId: "broccoli", grams: 150 },
      { ingredientId: "olio-evo", grams: 10 },
    ],
  },
  {
    id: "ex-yogurt", name: "Yogurt greco con frutta secca e mela (esempio)", link: "", categoryId: "latticini",
    meals: ["colazione", "spuntino"], notes: "Esempio",
    ingredients: [
      { ingredientId: "yogurt-greco", grams: 200 },
      { ingredientId: "mandorle", grams: 15 },
      { ingredientId: "mela", grams: 100 },
    ],
  },
];

export function ingredientById(id) {
  return INGREDIENT_DB.find((i) => i.id === id);
}

// Ingredienti raggruppati per categoria, nell'ordine del database, pronti
// per essere resi come <optgroup> da un componente React.
export function ingredientsGrouped(categories) {
  const groups = [];
  let current = null;
  INGREDIENT_DB.forEach((ing) => {
    if (!current || current.categoryId !== ing.categoryId) {
      const cat = categories.find((c) => c.id === ing.categoryId);
      current = { categoryId: ing.categoryId, label: cat ? cat.name : ing.categoryId === "altro" ? "Altro" : ing.categoryId, items: [] };
      groups.push(current);
    }
    current.items.push(ing);
  });
  return groups;
}

export function computeRecipeMacros(recipe) {
  let kcal = 0, protein = 0, carbs = 0, fat = 0;
  (recipe.ingredients || []).forEach((ing) => {
    const def = ingredientById(ing.ingredientId);
    if (!def) return;
    const f = (ing.grams || 0) / 100;
    kcal += def.kcal100 * f;
    protein += def.protein100 * f;
    carbs += def.carbs100 * f;
    fat += def.fat100 * f;
  });
  return { kcal, protein, carbs, fat };
}

export function macroPctOf(macros) {
  const kf = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
  if (kf <= 0) return { p: 0, c: 0, f: 0 };
  return { p: (macros.protein * 4) / kf * 100, c: (macros.carbs * 4) / kf * 100, f: (macros.fat * 9) / kf * 100 };
}

export function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
export function round1(n) { return Math.round(n * 10) / 10; }

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function allSlots(spuntiniPerDay) {
  const slots = [];
  DAYS.forEach((day) => {
    ["colazione", "pranzo", "cena"].forEach((mt) => slots.push({ day, mealType: mt, idx: 0, key: `${day}|${mt}|0` }));
    for (let i = 0; i < spuntiniPerDay; i++) slots.push({ day, mealType: "spuntino", idx: i, key: `${day}|spuntino|${i}` });
  });
  return slots;
}

export function computeEntry(settings, mt, catId, recipe) {
  const macros = computeRecipeMacros(recipe);
  const mealBudget = (settings.dailyCalories * (settings.mealSplit[mt] / 100)) / (mt === "spuntino" ? Math.max(1, settings.spuntiniPerDay) : 1);
  const scale = macros.kcal > 0 ? mealBudget / macros.kcal : 1;
  const kcal = Math.round(macros.kcal * scale);
  const protein = macros.protein * scale, carbs = macros.carbs * scale, fat = macros.fat * scale;
  const pct = macroPctOf(macros);
  const range = settings.macroRanges[mt];
  const inRange = pct.p >= range.p[0] && pct.p <= range.p[1] && pct.c >= range.c[0] && pct.c <= range.c[1] && pct.f >= range.f[0] && pct.f <= range.f[1];
  const scaledIngredients = (recipe.ingredients || []).map((ing) => {
    const def = ingredientById(ing.ingredientId);
    return { ingredientId: ing.ingredientId, name: def ? def.name : ing.ingredientId, grams: round1((ing.grams || 0) * scale) };
  });
  return {
    mealType: mt, free: false, categoryId: catId, recipeId: recipe.id, scale: round1(scale), kcal,
    protein: round1(protein), carbs: round1(carbs), fat: round1(fat),
    pPct: round1(pct.p), cPct: round1(pct.c), fPct: round1(pct.f), inRange,
    ingredients: scaledIngredients,
  };
}

function buildMealEntry(settings, recipes, day, mt, idx, freeSet, skipSet, assignMap, usedRecipeIds) {
  const key = `${day}|${mt}|${idx}`;
  if (skipSet.has(key)) return { mealType: mt, idx, skipped: true };
  if (freeSet.has(key)) return { mealType: mt, idx, free: true };
  const catId = assignMap.get(key);
  if (!catId) return { mealType: mt, idx, free: false, categoryId: null, unassigned: true };
  const pool = recipes.filter((r) => r.categoryId === catId && r.meals.includes(mt));
  if (pool.length === 0) return { mealType: mt, idx, free: false, categoryId: catId, noRecipe: true };
  const unused = pool.filter((r) => !usedRecipeIds.has(r.id));
  const choicePool = unused.length ? unused : pool;
  const recipe = choicePool[Math.floor(Math.random() * choicePool.length)];
  usedRecipeIds.add(recipe.id);
  return { idx, ...computeEntry(settings, mt, catId, recipe) };
}

export function generatePlan(settings, categories, recipes) {
  const slots = allSlots(settings.spuntiniPerDay);
  const freeSet = new Set(settings.freeSlots.filter((k) => slots.some((s) => s.key === k)));
  const skipSet = new Set((settings.skippedSlots || []).filter((k) => slots.some((s) => s.key === k)));
  const warnings = [];
  if (freeSet.size !== settings.freeMealsTarget) {
    warnings.push(`Hai selezionato ${freeSet.size} pasti liberi ma l'obiettivo e ${settings.freeMealsTarget}.`);
  }
  const available = shuffle(slots.filter((s) => !freeSet.has(s.key) && !skipSet.has(s.key)));
  let tokens = [];
  categories.filter((c) => c.weeklyFrequency > 0).forEach((c) => {
    for (let i = 0; i < c.weeklyFrequency; i++) tokens.push(c);
  });
  tokens = shuffle(tokens);
  const assignMap = new Map();
  const usedSlotKeys = new Set();
  const unallocated = [];
  tokens.forEach((cat) => {
    const candidates = available.filter((s) => !usedSlotKeys.has(s.key) && cat.meals.includes(s.mealType));
    if (candidates.length === 0) { unallocated.push(cat); return; }
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    assignMap.set(chosen.key, cat.id);
    usedSlotKeys.add(chosen.key);
  });
  const leftover = available.filter((s) => !usedSlotKeys.has(s.key));
  if (unallocated.length) {
    const names = {};
    unallocated.forEach((c) => { names[c.name] = (names[c.name] || 0) + 1; });
    const list = Object.keys(names).map((n) => `${n} x${names[n]}`).join(", ");
    warnings.push(`${unallocated.length} pasti richiesti non hanno trovato uno slot compatibile libero: ${list}.`);
  }
  if (leftover.length) {
    warnings.push(`${leftover.length} pasti sono rimasti senza categoria assegnata: aumenta le frequenze delle categorie compatibili o riduci i pasti liberi.`);
  }
  const usedRecipeIds = new Set();
  const days = DAYS.map((day) => {
    const meals = [];
    ["colazione", "pranzo", "cena"].forEach((mt) => meals.push(buildMealEntry(settings, recipes, day, mt, 0, freeSet, skipSet, assignMap, usedRecipeIds)));
    for (let i = 0; i < settings.spuntiniPerDay; i++) meals.push(buildMealEntry(settings, recipes, day, "spuntino", i, freeSet, skipSet, assignMap, usedRecipeIds));
    return { day, meals };
  });
  const noRecipeCats = {};
  days.forEach((d) => d.meals.forEach((m) => {
    if (m.noRecipe) {
      const c = categories.find((x) => x.id === m.categoryId);
      noRecipeCats[`${c ? c.name : m.categoryId} / ${MEAL_LABELS[m.mealType]}`] = 1;
    }
  }));
  const nrList = Object.keys(noRecipeCats);
  if (nrList.length) warnings.push(`Nessuna ricetta disponibile per: ${nrList.join(", ")}. Aggiungi ricette in quella categoria/pasto nella sezione Ricette.`);

  return { createdAt: new Date().toISOString(), days, warnings };
}

export function rerollMeal(settings, recipes, plan, day, mt, idx) {
  const dayObj = plan.days.find((d) => d.day === day);
  const entry = dayObj.meals.find((m) => m.mealType === mt && m.idx === idx);
  if (!entry || entry.free || !entry.categoryId) return plan;
  let pool = recipes.filter((r) => r.categoryId === entry.categoryId && r.meals.includes(mt) && r.id !== entry.recipeId);
  if (pool.length === 0) pool = recipes.filter((r) => r.categoryId === entry.categoryId && r.meals.includes(mt));
  if (pool.length === 0) return plan;
  const recipe = pool[Math.floor(Math.random() * pool.length)];
  const newEntry = { idx, ...computeEntry(settings, mt, entry.categoryId, recipe) };
  return {
    ...plan,
    days: plan.days.map((d) => d.day !== day ? d : {
      ...d,
      meals: d.meals.map((m) => (m.mealType === mt && m.idx === idx) ? newEntry : m),
    }),
  };
}

export function changeMealCategory(settings, recipes, plan, day, mt, idx, newCatId) {
  const pool = recipes.filter((r) => r.categoryId === newCatId && r.meals.includes(mt));
  let newEntry;
  if (pool.length === 0) newEntry = { mealType: mt, idx, free: false, categoryId: newCatId, noRecipe: true };
  else {
    const recipe = pool[Math.floor(Math.random() * pool.length)];
    newEntry = { idx, ...computeEntry(settings, mt, newCatId, recipe) };
  }
  return {
    ...plan,
    days: plan.days.map((d) => d.day !== day ? d : {
      ...d,
      meals: d.meals.map((m) => (m.mealType === mt && m.idx === idx) ? newEntry : m),
    }),
  };
}

export function hueColor(catHueMap, id, l) {
  const h = catHueMap[id] == null ? 0 : catHueMap[id];
  return `hsl(${h} 42% ${l || 42}%)`;
}

export function assignHues(categories) {
  const map = {};
  categories.forEach((c, i) => { map[c.id] = PALETTE_HUES[i % PALETTE_HUES.length]; });
  return map;
}
