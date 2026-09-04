"use client";
import { Fragment } from "react";
import { DAYS, MEAL_TYPES, MEAL_LABELS, clamp } from "../lib/data";

export default function SettingsView({ settings, setSettings }) {
  const splitTotal = MEAL_TYPES.reduce((s, mt) => s + (settings.mealSplit[mt] || 0), 0);
  const members = settings.members || [];

  function addMember() {
    setSettings((s) => ({ ...s, members: [...(s.members || []), { id: "m-" + Date.now(), name: "", dailyCalories: 2000 }] }));
  }
  function updateMember(id, patch) {
    setSettings((s) => ({ ...s, members: (s.members || []).map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
  }
  function removeMember(id) {
    setSettings((s) => ({ ...s, members: (s.members || []).filter((m) => m.id !== id) }));
  }

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
          <label className="field"><span>Il tuo nome</span>
            <input type="text" value={settings.ownerName || ""} onChange={(e) => setSettings((s) => ({ ...s, ownerName: e.target.value }))} />
          </label>
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

      <div className="panel">
        <h3>Famiglia</h3>
        <div className="sub">Persone per cui pianifichi insieme a te: condividono lo stesso piano settimanale (stessa categoria e ricetta per ogni pasto), ma le quantità degli ingredienti si ricalibrano sul target calorico di ciascuna. Le trovi come schede nella scheda Piano settimanale.</div>
        {members.length > 0 && (
          <div className="table-wrap" style={{ marginBottom: 12 }}>
            <table className="data">
              <thead><tr><th>Nome</th><th>Calorie giornaliere</th><th /></tr></thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td><input type="text" placeholder="Nome" value={m.name} onChange={(e) => updateMember(m.id, { name: e.target.value })} /></td>
                    <td><input type="number" className="narrow" min="800" max="6000" step="10" value={m.dailyCalories}
                      onChange={(e) => updateMember(m.id, { dailyCalories: clamp(parseInt(e.target.value, 10) || 0, 800, 6000) })} /></td>
                    <td className="row-actions"><button className="linklike" onClick={() => removeMember(m.id)}>Rimuovi</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button className="btn small ghost" onClick={addMember}>+ Aggiungi un membro</button>
      </div>
    </>
  );
}
