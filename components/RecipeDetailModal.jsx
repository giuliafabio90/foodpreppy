"use client";
import { MEAL_TYPES, MEAL_LABELS, MEAL_SHORT, computeRecipeMacros, macroPctOf, round1 } from "../lib/data";
import ConfirmButton from "./ConfirmButton";
import IngredientTable from "./IngredientTable";

// Popup di dettaglio/modifica di una ricetta: usato sia dal Ricettario
// (click sul nome nella lista per categoria) sia dal Piano settimanale
// (click sul nome ricetta in una cella) — stesso componente, stesso
// comportamento in entrambi i posti.
export default function RecipeDetailModal({ recipe, categories, groups, setRecipes, onClose, t }) {
  if (!recipe) return null;
  const macros = computeRecipeMacros(recipe);
  const pct = macroPctOf(macros);

  function update(patch) {
    setRecipes((rs) => rs.map((r) => (r.id === recipe.id ? { ...r, ...patch } : r)));
  }
  function toggleMeal(mt) {
    const has = recipe.meals.includes(mt);
    update({ meals: has ? recipe.meals.filter((m) => m !== mt) : [...recipe.meals, mt] });
  }
  function remove() {
    setRecipes((rs) => rs.filter((r) => r.id !== recipe.id));
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="field-grid" style={{ marginBottom: 16 }}>
          <label className="field"><span>{t("Nome ricetta")}</span>
            <input type="text" value={recipe.name} onChange={(e) => update({ name: e.target.value })} />
          </label>
          <label className="field"><span>{t("Categoria alimentare")}</span>
            <select value={recipe.categoryId} onChange={(e) => update({ categoryId: e.target.value })}>
              {categories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>

        <div className="field-grid" style={{ marginBottom: 16 }}>
          <label className="field"><span>{t("Link ricetta esterna")}</span>
            <input type="url" placeholder="https://…" value={recipe.link || ""} onChange={(e) => update({ link: e.target.value })} />
          </label>
          <label className="field"><span>{t("Pasti")}</span>
            <div className="chk-group" style={{ marginTop: 8 }}>
              {MEAL_TYPES.map((mt) => (
                <label key={mt} title={t(MEAL_LABELS[mt])}>
                  <input type="checkbox" checked={recipe.meals.includes(mt)} onChange={() => toggleMeal(mt)} /> {t(MEAL_SHORT[mt])}
                </label>
              ))}
            </div>
          </label>
        </div>
        {recipe.link && <a href={recipe.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginBottom: 16 }}>{t("Apri ricetta originale ↗")}</a>}

        <IngredientTable ingredients={recipe.ingredients || []} groups={groups} showLock t={t}
          onChange={(ings) => update({ ingredients: ings })} />

        <div className="rc-summary">
          <div className="bar-slot">
            <div className="macro-bar" title={`P ${round1(pct.p)}% / C ${round1(pct.c)}% / G ${round1(pct.f)}%`}>
              <span style={{ width: pct.p + "%", background: "var(--protein)" }} />
              <span style={{ width: pct.c + "%", background: "var(--carbs)" }} />
              <span style={{ width: pct.f + "%", background: "var(--fat)" }} />
            </div>
          </div>
          <div className="totals num">
            {t("{n} kcal totali porzione · P {p}g · C {c}g · G {f}g", { n: round1(macros.kcal), p: round1(macros.protein), c: round1(macros.carbs), f: round1(macros.fat) })}
          </div>
        </div>

        <label className="field" style={{ margin: "16px 0" }}>
          <span>{t("Preparazione (un passaggio per riga)")}</span>
          <textarea rows={5} value={(recipe.steps || []).join("\n")}
            onChange={(e) => update({ steps: e.target.value.split("\n") })} />
        </label>
        {recipe.steps && recipe.steps.filter(Boolean).length > 0 && (
          <ol className="steps-list">
            {recipe.steps.filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        )}

        <div className="modal-actions" style={{ justifyContent: "space-between" }}>
          <ConfirmButton onConfirm={remove} t={t}>{t("Elimina ricetta")}</ConfirmButton>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn ghost" onClick={() => window.print()}>{t("Stampa")}</button>
            <button className="btn ghost" onClick={onClose}>{t("Chiudi")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
