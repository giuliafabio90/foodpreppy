"use client";
import { useState } from "react";

// Dopo aver caricato un file con piu' ricette: elenco dei nomi trovati,
// tutti selezionati di default, deselezionabili prima di procedere alle
// conferme una per una.
export default function RecipeSelectModal({ recipes, onContinue, onClose }) {
  const [checked, setChecked] = useState(() => recipes.map(() => true));
  const count = checked.filter(Boolean).length;

  function toggle(i) {
    setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Ricette trovate nel file</h3>
        <div className="sub">Ho trovato {recipes.length} ricette in questo file. Deseleziona quelle che non vuoi importare, poi procedi: te le farò confermare una alla volta, come per un import singolo.</div>

        <ul className="picker-list">
          {recipes.map((r, i) => (
            <li key={i}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer" }}>
                <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} />
                <span>{r.name || `Ricetta ${i + 1} (senza nome)`}</span>
                <span className="picker-cat-tag" style={{ marginLeft: "auto" }}>{r.items.length} ingredienti</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Annulla</button>
          <button className="btn primary" disabled={count === 0}
            onClick={() => onContinue(recipes.filter((_, i) => checked[i]))}>
            Continua con {count} ricett{count === 1 ? "a" : "e"}
          </button>
        </div>
      </div>
    </div>
  );
}
