import { extractRecipeFromText, splitRecipesFromText, parseIngredientLine } from "../../../lib/importParse";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const text = String(body?.text || "");
  if (!text.trim()) {
    return Response.json({ error: "Il file sembra vuoto." }, { status: 400 });
  }

  const blocks = splitRecipesFromText(text);
  const recipes = [];
  blocks.forEach((block) => {
    const parsed = extractRecipeFromText(block);
    if (!parsed) return;
    const items = parsed.ingredients.map((t) => {
      const p = parseIngredientLine(t);
      return { text: t, grams: p.grams, ingredientId: p.ingredientId || "" };
    });
    recipes.push({ name: parsed.name, items, steps: parsed.steps || [] });
  });

  if (!recipes.length) {
    return Response.json(
      { error: "Non ho trovato nessuna ricetta riconoscibile in questo file: ogni ricetta deve avere un'intestazione \"Ingredienti\" seguita dall'elenco." },
      { status: 422 }
    );
  }

  return Response.json({ recipes });
}
