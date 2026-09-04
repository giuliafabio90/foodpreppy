"use client";
import { MEAL_TYPES, MEAL_LABELS, MEAL_SHORT, INGREDIENT_DB, computeRecipeMacros, macroPctOf, ingredientsGrouped, round1 } from "../lib/data";
import ConfirmButton from "./ConfirmButton";

export default function RecipesView({ categories, recipes, setRecipes }) {
  const groups = ingredientsGrouped(categories);

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
  function addIngredient(id) {
    setRecipes((rs) => rs.map((r) => (r.id === id ? { ...r, ingredients: [...(r.ingredients || []), { ingredientId: INGREDIENT_DB[0].id, grams: 100 }] } : r)));
  }
  function updateIngredient(id, idx, patch) {
    setRecipes((rs) => rs.map((r) => {
      if (r.id !== id) return r;
      const ingredients = r.ingredients.map((ing, i) => (i === idx ? { ...ing, ...patch } : ing));
      return { ...r, ingredients };
    }));
  }
  function removeIngredient(id, idx) {
    setRecipes((rs) => rs.map((r) => (r.id === id ? { ...r, ingredients: r.ingredients.filter((_, i) => i !== idx) } : r)));
  }

  return (
    <div className="panel">
      <h3>Ricettario</h3>
      <div className="sub">
        Incolla il link della ricetta esterna, dai un nome e scegli la categoria. Aggiungi gli ingredienti della
        porzione base con il loro peso in grammi: calorie e macro si calcolano da soli dal database nutrizionale
        integrato. L&apos;app non legge il contenuto della pagina esterna (limite di sicurezza del browser) &mdash; il
        link resta un riferimento cliccabile alla fonte. In fase di generazione del piano i pesi vengono ricalibrati
        per centrare il target calorico del pasto.
      </div>

      {recipes.length === 0 && <div className="empty-note">Nessuna ricetta ancora. Aggiungine una qui sotto.</div>}

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

            <div className="rc-ingredients">
              <div className="table-wrap">
                <table className="ing-table">
                  <thead><tr><th>Ingrediente</th><th>Peso (g)</th><th>Kcal</th><th>Prot g</th><th>Carb g</th><th>Grassi g</th><th /></tr></thead>
                  <tbody>
                    {(r.ingredients || []).length === 0 && (
                      <tr><td colSpan={7} className="empty-note">Nessun ingrediente. Aggiungine uno.</td></tr>
                    )}
                    {(r.ingredients || []).map((ing, idx) => {
                      const def = INGREDIENT_DB.find((i) => i.id === ing.ingredientId);
                      const f = (ing.grams || 0) / 100;
                      return (
                        <tr key={idx}>
                          <td>
                            <select value={ing.ingredientId} onChange={(e) => updateIngredient(r.id, idx, { ingredientId: e.target.value })}>
                              {groups.map((g) => (
                                <optgroup label={g.label} key={g.categoryId}>
                                  {g.items.map((it) => <option value={it.id} key={it.id}>{it.name}</option>)}
                                </optgroup>
                              ))}
                            </select>
                          </td>
                          <td><input type="number" min="0" step="5" value={ing.grams}
                            onChange={(e) => updateIngredient(r.id, idx, { grams: Math.max(0, parseFloat(e.target.value) || 0) })} /></td>
                          <td className="mono">{def ? round1(def.kcal100 * f) : 0}</td>
                          <td className="mono">{def ? round1(def.protein100 * f) : 0}</td>
                          <td className="mono">{def ? round1(def.carbs100 * f) : 0}</td>
                          <td className="mono">{def ? round1(def.fat100 * f) : 0}</td>
                          <td><button className="linklike" onClick={() => removeIngredient(r.id, idx)}>&times;</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button className="btn small ghost" style={{ marginTop: 8 }} onClick={() => addIngredient(r.id)}>+ Ingrediente</button>
            </div>

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
    </div>
  );
}
