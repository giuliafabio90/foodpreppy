"use client";
import { MEAL_TYPES, MEAL_LABELS, computeRecipeMacros, rescaleIngredients, round1 } from "../lib/data";
import IngredientTable from "./IngredientTable";

export default function ImportRecipeModal({ draft, setDraft, categories, groups, settings, remainingCount = 0, onConfirm, onClose, t }) {
  const macros = computeRecipeMacros(draft);
  const unmatchedCount = draft.ingredients.filter((i) => !i.ingredientId).length;
  const canConfirm = draft.name.trim() && draft.categoryId && draft.meals.length > 0;
  const canRecalibrate = draft.meals.length > 0 && draft.ingredients.some((i) => i.ingredientId);

  function toggleMeal(mt) {
    setDraft((d) => ({ ...d, meals: d.meals.includes(mt) ? d.meals.filter((m) => m !== mt) : [...d.meals, mt] }));
  }

  function handleRecalibrate() {
    const mt = draft.meals[0];
    const mealBudget = settings.dailyCalories * (settings.mealSplit[mt] / 100) / (mt === "spuntino" ? Math.max(1, settings.spuntiniPerDay) : 1);
    setDraft((d) => ({ ...d, ingredients: rescaleIngredients(d.ingredients, mealBudget).map((ing, i) => ({ ...ing, sourceText: d.ingredients[i].sourceText })) }));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{t("Importa ricetta")}{remainingCount > 0 ? t(" (altre {n} in coda)", { n: remainingCount }) : ""}</h3>
        <div className="sub">
          {t("Ho letto gli ingredienti e li ho abbinati al database nutrizionale come meglio potevo. Controlla e correggi quello che serve, scegli categoria e pasto, poi premi Ricalibra per adattare le quantità al tetto calorico del pasto scelto (gli ingredienti con la spunta \"Fisso\" non vengono toccati). Conferma quando i numeri ti convincono.")}
        </div>

        <div className="field-grid" style={{ marginBottom: 16 }}>
          <label className="field"><span>{t("Nome ricetta")}</span>
            <input type="text" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
          </label>
          <label className="field"><span>{t("Categoria alimentare")}</span>
            <select value={draft.categoryId} onChange={(e) => setDraft((d) => ({ ...d, categoryId: e.target.value }))}>
              <option value="">&mdash; {t("scegli")} &mdash;</option>
              {categories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>

        <label className="field" style={{ marginBottom: 16 }}>
          <span>{t("A quale pasto appartiene")}</span>
          <div className="chk-group" style={{ marginTop: 6 }}>
            {MEAL_TYPES.map((mt) => (
              <label key={mt}>
                <input type="checkbox" checked={draft.meals.includes(mt)} onChange={() => toggleMeal(mt)} /> {t(MEAL_LABELS[mt])}
              </label>
            ))}
          </div>
        </label>

        {unmatchedCount > 0 && (
          <div className="warn-box">
            <h4>{t("Da controllare")}</h4>
            <ul><li>{t("{n} ingredienti non riconosciuti automaticamente: scegli l'alimento corrispondente prima di confermare (o eliminali se non servono).", { n: unmatchedCount })}</li></ul>
          </div>
        )}

        <IngredientTable ingredients={draft.ingredients} groups={groups} showSource showLock t={t}
          onChange={(ings) => setDraft((d) => ({ ...d, ingredients: ings }))} />

        <label className="field" style={{ margin: "16px 0" }}>
          <span>{t("Preparazione (un passaggio per riga)")}</span>
          <textarea rows={5} value={(draft.steps || []).join("\n")}
            onChange={(e) => setDraft((d) => ({ ...d, steps: e.target.value.split("\n") }))} />
        </label>

        <div className="rc-summary">
          <div className="totals num">{round1(macros.kcal)} {t("kcal totali porzione")}</div>
          <button type="button" className="btn small ghost" disabled={!canRecalibrate} onClick={handleRecalibrate}
            title={draft.meals.length ? "" : t("Scegli almeno un pasto per calcolare il tetto calorico")}>
            {t("Ricalibra sul pasto scelto")}
          </button>
        </div>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>{remainingCount > 0 ? t("Salta questa ricetta") : t("Annulla")}</button>
          <button className="btn primary" disabled={!canConfirm} onClick={() => onConfirm(draft)}>{t("Conferma e aggiungi")}</button>
        </div>
      </div>
    </div>
  );
}
