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
  return { name, ingredients };
}

const STOPWORDS = new Set([
  "di", "d", "del", "della", "dello", "dei", "degli", "delle", "la", "le", "lo", "il", "i", "un", "uno", "una",
  "e", "o", "al", "alla", "fresco", "fresca", "freschi", "fresche", "qb", "grattugiato", "grattugiata",
  "tritato", "tritata", "a", "cubetti", "pezzi", "tagliato", "tagliata", "circa", "grande", "piccolo", "media", "medio",
]);

function normalize(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function toWords(s) {
  return normalize(s).replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w && !STOPWORDS.has(w));
}

export function matchIngredient(name) {
  const target = toWords(name);
  if (!target.length) return null;
  let best = null, bestScore = 0;
  INGREDIENT_DB.forEach((ing) => {
    const cand = toWords(ing.name);
    let score = 0;
    target.forEach((w) => { if (cand.includes(w)) score++; });
    if (score > bestScore) { bestScore = score; best = ing; }
  });
  return bestScore > 0 ? best.id : null;
}

const UNIT_GRAMS = {
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
};
const COUNT_GRAMS = { uovo: 55, uova: 55, tuorlo: 18, tuorli: 18, albume: 33, albumi: 33 };
const WORD_NUMBERS = { un: 1, uno: 1, una: 1, due: 2, tre: 3, quattro: 4, cinque: 5, sei: 6, mezza: 0.5, mezzo: 0.5 };
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

  if (/q\.?\s?b\.?|quanto basta/i.test(lower)) {
    const name = lower.replace(/q\.?\s?b\.?|quanto basta/gi, "").replace(/^di\s+/, "").trim();
    return { grams: 0, ingredientId: matchIngredient(name || raw) };
  }

  // Quantita in coda: "spaghetti 320 g", "guanciale 150 g", "tuorli 6"
  let m = lower.match(new RegExp(`^(.*?)\\s+(\\d+(?:[.,]\\d+)?)\\s*(${UNIT_ALT})?\\s*$`, "i"));
  if (m) {
    const name = m[1].trim();
    const qty = parseFloat(m[2].replace(",", "."));
    const unit = m[3];
    const grams = unit ? qty * (UNIT_GRAMS[unit] || 1) : (Object.keys(COUNT_GRAMS).find((u) => name.endsWith(u)) ? qty * COUNT_GRAMS[Object.keys(COUNT_GRAMS).find((u) => name.endsWith(u))] : qty);
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
    if (qty != null && countMatch) grams = qty * COUNT_GRAMS[countMatch];
    else if (qty != null) grams = qty; // numero senza unita riconosciuta: assume grammi
  }
  rest = rest.replace(/^di\s+|^d'/, "").trim();

  const ingredientId = matchIngredient(rest || raw);
  return { grams: Math.round(grams), ingredientId };
}
