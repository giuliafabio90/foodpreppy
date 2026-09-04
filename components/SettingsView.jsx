"use client";
import { Fragment } from "react";
import { DAYS, MEAL_TYPES, MEAL_LABELS, clamp } from "../lib/data";

export default function SettingsView({ settings, setSettings }) {
  const splitTotal = MEAL_TYPES.reduce((s, mt) => s + (settings.mealSplit[mt] || 0), 0);

  const cols = ["colazione", "pranzo", "cena"];
  for (let i = 0; i < settings.spuntiniPerDay; i++) cols.push(`spuntino${i}`);

  // Ogni cella ha tre stati, in ciclo a ogni click:
  // pianificato (default) -> libero (mangi quello che vuoi) -> saltato (nessun pasto) -> pianificato.
  function cycleSlot(key) {
    setSettings((s) => {
      const skippedSlots = s.skippedSlots || [];
      const isFree = s.freeSlots.includes(key);
      const isSkipped = skippedSlots.includes(key);
      if (!isFree && !isSkipped) return { ...s, freeSlots: [...s.freeSlots, key] };
      if (isFree) return { ...s, freeSlots: s.freeSlots.filter((k) => k !== key), skippedSlots: [...skippedSlots, key] };
      return { ...s, skippedSlots: skippedSlots.filter((k) => k !== key) };
    });
  }

  return (
    <>
      <div className="panel">
        <h3>Obiettivo energetico</h3>
        <div className="sub">Il fabbisogno calorico giornaliero e come ripartirlo tra i pasti della giornata.</div>
        <div className="field-grid">
          <label className="field"><span>Calorie giornaliere</span>
            <div className="suffix-wrap">
              <input type="number" min="800" max="6000" step="10" value={settings.dailyCalories}
                onChange={(e) => setSettings((s) => ({ ...s, dailyCalories: clamp(parseInt(e.target.value, 10) || 0, 800, 6000) }))} />
              <span className="suffix">kcal</span>
            </div>
          </label>
          <label className="field"><span>Spuntini al giorno</span>
            <input type="number" min="0" max="3" step="1" value={settings.spuntiniPerDay}
              onChange={(e) => setSettings((s) => ({ ...s, spuntiniPerDay: clamp(parseInt(e.target.value, 10) || 0, 0, 3) }))} />
          </label>
        </div>

        <div className="split-row">
          {MEAL_TYPES.map((mt) => (
            <div className="split-item" key={mt}>
              <label className="field"><span>{MEAL_LABELS[mt]}</span>
                <div className="suffix-wrap">
                  <input type="number" min="0" max="100" step="1" value={settings.mealSplit[mt]}
                    onChange={(e) => setSettings((s) => ({ ...s, mealSplit: { ...s.mealSplit, [mt]: clamp(parseFloat(e.target.value) || 0, 0, 100) } }))} />
                  <span className="suffix">%</span>
                </div>
              </label>
            </div>
          ))}
        </div>
        <div className={"split-total " + (splitTotal === 100 ? "ok" : "bad")}>Totale: {splitTotal}% (deve fare 100%)</div>
      </div>

      <div className="panel">
        <h3>Pasti liberi e saltati</h3>
        <div className="sub">Clicca una cella per farla ciclare: pianificato &rarr; libero (mangi quello che vuoi, fuori schema) &rarr; saltato (nessun pasto) &rarr; pianificato.</div>
        <label className="field" style={{ maxWidth: 200 }}><span>Obiettivo pasti liberi / settimana</span>
          <input type="number" min="0" max="40" step="1" value={settings.freeMealsTarget}
            onChange={(e) => setSettings((s) => ({ ...s, freeMealsTarget: clamp(parseInt(e.target.value, 10) || 0, 0, 40) }))} />
        </label>

        <div className="picker-grid">
          <div className="ph" />
          {DAYS.map((d) => <div className="ph" key={d}>{d.slice(0, 3)}</div>)}
          {cols.map((col) => {
            const mt = col.startsWith("spuntino") ? "spuntino" : col;
            const idx = col.startsWith("spuntino") ? parseInt(col.replace("spuntino", ""), 10) : 0;
            const label = mt === "spuntino" ? `Spunt. ${idx + 1}` : MEAL_LABELS[mt];
            return (
              <Fragment key={col}>
                <div className="picker-rowlabel">{label}</div>
                {DAYS.map((day) => {
                  const key = `${day}|${mt}|${idx}`;
                  const isFree = settings.freeSlots.includes(key);
                  const isSkipped = (settings.skippedSlots || []).includes(key);
                  const label = isFree ? "Libero" : isSkipped ? "Saltato" : "·";
                  return (
                    <button type="button"
                      className={"picker-cell" + (isFree ? " on" : "") + (isSkipped ? " off" : "")}
                      key={col + "-" + day} onClick={() => cycleSlot(key)}>
                      {label}
                    </button>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
        <div className={"free-counter " + (settings.freeSlots.length === settings.freeMealsTarget ? "match" : "mismatch")}>
          {settings.freeSlots.length} liberi selezionati su un obiettivo di {settings.freeMealsTarget}
          {(settings.skippedSlots || []).length > 0 && <> &middot; {(settings.skippedSlots || []).length} saltati</>}
        </div>
      </div>
    </>
  );
}
