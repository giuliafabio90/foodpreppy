"use client";
import { MEAL_TYPES, MEAL_LABELS, clamp } from "../lib/data";

const FIELDS = [
  { key: "p", label: "Proteine %", color: "protein" },
  { key: "c", label: "Carboidrati %", color: "carbs" },
  { key: "f", label: "Grassi %", color: "fat" },
];

export default function MacrosView({ settings, setSettings }) {
  function updateRange(mt, key, bound, value) {
    setSettings((s) => {
      const cur = s.macroRanges[mt][key];
      let lo = bound === "lo" ? clamp(value, 0, 100) : cur[0];
      let hi = bound === "hi" ? clamp(value, 0, 100) : cur[1];
      if (hi < lo) hi = lo;
      return { ...s, macroRanges: { ...s.macroRanges, [mt]: { ...s.macroRanges[mt], [key]: [lo, hi] } } };
    });
  }

  return (
    <div className="panel">
      <h3>Range macro per pasto</h3>
      <div className="sub">Percentuale di calorie da proteine, carboidrati e grassi accettata per ciascun tipo di pasto. Le percentuali riflettono la composizione della ricetta e non cambiano quando la porzione viene ricalibrata.</div>
      {MEAL_TYPES.map((mt) => (
        <div className="range-row" key={mt}>
          <div className="mealname">{MEAL_LABELS[mt]}</div>
          {FIELDS.map((f) => {
            const range = settings.macroRanges[mt][f.key];
            return (
              <div key={f.key}>
                <span className="range-label" style={{ color: `var(--${f.color})` }}>{f.label}</span>
                <div className="range-fields">
                  <input type="number" min="0" max="100" value={range[0]}
                    onChange={(e) => updateRange(mt, f.key, "lo", parseFloat(e.target.value) || 0)} />
                  &ndash;
                  <input type="number" min="0" max="100" value={range[1]}
                    onChange={(e) => updateRange(mt, f.key, "hi", parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
