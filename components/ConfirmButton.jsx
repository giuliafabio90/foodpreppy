"use client";
import { useEffect, useRef, useState } from "react";

// Bottone "Elimina" con conferma inline a due click, senza usare la
// window.confirm() nativa: primo click arma ("Confermi?"), secondo click
// entro 4s conferma, un click altrove o il timeout annulla.
export default function ConfirmButton({ onConfirm, children = "Elimina", className = "linklike" }) {
  const [armed, setArmed] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!armed) return undefined;
    timeoutRef.current = setTimeout(() => setArmed(false), 4000);
    function onDocClick(e) {
      if (!e.target.closest || e.target.closest("[data-confirm-btn]") !== btnRef.current) setArmed(false);
    }
    document.addEventListener("click", onDocClick, true);
    return () => {
      clearTimeout(timeoutRef.current);
      document.removeEventListener("click", onDocClick, true);
    };
  }, [armed]);

  const btnRef = useRef(null);

  function handleClick() {
    if (!armed) { setArmed(true); return; }
    setArmed(false);
    onConfirm();
  }

  return (
    <button
      ref={btnRef}
      type="button"
      data-confirm-btn
      className={className + (armed ? " confirm-armed" : "")}
      onClick={handleClick}
    >
      {armed ? "Confermi?" : children}
    </button>
  );
}
