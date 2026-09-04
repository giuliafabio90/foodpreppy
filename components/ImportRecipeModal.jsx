"use client";
import { MEAL_TYPES, MEAL_LABELS, computeRecipeMacros, round1 } from "../lib/data";
import IngredientTable from "./IngredientTable";

export default function ImportRecipeModal({ draft, setDraft, categories, groups, onConfirm, onClose }) {
  const macros = computeRecipeMacros(draft);
  const unmatchedCount = draft.ingredients.filter((i) => !i.ingredientId).length;
  const canConfirm = draft.name.trim() && draft.categoryId && draft.meals.length > 0;

  function toggleMeal(mt) {
    setDraft((d) => ({ ...d, meals: d.meals.includes(mt) ? d.meals.filter((m) => m !== mt) : [...d.meals, mt] }));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Importa ricetta</h3>
        <div className="sub">
          Ho letto gli ingredienti dalla pagina e li ho abbinati al database nutrizionale come meglio potevo. Controlla
          e correggi quello che serve, scegli categoria e pasto, poi conferma: i pesi verranno ricalibrati per
          rientrare nel tetto calorico del pasto scelto.
        </div>

        <div className="field-grid" style={{ marginBottom: 16 }}>
          <label className="field"><span>Nome ricetta</span>
            <input type="text" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
          </label>
          <label className="field"><span>Categoria alimentare</span>
            <select value={draft.categoryId} onChange={(e) => setDraft((d) => ({ ...d, categoryId: e.target.value }))}>
              <option value="">&mdash; scegli &mdash;</option>
              {categories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>

        <label className="field" style={{ marginBottom: 16 }}>
          <span>A quale pasto appartiene</span>
          <div className="chk-group" style={{ marginTop: 6 }}>
            {MEAL_TYPES.map((mt) => (
              <label key={mt}>
                <input type="checkbox" checked={draft.meals.includes(mt)} onChange={() => toggleMeal(mt)} /> {MEAL_LABELS[mt]}
              </label>
            ))}
          </div>
        </label>

        {unmatchedCount > 0 && (
          <div className="warn-box">
            <h4>Da controllare</h4>
            <ul><li>{unmatchedCount} ingredienti non riconosciuti automaticamente: scegli l&apos;alimento corrispondente prima di confermare (o eliminali se non servono).</li></ul>
          </div>
        )}

        <IngredientTable ingredients={draft.ingredients} groups={groups} showSource
          onChange={(ings) => setDraft((d) => ({ ...d, ingredients: ings }))} />

        <div className="rc-summary">
          <div className="totals num">{round1(macros.kcal)} kcal totali porzione, prima del ricalibro sul pasto scelto</div>
        </div>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Annulla</button>
          <button className="btn primary" disabled={!canConfirm} onClick={() => onConfirm(draft)}>Conferma e aggiungi</button>
        </div>
      </div>
    </div>
  );
}
