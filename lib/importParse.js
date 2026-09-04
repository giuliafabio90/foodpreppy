// Logica di importazione ricette dal link: gira lato server (nella API
// route), niente DOM/window qui dentro. Approccio: la maggior parte dei
// siti di ricette pubblica i dati strutturati schema.org/Recipe in un
// <script type="application/ld+json">; li leggiamo da li. Se non c'e,
// l'import fallisce e l'utente aggiunge la ricetta a mano.
import { INGREDIENT_DB } from "./data";

export function extractRecipeFromHtml(html) {
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const candidates = [];
  let m;
  while ((m = scriptRegex.exec(html))) {
    try { candidates.push(JSON.parse(m[1].trim())); } catch { /* blocco JSON-LD malformato: ignoralo */ }
  }
  const flat = [];
  candidates.forEach((c) => {
    if (Array.isArray(c)) flat.push(...c);
    else if (c && Array.isArray(c["@graph"])) flat.push(...c["@graph"]);
    else if (c) flat.push(c);
  });
  const recipe = flat.find((n) => {
    const t = n && n["@type"];
    return t === "Recipe" || (Array.isArray(t) && t.includes("Recipe"));
  });
  if (!recipe) return null;

  let ingredients = recipe.recipeIngredient || recipe.ingredients || [];
  if (!Array.isArray(ingredients)) ingredients = [ingredients];
  ingredients = ingredients.filter((s) => typeof s === "string" && s.trim());
  if (!ingredients.length) return null;

  const name = typeof recipe.name === "string" ? recipe.name : "";
  return { name, ingredients, steps: extractStepsFromRecipe(recipe) };
}

// I passaggi (schema.org recipeInstructions) arrivano in forme diverse:
// stringa unica, array di stringhe, array di HowToStep {text}, o
// HowToSection con itemListElement annidato. Li appiattisce in righe.
function extractStepsFromRecipe(recipe) {
  let instr = recipe.recipeInstructions;
  if (!instr) return [];
  if (typeof instr === "string") return instr.split(/\r?\n+/).map((s) => s.trim()).filter(Boolean);
  if (!Array.isArray(instr)) instr = [instr];
  const steps = [];
  instr.forEach((item) => {
    if (typeof item === "string") { steps.push(item.trim()); return; }
    if (!item) return;
    if (item["@type"] === "HowToSection" && Array.isArray(item.itemListElement)) {
      item.itemListElement.forEach((sub) => { if (sub && sub.text) steps.push(String(sub.text).trim()); });
      return;
    }
    if (item.text) steps.push(String(item.text).trim());
  });
  return steps.filter(Boolean);
}

const SECTION_START = /^(ingredienti|ingredients)\b/i;
const SECTION_END = /^(preparazione|procedimento|istruzioni|instructions|directions|method|steps)\b/i;
const STEP_MARKER = /^\s*(step\s*)?\d+[.)]\s/i;
const BULLET = /^\s*[-*•▪◦]\s*/;

// Spezza il testo di un file in piu' blocchi, uno per ogni ricetta: ogni
// occorrenza di "Ingredienti"/"Ingredients" segna l'inizio di una nuova
// ricetta, risalendo alla riga del titolo appena sopra. Se c'e' una sola
// intestazione (o nessuna), il file contiene una ricetta sola.
export function splitRecipesFromText(raw) {
  const lines = raw.split(/\r?\n/);
  const starts = [];
  lines.forEach((l, i) => {
    if (SECTION_START.test(l.trim())) {
      let j = i - 1;
      while (j >= 0 && !lines[j].trim()) j--;
      const start = j >= 0 ? j : i;
      if (starts[starts.length - 1] !== start) starts.push(start);
    }
  });
  if (starts.length <= 1) return [raw];
  const blocks = [];
  for (let k = 0; k < starts.length; k++) {
    const from = starts[k];
    const to = k + 1 < starts.length ? starts[k + 1] : lines.length;
    blocks.push(lines.slice(from, to).join("\n"));
  }
  return blocks;
}

