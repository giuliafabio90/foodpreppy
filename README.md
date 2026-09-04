# Tabella Settimanale

Pianificatore di pasti settimanali: imposta calorie, frequenze per categoria
alimentare, range macro per pasto e ricette a ingredienti; l'app genera uno
schema settimanale casuale, ricalibrando i pesi degli ingredienti di ogni
ricetta per centrare il target calorico del pasto.

I dati (impostazioni, categorie, ricette, piano) sono salvati nel
**localStorage del browser**: restano su questo dispositivo/browser, nessun
database o account richiesto.

## Sviluppo locale

```bash
npm install
npm run dev
```

Apri http://localhost:3000.

## Deploy su Vercel

1. Crea un repository vuoto su GitHub (senza README, senza `.gitignore` — li ha gia il progetto).
2. Collega il repo locale e pusha:
   ```bash
   git remote add origin <URL_DEL_TUO_REPO>
   git branch -M main
   git push -u origin main
   ```
3. Vai su [vercel.com](https://vercel.com), accedi con GitHub, "Add New… → Project", seleziona questo repository e clicca **Deploy** (Next.js viene rilevato in automatico, nessuna configurazione necessaria: non ci sono variabili d'ambiente).

Ogni push su `main` ripubblica automaticamente il sito.

## Struttura

- `lib/data.js` — costanti (categorie di default, database nutrizionale, range macro) e logica pura di generazione del piano.
- `lib/storage.js` — lettura/scrittura localStorage.
- `components/App.jsx` — stato dell'app e navigazione a schede.
- `components/*View.jsx` — le cinque schede (Impostazioni, Categorie, Macro per pasto, Ricette, Piano settimanale).
