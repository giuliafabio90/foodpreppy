"use client";
import { MEAL_TYPES, clamp, hueColor } from "../lib/data";
import ConfirmButton from "./ConfirmButton";

export default function CategoriesView({ categories, setCategories, catHue }) {
  function update(id, patch) {
    setCategories((cats) => cats.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function toggleMeal(id, mt) {
    setCategories((cats) => cats.map((c) => {
      if (c.id !== id) return c;
      const has = c.meals.includes(mt);
      return { ...c, meals: has ? c.meals.filter((m) => m !== mt) : [...c.meals, mt] };
    }));
  }
  function addCategory() {
    const id = "cat-" + Date.now();
    setCategories((cats) => [...cats, { id, name: "Nuova categoria", weeklyFrequency: 1, meals: ["pranzo", "cena"] }]);
  }
  function remove(id) {
    setCategories((cats) => cats.filter((c) => c.id !== id));
  }

  return (
    <div className="panel">
      <h3>Categorie alimentari</h3>
      <div className="sub">Quante volte a settimana vuoi ciascuna categoria e in quali pasti puo comparire. Frequenza 0 = disponibile ma non pianificata automaticamente.</div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Categoria</th><th>Volte / sett.</th><th>Colazione</th><th>Pranzo</th><th>Cena</th><th>Spuntino</th><th /></tr></thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  <div className="cat-name-cell">
                    <span className="hue-dot" style={{ background: hueColor(catHue, cat.id, 45) }} />
                    <input type="text" value={cat.name} onChange={(e) => update(cat.id, { name: e.target.value })} />
                  </div>
                </td>
                <td>
                  <input type="number" className="narrow" min="0" max="21" value={cat.weeklyFrequency}
                    onChange={(e) => update(cat.id, { weeklyFrequency: clamp(parseInt(e.target.value, 10) || 0, 0, 21) })} />
                </td>
                {MEAL_TYPES.map((mt) => (
                  <td key={mt}><input type="checkbox" checked={cat.meals.includes(mt)} onChange={() => toggleMeal(cat.id, mt)} /></td>
                ))}
                <td className="row-actions"><ConfirmButton onConfirm={() => remove(cat.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12 }}><button className="btn small" onClick={addCategory}>+ Nuova categoria</button></div>
    </div>
  );
}
