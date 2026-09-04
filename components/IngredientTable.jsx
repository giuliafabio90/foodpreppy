"use client";
import { INGREDIENT_DB, round1 } from "../lib/data";

// Tabella ingredienti riusata sia nella scheda ricetta (modifica manuale)
// sia nel popup di revisione import: select alimento + peso in grammi,
// con calorie/macro calcolate live. La spunta "Fisso" marca un ingrediente
// da NON toccare quando si ricalibra la porzione: il ricalcolo scala solo
// gli ingredienti non fissi per centrare il target calorico.
export default function IngredientTable({ ingredients, groups, onChange, showSource = false, showLock = false, t = (s) => s }) {
  function update(idx, patch) {
    onChange(ingredients.map((ing, i) => (i === idx ? { ...ing, ...patch } : ing)));
  }
  function remove(idx) {
    onChange(ingredients.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...ingredients, { ingredientId: "", grams: 100 }]);
  }

  const colSpan = 7 + (showSource ? 1 : 0) + (showLock ? 1 : 0);

  return (
    <div className="rc-ingredients">
      <div className="table-wrap">
        <table className="ing-table">
          <thead>
            <tr>
              {showSource && <th>{t("Testo letto dal sito")}</th>}
              <th>{t("Ingrediente")}</th><th>{t("Peso (g)")}</th><th>{t("Kcal")}</th><th>{t("Prot g")}</th><th>{t("Carb g")}</th><th>{t("Grassi g")}</th>
              {showLock && <th title={t("Non scalare questo ingrediente quando si ricalibra")}>{t("Fisso")}</th>}
              <th />
            </tr>
          </thead>
          <tbody>
            {ingredients.length === 0 && (
              <tr><td colSpan={colSpan} className="empty-note">{t("Nessun ingrediente. Aggiungine uno.")}</td></tr>
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
                      <option value="">{unmatched ? t("— non riconosciuto: scegli —") : t("— nessuno —")}</option>
                      {groups.map((g) => (
                        <optgroup label={g.label} key={g.categoryId}>
                          {g.items.map((it) => <option value={it.id} key={it.id}>{it.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </td>
                  <td><input type="number" min="0" step="5" value={ing.grams} disabled={showLock && !!ing.locked}
                    onChange={(e) => update(idx, { grams: Math.max(0, parseFloat(e.target.value) || 0) })} /></td>
                  <td className="mono">{def ? round1(def.kcal100 * f) : 0}</td>
                  <td className="mono">{def ? round1(def.protein100 * f) : 0}</td>
                  <td className="mono">{def ? round1(def.carbs100 * f) : 0}</td>
                  <td className="mono">{def ? round1(def.fat100 * f) : 0}</td>
                  {showLock && (
                    <td style={{ textAlign: "center" }}>
                      <input type="checkbox" checked={!!ing.locked} title={t("Mantieni fisso in fase di ricalibro")}
                        onChange={(e) => update(idx, { locked: e.target.checked })} />
                    </td>
                  )}
                  <td><button className="linklike" onClick={() => remove(idx)}>&times;</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button className="btn small ghost" style={{ marginTop: 8 }} onClick={add}>{t("+ Ingrediente")}</button>
    </div>
  );
}
