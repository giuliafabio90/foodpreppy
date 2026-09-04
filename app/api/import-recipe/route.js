import { extractRecipeFromHtml, extractRecipeFromText, parseIngredientLine } from "../../../lib/importParse";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const input = (body && body.input ? String(body.input) : "").trim();
  if (!input) {
    return Response.json({ error: "Incolla un link o il testo della ricetta." }, { status: 400 });
  }

  const isUrl = /^https?:\/\/\S+$/i.test(input);
  let parsed;
  let sourceUrl = null;

  if (isUrl) {
    sourceUrl = input;
    let html;
    try {
      const res = await fetch(input, {
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
        },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        const server = res.headers.get("server") || "";
        const cfMitigated = res.headers.get("cf-mitigated");
        const isBotBlock = (res.status === 403 || res.status === 503) && (cfMitigated || /cloudflare/i.test(server));
        const error = isBotBlock
          ? "Non è possibile importare questa ricetta: questo sito blocca le richieste automatiche con una verifica anti-bot (Cloudflare) che il server non riesce a superare. Incolla il testo della ricetta oppure aggiungila manualmente qui sotto."
          : `Non è possibile importare questa ricetta: il sito ha risposto con un errore (${res.status}).`;
        return Response.json({ error }, { status: 502 });
      }
      html = await res.text();
    } catch {
      return Response.json({ error: "Non è possibile importare questa ricetta: il link non è raggiungibile. Controlla che sia corretto." }, { status: 502 });
    }
    parsed = extractRecipeFromHtml(html);
    if (!parsed) {
      return Response.json(
        { error: "Non è possibile importare questa ricetta: questa pagina non pubblica i dati strutturati necessari (nome e lista ingredienti). Incolla il testo della ricetta oppure aggiungila manualmente qui sotto." },
        { status: 422 }
      );
    }
  } else {
    parsed = extractRecipeFromText(input);
    if (!parsed) {
      return Response.json(
        { error: "Non sono riuscito a trovare una lista ingredienti in questo testo. Prova a includere l'intestazione \"Ingredienti\" sopra l'elenco, oppure aggiungi la ricetta manualmente qui sotto." },
        { status: 422 }
      );
    }
  }

  const items = parsed.ingredients.map((text) => {
    const p = parseIngredientLine(text);
    return { text, grams: p.grams, ingredientId: p.ingredientId || "" };
  });

  return Response.json({ name: parsed.name, items, sourceUrl, steps: parsed.steps || [] });
}
