"use client";
import { useEffect, useMemo, useState } from "react";
import { loadState, saveState } from "../lib/storage";
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
  const [tab, setTab] = useState("plan");
  const [settings, setSettings] = useState(() => loadState("settings", DEFAULT_SETTINGS));
  const [categories, setCategories] = useState(() => loadState("categories", DEFAULT_CATEGORIES));
  const [recipes, setRecipes] = useState(() => loadState("recipes", EXAMPLE_RECIPES));
  const [plan, setPlan] = useState(() => loadState("plan", null));
  const [history, setHistory] = useState(() => loadState("history", []));

  useEffect(() => { saveState("settings", settings); }, [settings]);
  useEffect(() => { saveState("categories", categories); }, [categories]);
  useEffect(() => { saveState("recipes", recipes); }, [recipes]);
  useEffect(() => { saveState("plan", plan); }, [plan]);
  useEffect(() => { saveState("history", history); }, [history]);

  // Primo avvio in assoluto (nessun piano salvato in questo browser): genera
  // subito uno schema di partenza, cosi la pagina mostra da subito cosa fa
  // l'app invece di un pannello vuoto.
  useEffect(() => {
    if (plan === null) setPlan(generatePlan(settings, categories, recipes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const catHue = useMemo(() => assignHues(categories), [categories]);

  function regenerate() {
    const p = generatePlan(settings, categories, recipes);
    setHistory((h) => (plan ? [plan, ...h] : h).slice(0, 7));
    setPlan(p);
  }

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
          <div className="savestate"><span className="dot" /><span>Salvato in questo browser</span></div>
        </div>

        {tab === "settings" && <SettingsView settings={settings} setSettings={setSettings} />}
        {tab === "categories" && <CategoriesView categories={categories} setCategories={setCategories} catHue={catHue} />}
        {tab === "macros" && <MacrosView settings={settings} setSettings={setSettings} />}
        {tab === "recipes" && <RecipesView settings={settings} categories={categories} recipes={recipes} setRecipes={setRecipes} />}
        {tab === "plan" && (
          <PlanView
            settings={settings} categories={categories} recipes={recipes}
            plan={plan} setPlan={setPlan} history={history}
            catHue={catHue} onRegenerate={regenerate}
          />
        )}
      </main>
    </div>
  );
}
