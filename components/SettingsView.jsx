"use client";
import { Fragment } from "react";
import { DAYS, MEAL_TYPES, MEAL_LABELS, clamp } from "../lib/data";

export default function SettingsView({ settings, setSettings }) {
  const splitTotal = MEAL_TYPES.reduce((s, mt) => s + (settings.mealSplit[mt] || 0), 0);

  const cols = ["colazione", "pranzo", "cena"];
  for (let i = 0; i < settings.spuntiniPerDay; i++) cols.push(`spuntino${i}`);

  function toggleFreeSlot(key) {
    setSettings((s) => {
      const has = s.freeSlots.includes(key);
      return { ...s, freeSlots: has ? s.freeSlots.filter((k) => k !== key) : [...s.freeSlots, key] };
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
        <h3>Pasti liberi</h3>
        <div className="sub">Quanti pasti a settimana vuoi lasciare fuori dallo schema, e in quali slot esatti.</div>
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
                  const on = settings.freeSlots.includes(key);
                  return (
                    <label className={"picker-cell" + (on ? " on" : "")} key={col + "-" + day}>
                      <input type="checkbox" checked={on} onChange={() => toggleFreeSlot(key)} />
                      {on ? "Libero" : "·"}
                    </label>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
        <div className={"free-counter " + (settings.freeSlots.length === settings.freeMealsTarget ? "match" : "mismatch")}>
          {settings.freeSlots.length} selezionati su un obiettivo di {settings.freeMealsTarget}
        </div>
      </div>
    </>
  );
}
