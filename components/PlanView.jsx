"use client";
import { Fragment, useState } from "react";
import { DAYS, MEAL_LABELS, hueColor, rerollMeal, selectMealRecipe, swapDays, ingredientsGrouped, planForCalories } from "../lib/data";
import MealPickerModal from "./MealPickerModal";
import RecipeDetailModal from "./RecipeDetailModal";

function macroBar(pct) {
  return (
    <div className="macro-bar" title={`P ${pct.p}% / C ${pct.c}% / G ${pct.f}%`}>
      <span style={{ width: pct.p + "%", background: "var(--protein)" }} />
      <span style={{ width: pct.c + "%", background: "var(--carbs)" }} />
      <span style={{ width: pct.f + "%", background: "var(--fat)" }} />
    </div>
  );
}

export default function PlanView({ settings, categories, recipes, setRecipes, plan, setPlan, history, catHue, onRegenerate, onSaveToHistory, t }) {
  const [picker, setPicker] = useState(null); // {day, mt, idx} | null
  const [openRecipeId, setOpenRecipeId] = useState(null);
  const [memberId, setMemberId] = useState(null); // null = titolare dell'account
  const groups = ingredientsGrouped(categories);
  const members = settings.members || [];
  const selectedMember = memberId ? members.find((m) => m.id === memberId) : null;
  const viewCalories = selectedMember ? selectedMember.dailyCalories : settings.dailyCalories;
  const locale = settings.language === "en" ? "en-US" : "it-IT";
  // Stessa struttura del piano (categoria/ricetta per pasto), quantita
  // ricalcolate per la persona selezionata: non tocca il piano reale.
  const viewPlan = selectedMember ? planForCalories(plan, settings, recipes, selectedMember.dailyCalories) : plan;

  function catById(id) { return categories.find((c) => c.id === id); }
  function recipeById(id) { return recipes.find((r) => r.id === id); }

  function handleReroll(day, mt, idx) {
    setPlan((p) => rerollMeal(settings, recipes, p, day, mt, idx));
  }
  function handleSwapDays(dayA, dayB) {
    setPlan((p) => swapDays(p, dayA, dayB));
  }
  function handlePick(recipeId) {
    if (!picker) return;
    setPlan((p) => selectMealRecipe(settings, recipes, p, picker.day, picker.mt, picker.idx, recipeId));
    setPicker(null);
  }

  const mealRows = ["colazione", "pranzo", "cena"];
  for (let i = 0; i < settings.spuntiniPerDay; i++) mealRows.push(`spuntino${i}`);

  let totalKcal = 0, freeCount = 0, skippedCount = 0, plannedCount = 0, inRangeCount = 0;
  if (viewPlan) {
    viewPlan.days.forEach((d) => d.meals.forEach((m) => {
      if (m.free) { freeCount++; return; }
      if (m.skipped) { skippedCount++; return; }
      if (m.kcal) { totalKcal += m.kcal; plannedCount++; if (m.inRange) inRangeCount++; }
    }));
  }
  const avgDaily = viewPlan ? Math.round(totalKcal / 7) : 0;
  const totalSlots = 7 * (3 + settings.spuntiniPerDay) - skippedCount;

  const pickerEntry = picker && plan
    ? plan.days.find((d) => d.day === picker.day).meals.find((m) => m.mealType === picker.mt && m.idx === picker.idx)
    : null;

  return (
    <>
      <div className="panel">
        <div className="plan-actions">
          <button className="btn primary" onClick={onRegenerate}>{t("Genera nuovo piano")}</button>
          <button className="btn ghost" disabled={!plan} onClick={onSaveToHistory}>{t("Salva piano")}</button>
          <button className="btn ghost" disabled={!plan} onClick={() => window.print()}>{t("Stampa")}</button>
          {plan && plan.createdAt && (
            <span className="plan-meta">
              {t("Generato il {d} alle {t}", {
                d: new Date(plan.createdAt).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }),
                t: new Date(plan.createdAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
              })}
            </span>
          )}
        </div>

        {members.length > 0 && (
          <div className="member-switch">
            <button className={"member-chip" + (!memberId ? " active" : "")} onClick={() => setMemberId(null)}>
              {settings.ownerName || t("Tu")} <span className="member-kcal">{settings.dailyCalories} kcal</span>
            </button>
            {members.map((m) => (
              <button key={m.id} className={"member-chip" + (memberId === m.id ? " active" : "")} onClick={() => setMemberId(m.id)}>
                {m.name} <span className="member-kcal">{m.dailyCalories} kcal</span>
              </button>
            ))}
          </div>
        )}

        {plan && plan.warnings && plan.warnings.length > 0 && (
          <div className="warn-box">
            <h4>{t("Da controllare")}</h4>
            <ul>{plan.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>
        )}

        {!plan && <div className="empty-note">{t("Nessun piano generato. Premi \"Genera nuovo piano\".")}</div>}

        {plan && (
          <div className="grid-wrap">
            <div className="week-grid">
              <div className="gcell head" />
              {DAYS.map((day) => (
                <div className="gcell head day-head" key={day}>
                  <span>{t(day)}</span>
                  <select className="day-swap-select" value="" onChange={(e) => { if (e.target.value) handleSwapDays(day, e.target.value); }}>
                    <option value="">{t("↔ scambia")}</option>
                    {DAYS.filter((d) => d !== day).map((d) => <option value={d} key={d}>{t(d)}</option>)}
                  </select>
                </div>
              ))}

              {mealRows.map((rowKey) => {
                const mt = rowKey.startsWith("spuntino") ? "spuntino" : rowKey;
                const idx = rowKey.startsWith("spuntino") ? parseInt(rowKey.replace("spuntino", ""), 10) : 0;
                const label = mt === "spuntino" ? t("Spuntino {n}", { n: idx + 1 }) : t(MEAL_LABELS[mt]);
                return (
                  <Fragment key={rowKey}>
                    <div className="gcell rowlabel">{label}</div>
                    {DAYS.map((day) => {
                      const dayObj = viewPlan.days.find((d) => d.day === day);
                      const entry = dayObj ? dayObj.meals.find((m) => m.mealType === mt && m.idx === idx) : null;
                      return (
                        <Cell
                          key={rowKey + "-" + day}
                          day={day} mt={mt} idx={idx} entry={entry}
                          catById={catById} recipeById={recipeById} catHue={catHue}
                          onReroll={handleReroll}
                          onOpenPicker={() => setPicker({ day, mt, idx })}
                          onOpenRecipe={setOpenRecipeId}
                          t={t}
                        />
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          </div>
        )}

        {plan && (
          <div className="stat-row">
            <Stat label={t("Media kcal / giorno")} value={avgDaily} small={t("kcal (target {n})", { n: viewCalories })} />
            <Stat label={t("Pasti pianificati")} value={plannedCount} small={t("su {n} totali", { n: totalSlots })} />
            <Stat label={t("Pasti liberi")} value={freeCount} small={t("nella settimana")} />
            <Stat label={t("Pasti saltati")} value={skippedCount} small={t("nella settimana")} />
            <Stat label={t("In range macro")} value={plannedCount ? Math.round((inRangeCount / plannedCount) * 100) : 0} small={t("% dei pasti pianificati")} />
          </div>
        )}

        {plan && (
          <div className="table-wrap" style={{ marginTop: 20 }}>
            <table className="data">
              <thead><tr><th>{t("Categoria")}</th><th>{t("Richieste")}</th><th>{t("Pianificate")}</th></tr></thead>
              <tbody>
                {categories.filter((c) => c.weeklyFrequency > 0).map((c) => {
                  let count = 0;
                  plan.days.forEach((d) => d.meals.forEach((m) => { if (!m.free && m.categoryId === c.id) count++; }));
                  const ok = count === c.weeklyFrequency;
                  return (
                    <tr key={c.id}>
                      <td><span className="hue-dot" style={{ background: hueColor(catHue, c.id, 45) }} />{c.name}</td>
                      <td className="mono">{c.weeklyFrequency}</td>
                      <td className="mono">{count}{!ok && <span className="badge warn" style={{ marginLeft: 6 }}>{t("scostamento")}</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h3>{t("Piani precedenti")}</h3>
        <div className="history-list">
          {history.length === 0 && <div className="empty-note">{t("Nessun piano precedente in questa sessione di modifiche.")}</div>}
          {history.map((p, i) => (
            <div className="history-item" key={p.createdAt + i}>
              <span className="d">
                {new Date(p.createdAt).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}{" "}
                &middot; {new Date(p.createdAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {picker && pickerEntry && (
        <MealPickerModal
          mt={picker.mt}
          mealLabel={picker.mt === "spuntino" ? t("Spuntino {n}", { n: picker.idx + 1 }) : t(MEAL_LABELS[picker.mt])}
          currentCategoryId={pickerEntry.categoryId}
          currentRecipeId={pickerEntry.recipeId}
          categories={categories}
          recipes={recipes}
          catHue={catHue}
          onPick={handlePick}
          onClose={() => setPicker(null)}
          t={t}
        />
      )}
      {openRecipeId && (
        <RecipeDetailModal recipe={recipeById(openRecipeId)} categories={categories} groups={groups} setRecipes={setRecipes}
          onClose={() => setOpenRecipeId(null)} t={t} />
      )}
    </>
  );
}

function Stat({ label, value, small }) {
  return (
    <div className="stat-tile">
      <div className="label">{label}</div>
      <div className="value num">{value} <small>{small}</small></div>
    </div>
  );
}

function Cell({ day, mt, idx, entry, catById, recipeById, catHue, onReroll, onOpenPicker, onOpenRecipe, t }) {
  if (!entry) return <div className="gcell meal-cell free"><span className="free-tag">&mdash;</span></div>;
  if (entry.skipped) return <div className="gcell meal-cell skipped"><span className="free-tag">{t("Pasto saltato")}</span></div>;
  if (entry.free) return <div className="gcell meal-cell free"><span className="free-tag">{t("Pasto libero")}</span></div>;

  if (entry.unassigned) {
    return (
      <div className="gcell meal-cell">
        <span className="badge warn">{t("Nessuna categoria")}</span>
        <div className="empty-note">{t("Nessuna categoria assegnata a questo slot.")}</div>
        <div className="cellctrl"><button className="linklike" onClick={onOpenPicker}>{t("Selezione manuale")}</button></div>
      </div>
    );
  }

  const cat = catById(entry.categoryId);
  const catName = cat ? cat.name : t("Categoria eliminata");
  const head = (
    <div className="cat-tag"><span className="hue-dot" style={{ background: hueColor(catHue, entry.categoryId, 45) }} />{catName}</div>
  );

  if (entry.noRecipe) {
    return (
      <div className="gcell meal-cell">
        {head}
        <span className="badge warn">{t("Nessuna ricetta")}</span>
        <div className="empty-note">{t("Aggiungi una ricetta per questa categoria e pasto.")}</div>
        <div className="cellctrl"><button className="linklike" onClick={onOpenPicker}>{t("Selezione manuale")}</button></div>
      </div>
    );
  }

  const recipe = recipeById(entry.recipeId);
  const recName = recipe ? recipe.name : t("Ricetta eliminata");

  return (
    <div className="gcell meal-cell">
      {head}
      <div className="recipe-name">
        {recipe ? <button className="linklike recipe-name-btn" onClick={() => onOpenRecipe(recipe.id)}>{recName}</button> : recName}
      </div>
      {entry.ingredients && entry.ingredients.length > 0 && (
        <ul className="ing-mini">
          {entry.ingredients.map((ing, i) => (
            <li key={i}><span>{ing.name}</span><span className="g">{ing.grams} g</span></li>
          ))}
        </ul>
      )}
      <div className="kcal-line">{entry.kcal} kcal</div>
      {macroBar({ p: entry.pPct, c: entry.cPct, f: entry.fPct })}
      <span className={"badge " + (entry.inRange ? "good" : "bad")}>{entry.inRange ? t("In range") : t("Fuori range")}</span>
      <div className="cellctrl">
        <button className="linklike" onClick={() => onReroll(day, mt, idx)}>{t("Nuova ricetta")}</button>
        <button className="linklike" onClick={onOpenPicker}>{t("Selezione manuale")}</button>
      </div>
    </div>
  );
}