// Estrae nome + righe ingredienti da una ricetta incollata come testo
// libero (non un link). Cerca un'intestazione "Ingredienti"/"Ingredients"
// e prende le righe successive fino alla prossima sezione; se non la
// trova, tiene le righe brevi che non sembrano un passaggio numerato.
export function extractRecipeFromText(raw) {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (!lines.length) return null;

  let name = lines[0];
  let ingredientLines = [];
  const secStart = lines.findIndex((l) => SECTION_START.test(l));

  if (secStart !== -1) {
    if (secStart === 0 && lines[1]) name = lines[1];
    for (let i = secStart + 1; i < lines.length; i++) {
      if (SECTION_END.test(lines[i])) break;
      ingredientLines.push(lines[i]);
    }
  } else {
    for (let i = 1; i < lines.length; i++) {
      const l = lines[i];
      if (SECTION_END.test(l)) break;
      if (STEP_MARKER.test(l)) continue;
      if (l.length > 90) continue;
      ingredientLines.push(l);
    }
  }

  ingredientLines = ingredientLines.map((l) => l.replace(BULLET, "").trim()).filter(Boolean);
  if (!ingredientLines.length) return null;

  // stessa logica per i passaggi, cercando l'intestazione di preparazione
  let steps = [];
  const stepStart = lines.findIndex((l) => SECTION_END.test(l));
  if (stepStart !== -1) {
    for (let i = stepStart + 1; i < lines.length; i++) steps.push(lines[i]);
    steps = steps.map((l) => l.replace(BULLET, "").replace(STEP_MARKER, "").trim()).filter(Boolean);
  }

  return { name, ingredients: ingredientLines, steps };
}

const STOPWORDS = new Set([
  // italiano
  "di", "d", "del", "della", "dello", "dei", "degli", "delle", "la", "le", "lo", "il", "i", "un", "uno", "una",
  "e", "o", "al", "alla", "fresco", "fresca", "freschi", "fresche", "qb", "grattugiato", "grattugiata",
  "tritato", "tritata", "a", "cubetti", "pezzi", "tagliato", "tagliata", "circa", "grande", "piccolo", "media", "medio",
  // english
  "of", "the", "a", "an", "and", "or", "to", "taste", "fresh", "chopped", "diced", "minced", "sliced", "grated",
  "crushed", "large", "small", "medium", "for", "into", "cut", "thinly", "roughly", "finely", "optional",
]);

function normalize(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function toWords(s) {
  return normalize(s).replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w && !STOPWORDS.has(w));
}
// Stemming leggero: toglie una desinenza finale (plurali italiani in
// a/e/i/o, plurali inglesi in s) cosi "tuorli" combacia con "tuorlo" e
// "eggs" con "egg" senza dover elencare ogni forma a mano.
function stem(w) {
  if (w.length >= 5 && /[aeios]$/.test(w)) return w.slice(0, -1);
  return w;
}
function toStems(s) {
  return toWords(s).map(stem);
}

export function matchIngredient(name) {
  const target = toStems(name);
  if (!target.length) return null;
  let best = null, bestScore = 0;
  INGREDIENT_DB.forEach((ing) => {
    const names = [ing.name, ...(ing.aliases || [])];
    let score = 0;
    names.forEach((n) => {
      const cand = toStems(n);
      target.forEach((w) => { if (cand.includes(w)) score++; });
    });
    if (score > bestScore) { bestScore = score; best = ing; }
  });
  return bestScore > 0 ? best.id : null;
}

const UNIT_GRAMS = {
  // italiano
  g: 1, gr: 1, grammi: 1, grammo: 1,
  kg: 1000, chilo: 1000, chili: 1000,
  ml: 1, millilitri: 1, cl: 10,
  l: 1000, litro: 1000, litri: 1000,
  cucchiaio: 15, cucchiai: 15,
  cucchiaino: 5, cucchiaini: 5,
  pizzico: 1, pizzichi: 1,
  spicchio: 5, spicchi: 5,
  fetta: 30, fette: 30,
  foglia: 1, foglie: 1,
  rametto: 2, rametti: 2,
  // english
  gram: 1, grams: 1, kilogram: 1000, kilograms: 1000,
  cup: 240, cups: 240,
  tablespoon: 15, tablespoons: 15, tbsp: 15,
  teaspoon: 5, teaspoons: 5, tsp: 5,
  ounce: 28, ounces: 28, oz: 28,
  pound: 454, pounds: 454, lb: 454, lbs: 454,
  clove: 5, cloves: 5,
  slice: 30, slices: 30,
  pinch: 1, pinches: 1,
  can: 400, cans: 400,
  stalk: 40, stalks: 40,
  bunch: 30, bunches: 30,
};
const COUNT_GRAMS = {
  uovo: 55, uova: 55, tuorlo: 18, tuorli: 18, albume: 33, albumi: 33,
  egg: 55, eggs: 55,
  onion: 110, onions: 110, tomato: 120, tomatoes: 120, potato: 170, potatoes: 170,
  carrot: 60, carrots: 60, lemon: 60, lemons: 60, lime: 60, limes: 60,
  apple: 180, apples: 180, banana: 120, bananas: 120,
  pepper: 120, peppers: 120, zucchini: 200, zucchinis: 200, courgette: 200, courgettes: 200,
  scallion: 15, scallions: 15,
};
const WORD_NUMBERS = {
  un: 1, uno: 1, una: 1, due: 2, tre: 3, quattro: 4, cinque: 5, sei: 6, mezza: 0.5, mezzo: 0.5,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5,
};
const UNIT_ALT = Object.keys(UNIT_GRAMS).sort((a, b) => b.length - a.length).join("|");

