"use client";
import { useState } from "react";

// Dopo aver caricato un file con piu' ricette: elenco dei nomi trovati,
// tutti selezionati di default, deselezionabili prima di procedere alle
// conferme una per una.
export default function RecipeSelectModal({ recipes, onContinue, onClose, t }) {
  const [checked, setChecked] = useState(() => recipes.map(() => true));
  const count = checked.filter(Boolean).length;

  function toggle(i) {
    setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{t("Ricette trovate nel file")}</h3>
        <div className="sub">{t("Ho trovato {n} ricette in questo file. Deseleziona quelle che non vuoi importare, poi procedi: te le farò confermare una alla volta, come per un import singolo.", { n: recipes.length })}</div>

        <ul className="picker-list">
          {recipes.map((r, i) => (
            <li key={i}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer" }}>
                <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} />
                <span>{r.name || t("Ricetta {n} (senza nome)", { n: i + 1 })}</span>
                <span className="picker-cat-tag" style={{ marginLeft: "auto" }}>{t("{n} ingredienti", { n: r.items.length })}</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>{t("Annulla")}</button>
          <button className="btn primary" disabled={count === 0}
            onClick={() => onContinue(recipes.filter((_, i) => checked[i]))}>
            {t("Continua con {n} ricett{s}", { n: count, s: count === 1 ? "a" : "e" })}
          </button>
        </div>
      </div>
    </div>
  );
}
