"use client";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_SETTINGS, DEFAULT_CATEGORIES, EXAMPLE_RECIPES, generatePlan, assignHues } from "../lib/data";
import SettingsView from "./SettingsView";
import CategoriesView from "./CategoriesView";
import MacrosView from "./MacrosView";
import RecipesView from "./RecipesView";
import PlanView from "./PlanView";

const TABS = [
  { key: "settings", label: "Impostazioni", idx: "01" },
  { key: "categories", label: "Categorie", idx: "02" },
  { key: "macros", label: "Macro per pasto", idx: "03" },
  { key: "recipes", label: "Ricette", idx: "04" },
  { key: "plan", label: "Piano settimanale", idx: "05" },
];

const TITLES = {
  settings: "Impostazioni", categories: "Categorie", macros: "Macro per pasto",
  recipes: "Ricette", plan: "Piano settimanale",
};

export default function App() {
  return (
    <SessionProvider>
      <Gate />
    </SessionProvider>
  );
}

function Gate() {
  const { status } = useSession();
  if (status === "loading") return <CenterScreen text="Caricamento…" />;
  if (status === "unauthenticated") return <SignInScreen />;
  return <AuthedApp />;
}

function CenterScreen({ text }) {
  return (
    <div className="signin-screen"><div className="signin-card"><p className="sub">{text}</p></div></div>
  );
}

function SignInScreen() {
  const [mode, setMode] = useState("signin"); // signin | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const em = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError("Inserisci un'email valida."); return; }
    if (password.length < 8) { setError("La password deve avere almeno 8 caratteri."); return; }
    if (mode === "register" && password !== password2) { setError("Le due password non coincidono."); return; }

    setBusy(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: em, password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Registrazione non riuscita."); setBusy(false); return; }
      }
      const result = await signIn("credentials", { email: em, password, redirect: false });
      if (result?.error) setError("Email o password errati.");
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="signin-screen">
      <div className="signin-card">
        <div className="kicker">Nutrizione &middot; Ricette</div>
        <h1>Tabella<br />Settimanale</h1>
        <p className="sub">Accedi per salvare impostazioni, categorie, ricette e piani: li ritrovi ad ogni accesso, da qualsiasi dispositivo.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
          <label className="field"><span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </label>
          <label className="field"><span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "register" ? "new-password" : "current-password"} required />
          </label>
          {mode === "register" && (
            <label className="field"><span>Conferma password</span>
              <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" required />
            </label>
          )}
          {error && <div className="signin-error">{error}</div>}
          <button className="btn primary" type="submit" disabled={busy}>
            {busy ? "Un momento…" : mode === "register" ? "Crea account" : "Accedi"}
          </button>
        </form>

        <button className="linklike" style={{ marginTop: 14 }}
          onClick={() => { setMode(mode === "signin" ? "register" : "signin"); setError(""); }}>
          {mode === "signin" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
        </button>
      </div>
    </div>
  );
}

function AuthedApp() {
  const { data: session } = useSession();
  const [tab, setTab] = useState("plan");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [recipes, setRecipes] = useState(EXAMPLE_RECIPES);
  const [plan, setPlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
  const saveTimer = useRef(null);

  // Primo caricamento: legge il blob salvato per questo utente. La UI resta
  // bloccata su una schermata di caricamento finche' non arriva, cosi non
  // c'e' finestra in cui una modifica dell'utente possa essere sovrascritta
  // dal fetch (stessa logica del vecchio localStorage, solo asincrona).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/user-data")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const d = res && res.data;
        if (d) {
          if (d.settings) setSettings(d.settings);
          if (d.categories) setCategories(d.categories);
          if (d.recipes) setRecipes(d.recipes);
          if (d.plan !== undefined) setPlan(d.plan);
          if (d.history) setHistory(d.history);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setDataLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  // Primo utilizzo in assoluto per questo account (nessun dato salvato):
  // genera subito uno schema di partenza invece di un pannello vuoto.
  useEffect(() => {
    if (dataLoaded && plan === null) setPlan(generatePlan(settings, categories, recipes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded]);

  // Salvataggio sul server, con un breve debounce per non spedire una
  // richiesta ad ogni singolo carattere digitato.
  useEffect(() => {
    if (!dataLoaded) return;
    setSaveStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/user-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, categories, recipes, plan, history }),
      })
        .then((r) => { if (!r.ok) throw new Error(); setSaveStatus("saved"); })
        .catch(() => setSaveStatus("error"));
    }, 700);
    return () => clearTimeout(saveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded, settings, categories, recipes, plan, history]);

  const catHue = useMemo(() => assignHues(categories), [categories]);

  function regenerate() {
    setPlan(generatePlan(settings, categories, recipes));
  }
  function saveToHistory() {
    if (!plan) return;
    setHistory((h) => (h[0] && h[0].createdAt === plan.createdAt ? h : [plan, ...h]).slice(0, 12));
  }

  if (!dataLoaded) return <CenterScreen text="Caricamento dati…" />;

  const saveLabel = saveStatus === "saving" ? "Salvataggio…" : saveStatus === "error" ? "Errore di salvataggio" : "Sincronizzato";

  return (
    <div className="app">
      <nav className="tabs">
        <div className="brand">
          <div className="kicker">Nutrizione &middot; Ricette</div>
          <h1>Tabella<br />Settimanale</h1>
        </div>
        {TABS.map((t) => (
          <button key={t.key} className={"tab-btn" + (tab === t.key ? " active" : "")} onClick={() => setTab(t.key)}>
            <span className="idx">{t.idx}</span> {t.label}
          </button>
        ))}
      </nav>
      <main>
        <div className="topbar">
          <h2>{TITLES[tab]}</h2>
          <div className="savestate">
            <span className={"dot" + (saveStatus === "error" ? " error" : "")} />
            <span>{session && session.user ? session.user.email : ""} &middot; {saveLabel}</span>
            <button className="linklike" onClick={() => signOut()}>Esci</button>
          </div>
        </div>

        {tab === "settings" && <SettingsView settings={settings} setSettings={setSettings} />}
        {tab === "categories" && <CategoriesView categories={categories} setCategories={setCategories} catHue={catHue} />}
        {tab === "macros" && <MacrosView settings={settings} setSettings={setSettings} />}
        {tab === "recipes" && <RecipesView settings={settings} categories={categories} recipes={recipes} setRecipes={setRecipes} catHue={catHue} />}
        {tab === "plan" && (
          <PlanView
            settings={settings} categories={categories} recipes={recipes} setRecipes={setRecipes}
            plan={plan} setPlan={setPlan} history={history}
            catHue={catHue} onRegenerate={regenerate} onSaveToHistory={saveToHistory}
          />
        )}
      </main>
    </div>
  );
}
