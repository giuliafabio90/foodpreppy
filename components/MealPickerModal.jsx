"use client";
import { useState } from "react";
import { hueColor } from "../lib/data";

const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");
function normalize(s) {
  return s.normalize("NFD").replace(DIACRITICS, "").toLowerCase();
}

// Popup di selezione manuale per un pasto: si sceglie una categoria (di
// default quella attuale della cella, ma cambiabile) e poi una ricetta
// specifica tra quelle di quella categoria compatibili con il pasto.
export default function MealPickerModal({ mt, mealLabel, currentCategoryId, currentRecipeId, categories, recipes, catHue, onPick, onClose, t }) {
  const eligibleCats = categories.filter((c) => c.meals.includes(mt));
  const [filterCat, setFilterCat] = useState(currentCategoryId || "");
  const [query, setQuery] = useState("");

  const pool = recipes.filter((r) => r.meals.includes(mt) && (filterCat ? r.categoryId === filterCat : true));
  const filtered = query ? pool.filter((r) => normalize(r.name).includes(normalize(query))) : pool;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{t("Selezione manuale — {m}", { m: mealLabel })}</h3>
        <div className="sub">{t("Scegli una categoria (o lascia \"Tutte\") e poi la ricetta da usare per questo pasto.")}</div>

        <div className="field-grid" style={{ marginBottom: 14 }}>
          <label className="field"><span>{t("Categoria")}</span>
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
              <option value="">{t("Tutte le categorie")}</option>
              {eligibleCats.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="field"><span>{t("Cerca per nome")}</span>
            <input type="text" placeholder={t("Digita per cercare…")} value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
        </div>

        <ul className="picker-list">
          {filtered.length === 0 && <li className="recipe-search-empty">{t("Nessuna ricetta disponibile in questa categoria per {m}.", { m: mealLabel.toLowerCase() })}</li>}
          {filtered.map((r) => (
            <li key={r.id}>
              <button type="button" className={r.id === currentRecipeId ? "current" : ""} onClick={() => onPick(r.id)}>
                <span className="hue-dot" style={{ background: hueColor(catHue, r.categoryId, 45) }} />
                {r.name}
                {!filterCat && <span className="picker-cat-tag">{(categories.find((c) => c.id === r.categoryId) || {}).name}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>{t("Annulla")}</button>
        </div>
      </div>
    </div>
  );
}
