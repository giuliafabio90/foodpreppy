"use client";
import { INGREDIENT_DB, round1 } from "../lib/data";

// Tabella ingredienti riusata sia nella scheda ricetta (modifica manuale)
// sia nel popup di revisione import: select alimento + peso in grammi,
// con calorie/macro calcolate live.
export default function IngredientTable({ ingredients, groups, onChange, showSource = false }) {
  function update(idx, patch) {
    onChange(ingredients.map((ing, i) => (i === idx ? { ...ing, ...patch } : ing)));
  }
  function remove(idx) {
    onChange(ingredients.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...ingredients, { ingredientId: "", grams: 100 }]);
  }

  const colSpan = showSource ? 8 : 7;

  return (
    <div className="rc-ingredients">
      <div className="table-wrap">
        <table className="ing-table">
          <thead>
            <tr>
              {showSource && <th>Testo letto dal sito</th>}
              <th>Ingrediente</th><th>Peso (g)</th><th>Kcal</th><th>Prot g</th><th>Carb g</th><th>Grassi g</th><th />
            </tr>
          </thead>
          <tbody>
            {ingredients.length === 0 && (
              <tr><td colSpan={colSpan} className="empty-note">Nessun ingrediente. Aggiungine uno.</td></tr>
            )}
            {ingredients.map((ing, idx) => {
              const def = INGREDIENT_DB.find((i) => i.id === ing.ingredientId);
              const f = (ing.grams || 0) / 100;
              const unmatched = !ing.ingredientId;
              return (
                <tr key={idx} className={unmatched ? "ing-row-unmatched" : ""}>
                  {showSource && <td className="empty-note" style={{ maxWidth: 180 }}>{ing.sourceText || ""}</td>}
                  <td>
                    <select value={ing.ingredientId || ""} onChange={(e) => update(idx, { ingredientId: e.target.value })}>
                      <option value="">{unmatched ? "— non riconosciuto: scegli —" : "— nessuno —"}</option>
                      {groups.map((g) => (
                        <optgroup label={g.label} key={g.categoryId}>
                          {g.items.map((it) => <option value={it.id} key={it.id}>{it.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </td>
                  <td><input type="number" min="0" step="5" value={ing.grams}
                    onChange={(e) => update(idx, { grams: Math.max(0, parseFloat(e.target.value) || 0) })} /></td>
                  <td className="mono">{def ? round1(def.kcal100 * f) : 0}</td>
                  <td className="mono">{def ? round1(def.protein100 * f) : 0}</td>
                  <td className="mono">{def ? round1(def.carbs100 * f) : 0}</td>
                  <td className="mono">{def ? round1(def.fat100 * f) : 0}</td>
                  <td><button className="linklike" onClick={() => remove(idx)}>&times;</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button className="btn small ghost" style={{ marginTop: 8 }} onClick={add}>+ Ingrediente</button>
    </div>
  );
}
