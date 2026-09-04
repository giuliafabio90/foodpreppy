// Persistenza locale: i dati vivono nel localStorage del browser (nessun
// backend/database). Letture e scritture sono difensive: se lo storage non
// e disponibile (privacy mode, quota piena, ecc.) l'app continua a
// funzionare solo in memoria per la sessione corrente.

const PREFIX = "tabella-settimanale:";

export function loadState(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}

export function saveState(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage pieno o non disponibile: fallisce in silenzio
  }
}
