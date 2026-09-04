"use client";
import { useState } from "react";
import { MEAL_TYPES, MEAL_LABELS, MEAL_SHORT, computeRecipeMacros, macroPctOf, ingredientsGrouped, round1 } from "../lib/data";
import ConfirmButton from "./ConfirmButton";
import IngredientTable from "./IngredientTable";
import ImportRecipeModal from "./ImportRecipeModal";

export default function RecipesView({ settings, categories, recipes, setRecipes }) {
  const groups = ingredientsGrouped(categories);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [draft, setDraft] = useState(null);

  function updateRecipe(id, patch) {
    setRecipes((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function toggleMeal(id, mt) {
    setRecipes((rs) => rs.map((r) => {
      if (r.id !== id) return r;
      const has = r.meals.includes(mt);
      return { ...r, meals: has ? r.meals.filter((m) => m !== mt) : [...r.meals, mt] };
    }));
  }
  function addRecipe() {
    const id = "r-" + Date.now();
    setRecipes((rs) => [...rs, { id, name: "Nuova ricetta", link: "", categoryId: categories[0] ? categories[0].id : "", meals: ["pranzo", "cena"], ingredients: [] }]);
  }
  function removeRecipe(id) {
    setRecipes((rs) => rs.filter((r) => r.id !== id));
  }

  async function handleImport() {
    setImportError("");
    const url = importUrl.trim();
    if (!url) return;
    setImporting(true);
    try {
      const res = await fetch("/api/import-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportError(data.error || "Importazione non riuscita.");
        return;
      }
      setDraft({
        name: data.name || "",
        link: url,
        categoryId: "",
        meals: [],
        ingredients: data.items.map((it) => ({ ingredientId: it.ingredientId || "", grams: it.grams || 0, sourceText: it.text })),
      });
      setImportUrl("");
    } catch {
      setImportError("Errore di rete durante l'importazione.");
    } finally {
      setImporting(false);
    }
  }

  function handleConfirmImport(d) {
    const mt = d.meals[0];
    const macros = computeRecipeMacros(d);
    const mealBudget = settings.dailyCalories * (settings.mealSplit[mt] / 100) / (mt === "spuntino" ? Math.max(1, settings.spuntiniPerDay) : 1);
    const scale = macros.kcal > 0 ? mealBudget / macros.kcal : 1;
    const scaledIngredients = d.ingredients
      .filter((ing) => ing.ingredientId)
      .map((ing) => ({ ingredientId: ing.ingredientId, grams: round1((ing.grams || 0) * scale) }));
    const id = "r-" + Date.now();
    setRecipes((rs) => [...rs, { id, name: d.name.trim(), link: d.link, categoryId: d.categoryId, meals: d.meals, ingredients: scaledIngredients }]);
    setDraft(null);
  }

  return (
    <div className="panel">
      <h3>Ricettario</h3>
      <div className="sub">
        Incolla il link di una ricetta e premi Importa: provo a leggere ingredienti e pesi dalla pagina, poi ti chiedo
        nome, categoria e pasto e ricalibro le quantita sul tetto calorico di quel pasto. Funziona sui siti che
        pubblicano i dati strutturati della ricetta (la maggior parte dei grandi siti italiani lo fa) &mdash; se un
        link non funziona, aggiungi la ricetta a mano con &quot;+ Nuova ricetta&quot; qui sotto.
      </div>

      <div className="import-bar">
        <input type="url" placeholder="Incolla qui il link della ricetta..." value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleImport(); }} />
        <button className="btn primary" onClick={handleImport} disabled={importing || !importUrl.trim()}>
          {importing ? "Importazione…" : "Importa"}
        </button>
      </div>
      {importError && (
        <div className="warn-box"><h4>Import non riuscito</h4><ul><li>{importError}</li></ul></div>
      )}

      {recipes.length === 0 && <div className="empty-note">Nessuna ricetta ancora. Importane una dal link o aggiungine una qui sotto.</div>}

      {recipes.map((r) => {
        const macros = computeRecipeMacros(r);
        const pct = macroPctOf(macros);
        return (
          <div className="recipe-card" key={r.id}>
            <div className="rc-head">
              <input type="text" className="r-name" placeholder="Nome ricetta" value={r.name}
                onChange={(e) => updateRecipe(r.id, { name: e.target.value })} />
              <input type="url" className="r-link" placeholder="Link ricetta esterna" value={r.link || ""}
                onChange={(e) => updateRecipe(r.id, { link: e.target.value })} />
              <select className="r-cat" value={r.categoryId} onChange={(e) => updateRecipe(r.id, { categoryId: e.target.value })}>
                {categories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
              </select>
              <div className="chk-group">
                {MEAL_TYPES.map((mt) => (
                  <label key={mt} title={MEAL_LABELS[mt]}>
                    <input type="checkbox" checked={r.meals.includes(mt)} onChange={() => toggleMeal(r.id, mt)} />
                    {MEAL_SHORT[mt]}
                  </label>
                ))}
              </div>
              <ConfirmButton onConfirm={() => removeRecipe(r.id)} />
            </div>
            {r.notes && r.notes.indexOf("Esempio") !== -1 && <div className="example-note">{r.notes}</div>}

            <IngredientTable ingredients={r.ingredients || []} groups={groups}
              onChange={(ings) => updateRecipe(r.id, { ingredients: ings })} />

            <div className="rc-summary">
              <div className="bar-slot">
                <div className="macro-bar" title={`P ${round1(pct.p)}% / C ${round1(pct.c)}% / G ${round1(pct.f)}%`}>
                  <span style={{ width: pct.p + "%", background: "var(--protein)" }} />
                  <span style={{ width: pct.c + "%", background: "var(--carbs)" }} />
                  <span style={{ width: pct.f + "%", background: "var(--fat)" }} />
                </div>
              </div>
              <div className="totals num">
                {round1(macros.kcal)} kcal totali porzione &middot; P {round1(macros.protein)}g &middot; C {round1(macros.carbs)}g &middot; G {round1(macros.fat)}g
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 4 }}><button className="btn small" onClick={addRecipe}>+ Nuova ricetta</button></div>

      {draft && (
        <ImportRecipeModal draft={draft} setDraft={setDraft} categories={categories} groups={groups}
          onConfirm={handleConfirmImport} onClose={() => setDraft(null)} />
      )}
    </div>
  );
}
