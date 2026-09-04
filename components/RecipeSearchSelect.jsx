"use client";
import { useEffect, useRef, useState } from "react";

const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");
function normalize(s) {
  return s.normalize("NFD").replace(DIACRITICS, "").toLowerCase();
}

// Combobox con ricerca: mostra il nome della ricetta scelta, digitando
// filtra tra le opzioni passate (gia limitate a categoria+pasto compatibili
// da chi usa il componente).
export default function RecipeSearchSelect({ options, value, onSelect, placeholder = "Cerca ricetta…" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const closeTimer = useRef(null);

  const current = options.find((o) => o.id === value);
  const filtered = query
    ? options.filter((o) => normalize(o.name).includes(normalize(query)))
    : options;

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function handleFocus() {
    clearTimeout(closeTimer.current);
    setQuery("");
    setOpen(true);
  }
  function handleBlur() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }
  function pick(id) {
    clearTimeout(closeTimer.current);
    onSelect(id);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="recipe-search" ref={wrapRef}>
      <input
        type="text"
        placeholder={options.length ? placeholder : "Nessuna ricetta in questa categoria"}
        disabled={options.length === 0}
        value={open ? query : (current ? current.name : "")}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => setQuery(e.target.value)}
      />
      {open && (
        <ul className="recipe-search-list">
          {filtered.length === 0 && <li className="recipe-search-empty">Nessun risultato</li>}
          {filtered.map((o) => (
            <li key={o.id}>
              <button type="button" className={o.id === value ? "current" : ""}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(o.id)}>
                {o.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
