# Tabella Settimanale

Pianificatore di pasti settimanali: imposta calorie, frequenze per categoria
alimentare, range macro per pasto e ricette a ingredienti; l'app genera uno
schema settimanale casuale, ricalibrando i pesi degli ingredienti di ogni
ricetta per centrare il target calorico del pasto.

Login con email e password; i dati (impostazioni, categorie, ricette, piano)
sono salvati su un database Postgres (Neon), un blob per account: li ritrovi
ad ogni accesso, da qualsiasi dispositivo.

## Sviluppo locale

```bash
npm install
vercel env pull .env.local   # scarica AUTH_SECRET e DATABASE_URL dal progetto Vercel
npm run dev
```

Apri http://localhost:3000.

## Infrastruttura

- **Autenticazione**: Auth.js (next-auth v5), provider Credentials (email + password con hash bcrypt). Config in `auth.js`, registrazione in `app/api/auth/register/route.js`.
- **Database**: Postgres via Neon (integrazione nativa Vercel, variabile `DATABASE_URL`). Due tabelle: `users` (account) e `user_data` (un JSONB per utente con tutto lo stato dell'app). Client in `lib/db.js`.
- **Import ricette**: `app/api/import-recipe/route.js` (link o testo incollato) e `app/api/import-recipe-file/route.js` (file di testo con una o più ricette). Parsing in `lib/importParse.js`.

## Deploy

Push su `main` e `vercel --prod` (o collegamento Git → deploy automatico se il repository è connesso correttamente al progetto Vercel).

## Struttura

- `lib/data.js` — costanti (categorie di default, database nutrizionale, range macro) e logica pura di generazione del piano.
- `auth.js`, `lib/db.js` — autenticazione e persistenza server-side.
- `components/App.jsx` — gate di login + stato dell'app + navigazione a schede.
- `components/*View.jsx`, `components/*Modal.jsx` — le cinque schede e i popup (import, dettaglio ricetta, selezione manuale, selezione file).
