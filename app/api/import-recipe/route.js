import { extractRecipeFromHtml, parseIngredientLine } from "../../../lib/importParse";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const url = (body && body.url ? String(body.url) : "").trim();
  if (!/^https?:\/\/.+/i.test(url)) {
    return Response.json({ error: "Incolla un link valido (che inizi con http:// o https://)." }, { status: 400 });
  }

  let html;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return Response.json({ error: `Non è possibile importare questa ricetta: il sito ha risposto con un errore (${res.status}).` }, { status: 502 });
    }
    html = await res.text();
  } catch {
    return Response.json({ error: "Non è possibile importare questa ricetta: il link non è raggiungibile. Controlla che sia corretto." }, { status: 502 });
  }

  const parsed = extractRecipeFromHtml(html);
  if (!parsed) {
    return Response.json(
      { error: "Non è possibile importare questa ricetta: questa pagina non pubblica i dati strutturati necessari (nome e lista ingredienti). Aggiungila manualmente qui sotto." },
      { status: 422 }
    );
  }

  const items = parsed.ingredients.map((text) => {
    const p = parseIngredientLine(text);
    return { text, grams: p.grams, ingredientId: p.ingredientId || "" };
  });

  return Response.json({ name: parsed.name, items });
}
