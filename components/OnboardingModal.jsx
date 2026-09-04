"use client";
import { useState } from "react";
import { clamp } from "../lib/data";

// Sequenza di popup mostrata una sola volta, al primo accesso dopo la
// registrazione: raccoglie nome e target calorico del titolare, poi
// chiede (facoltativo) se aggiungere altri membri della famiglia, ognuno
// con il proprio target calorico. Non tocca categorie/ricette/pasti
// liberi: quelli restano ai valori di default, modificabili dopo.
export default function OnboardingModal({ onComplete, t }) {
  const [step, setStep] = useState(1);
  const [ownerName, setOwnerName] = useState("");
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [members, setMembers] = useState([]);

  function addMember() {
    setMembers((m) => [...m, { id: "m-" + Date.now() + "-" + m.length, name: "", dailyCalories: 2000 }]);
  }
  function updateMember(id, patch) {
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  function removeMember(id) {
    setMembers((m) => m.filter((x) => x.id !== id));
  }

  function finish() {
    onComplete({
      ownerName: ownerName.trim(),
      dailyCalories,
      members: members.filter((m) => m.name.trim()).map((m) => ({ ...m, name: m.name.trim() })),
    });
  }

  const step1Valid = ownerName.trim().length > 0 && dailyCalories >= 800;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="onboarding-step">{t("Passo {n} di 2", { n: step })}</div>

        {step === 1 && (
          <>
            <h3>{t("Benvenuta/o")}</h3>
            <div className="sub">{t("Un paio di informazioni per impostare subito la Tabella Settimanale su misura per te. Puoi cambiare tutto in seguito dalle Impostazioni.")}</div>
            <div className="field-grid">
              <label className="field"><span>{t("Come ti chiami?")}</span>
                <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} autoFocus />
              </label>
              <label className="field"><span>{t("Calorie giornaliere")}</span>
                <div className="suffix-wrap">
                  <input type="number" min="800" max="6000" step="10" value={dailyCalories}
                    onChange={(e) => setDailyCalories(clamp(parseInt(e.target.value, 10) || 0, 800, 6000))} />
                  <span className="suffix">kcal</span>
                </div>
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn primary" disabled={!step1Valid} onClick={() => setStep(2)}>{t("Avanti")}</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3>{t("Funzione Family")}</h3>
            <div className="sub">
              {t("Pianifichi anche per altre persone? Aggiungile qui con il loro target calorico: condividono lo stesso piano settimanale (stessa categoria e ricetta per ogni pasto), ma le quantità degli ingredienti si ricalibrano sul target di ciascuno. Puoi aggiungerle o toglierle quando vuoi, anche più avanti.")}
            </div>

            {members.length > 0 && (
              <div className="table-wrap" style={{ marginBottom: 12 }}>
                <table className="data">
                  <thead><tr><th>{t("Nome")}</th><th>{t("Calorie giornaliere")}</th><th /></tr></thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id}>
                        <td><input type="text" placeholder={t("Nome")} value={m.name} onChange={(e) => updateMember(m.id, { name: e.target.value })} /></td>
                        <td><input type="number" className="narrow" min="800" max="6000" step="10" value={m.dailyCalories}
                          onChange={(e) => updateMember(m.id, { dailyCalories: clamp(parseInt(e.target.value, 10) || 0, 800, 6000) })} /></td>
                        <td className="row-actions"><button className="linklike" onClick={() => removeMember(m.id)}>{t("Rimuovi")}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button className="btn small ghost" onClick={addMember}>{t("+ Aggiungi un membro")}</button>

            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setStep(1)}>{t("Indietro")}</button>
              <button className="btn primary" onClick={finish}>
                {members.filter((m) => m.name.trim()).length > 0 ? t("Fine, inizia a pianificare") : t("Salta, inizia a pianificare")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
