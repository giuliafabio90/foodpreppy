"use client";
import { useRef, useState } from "react";
import { computeRecipeMacros, ingredientsGrouped, hueColor, round1 } from "../lib/data";
import ImportRecipeModal from "./ImportRecipeModal";
import RecipeDetailModal from "./RecipeDetailModal";
import RecipeSelectModal from "./RecipeSelectModal";

function toDraft(item) {
  return {
    name: item.name || "",
    link: item.sourceUrl || "",
    categoryId: "",
    meals: [],
    steps: item.steps || [],
    ingredients: (item.items || []).map((it) => ({ ingredientId: it.ingredientId || "", grams: it.grams || 0, sourceText: it.text, locked: false })),
  };
}

export default function RecipesView({ settings, categories, recipes, setRecipes, catHue }) {
  const groups = ingredientsGrouped(categories);
  const [importInput, setImportInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [draft, setDraft] = useState(null);
  const [queue, setQueue] = useState([]); // draft successivi in coda (import da file con piu' ricette)
  const [fileRecipes, setFileRecipes] = useState(null); // in attesa di selezione dopo il caricamento file
  const [openRecipeId, setOpenRecipeId] = useState(null);
  const fileInputRef = useRef(null);

  function startQueue(drafts) {
    setQueue(drafts.slice(1));
    setDraft(drafts[0] || null);
  }
  function advance() {
    setQueue((q) => {
      const [next, ...rest] = q;
      setDraft(next || null);
      return rest;
    });
  }

  function addRecipe() {
    const id = "r-" + Date.now();
    setRecipes((rs) => [...rs, { id, name: "Nuova ricetta", link: "", categoryId: categories[0] ? categories[0].id : "", meals: ["pranzo", "cena"], ingredients: [], steps: [] }]);
    setOpenRecipeId(id);
  }

  async function handleImport() {
    setImportError("");
    const input = importInput.trim();
    if (!input) return;
    setImporting(true);
    try {
      const res = await fetch("/api/import-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportError(data.error || "Importazione non riuscita.");
        return;
      }
      startQueue([toDraft(data)]);
      setImportInput("");
    } catch {
      setImportError("Errore di rete durante l'importazione.");
    } finally {
      setImporting(false);
    }
  }

  function handleFileButtonClick() {
    fileInputRef.current && fileInputRef.current.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setImportError("");
    setImporting(true);
    try {
      const text = await file.text();
      const res = await fetch("/api/import-recipe-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportError(data.error || "Importazione file non riuscita.");
        return;
      }
      if (data.recipes.length === 1) startQueue([toDraft(data.recipes[0])]);
      else setFileRecipes(data.recipes);
    } catch {
      setImportError("Errore durante la lettura del file. Assicurati che sia un file di testo (.txt).");
    } finally {
      setImporting(false);
    }
  }

  function handleFileSelectContinue(selected) {
    setFileRecipes(null);
    startQueue(selected.map(toDraft));
  }

  function handleConfirmImport(d) {
    const ingredients = d.ingredients
      .filter((ing) => ing.ingredientId)
      .map((ing) => ({ ingredientId: ing.ingredientId, grams: round1(ing.grams || 0), locked: !!ing.locked }));
    const id = "r-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    setRecipes((rs) => [...rs, { id, name: d.name.trim(), link: d.link, categoryId: d.categoryId, meals: d.meals, ingredients, steps: (d.steps || []).filter(Boolean) }]);
    advance();
  }

  const groupedByCat = categories
    .map((cat) => ({ cat, items: recipes.filter((r) => r.categoryId === cat.id) }))
    .filter((g) => g.items.length > 0);
  const orphanIds = new Set(categories.map((c) => c.id));
  const orphans = recipes.filter((r) => !orphanIds.has(r.categoryId));

  const openRecipe = recipes.find((r) => r.id === openRecipeId) || null;

  return (
    <div className="panel">
      <h3>Ricettario</h3>
      <div className="sub">
        Incolla il link di una ricetta, oppure il testo della ricetta copiato da qualsiasi fonte (nome + elenco
        ingredienti), e premi Importa: provo a leggere ingredienti e pesi, poi ti chiedo nome, categoria e pasto.
        Il link funziona sui siti che pubblicano i dati strutturati della ricetta; se un sito blocca le richieste
        automatiche o non ha questi dati, incolla direttamente il testo, carica un file di testo (anche con più
        ricette insieme), oppure aggiungila a mano con &quot;+ Nuova ricetta&quot; qui sotto.
      </div>

      <div className="import-bar">
        <textarea rows={3} placeholder={"Incolla qui il link della ricetta, oppure il testo (nome + ingredienti)…"}
          value={importInput} onChange={(e) => setImportInput(e.target.value)} />
        <button className="btn primary" onClick={handleImport} disabled={importing || !importInput.trim()}>
          {importing ? "Importazione…" : "Importa"}
        </button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input type="file" accept=".txt,.md,text/plain" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
        <button className="btn small ghost" onClick={handleFileButtonClick} disabled={importing}>Carica da file di testo…</button>
      </div>
      {importError && (
        <div className="warn-box"><h4>Import non riuscito</h4><ul><li>{importError}</li></ul></div>
      )}

      {recipes.length === 0 && <div className="empty-note">Nessuna ricetta ancora. Importane una dal link o aggiungine una qui sotto.</div>}

      {groupedByCat.map(({ cat, items }) => (
        <div className="recipe-group" key={cat.id}>
          <h4><span className="hue-dot" style={{ background: hueColor(catHue, cat.id, 45) }} />{cat.name}</h4>
          <div className="recipe-name-list">
            {items.map((r) => {
              const macros = computeRecipeMacros(r);
              return (
                <button key={r.id} onClick={() => setOpenRecipeId(r.id)}>
                  <span>{r.name}</span>
                  <span className="kcal-hint">{round1(macros.kcal)} kcal</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {orphans.length > 0 && (
        <div className="recipe-group">
          <h4>Senza categoria valida</h4>
          <div className="recipe-name-list">
            {orphans.map((r) => (
              <button key={r.id} onClick={() => setOpenRecipeId(r.id)}>
                <span>{r.name}</span><span className="kcal-hint">{round1(computeRecipeMacros(r).kcal)} kcal</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 4 }}><button className="btn small" onClick={addRecipe}>+ Nuova ricetta</button></div>

      {fileRecipes && (
        <RecipeSelectModal recipes={fileRecipes} onContinue={handleFileSelectContinue} onClose={() => setFileRecipes(null)} />
      )}
      {draft && (
        <ImportRecipeModal draft={draft} setDraft={setDraft} categories={categories} groups={groups} settings={settings}
          remainingCount={queue.length} onConfirm={handleConfirmImport} onClose={advance} />
      )}
      {openRecipe && (
        <RecipeDetailModal recipe={openRecipe} categories={categories} groups={groups} setRecipes={setRecipes}
          onClose={() => setOpenRecipeId(null)} />
      )}
    </div>
  );
}