// Stima peso in grammi + abbinamento al database da una riga di testo
// libero. Gestisce sia "300 g di pasta di semola" (quantita prima) sia
// "Spaghetti 320 g" / "Tuorli (di uova medie) 6" (quantita dopo, comune sui
// siti di ricette italiani) sia "Pepe nero q.b." (nessuna quantita fissa).
// E' un'euristica: l'utente la corregge nel popup di revisione.
export function parseIngredientLine(text) {
  const raw = text.trim();
  const noParens = raw.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  const lower = normalize(noParens);

  if (/q\.?\s?b\.?|quanto basta|to taste/i.test(lower)) {
    const name = lower.replace(/q\.?\s?b\.?|quanto basta|to taste/gi, "").replace(/^(di|of)\s+/, "").trim();
    return { grams: 0, ingredientId: matchIngredient(name || raw) };
  }

  // Quantita in coda: "spaghetti 320 g", "guanciale 150 g", "tuorli 6"
  let m = lower.match(new RegExp(`^(.*?)\\s+(\\d+(?:[.,]\\d+)?)\\s*(${UNIT_ALT})?\\s*$`, "i"));
  if (m) {
    const name = m[1].trim();
    const qty = parseFloat(m[2].replace(",", "."));
    const unit = m[3];
    // Senza unita ne un nome numerabile riconosciuto (es. "eggs"), non
    // indovinare i grammi da un numero nudo: meglio 0 (visibile, da
    // correggere a mano) che un valore piccolo e falsamente plausibile.
    const countKey = Object.keys(COUNT_GRAMS).find((u) => name.endsWith(u));
    const grams = unit ? qty * (UNIT_GRAMS[unit] || 1) : (countKey ? qty * COUNT_GRAMS[countKey] : 0);
    return { grams: Math.round(grams), ingredientId: matchIngredient(name || raw) };
  }

  // Quantita in testa: "300 g di pasta di semola", "2 uova"
  let qty = null;
  let rest = lower;
  m = lower.match(/^(\d+)\s*\/\s*(\d+)\s*/);
  if (m) {
    qty = parseInt(m[1], 10) / parseInt(m[2], 10);
    rest = lower.slice(m[0].length);
  } else {
    m = lower.match(/^(\d+([.,]\d+)?)\s*/);
    if (m) {
      qty = parseFloat(m[1].replace(",", "."));
      rest = lower.slice(m[0].length);
    } else {
      const wm = Object.keys(WORD_NUMBERS).find((w) => lower === w || lower.startsWith(w + " "));
      if (wm) { qty = WORD_NUMBERS[wm]; rest = lower.slice(wm.length); }
    }
  }
  rest = rest.trim();

  let grams = 0;
  const unitMatch = Object.keys(UNIT_GRAMS).find((u) => rest === u || rest.startsWith(u + " "));
  if (qty != null && unitMatch) {
    grams = qty * UNIT_GRAMS[unitMatch];
    rest = rest.slice(unitMatch.length).trim();
  } else {
    const countMatch = Object.keys(COUNT_GRAMS).find((u) => rest.startsWith(u));
    // Senza unita ne nome numerabile riconosciuto, resta 0 (vedi nota sopra
    // sul ramo "quantita in coda") invece di assumere che il numero sia gia
    // in grammi.
    if (qty != null && countMatch) grams = qty * COUNT_GRAMS[countMatch];
  }
  rest = rest.replace(/^(di|of)\s+|^d'/, "").trim();

  const ingredientId = matchIngredient(rest || raw);
  return { grams: Math.round(grams), ingredientId };
}
