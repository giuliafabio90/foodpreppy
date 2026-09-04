// i18n minimale: l'italiano e' la lingua "sorgente" (le stringhe nel
// codice SONO il testo italiano), l'inglese e' una mappa italiano-> inglese.
// t(str) restituisce la traduzione se esiste ed e' selezionato l'inglese,
// altrimenti la stringa originale. Le parti dinamiche usano segnaposto
// tipo {name}, sostituiti dopo la traduzione.
export const EN = {
  // Giorni
  "Lunedi": "Monday", "Martedi": "Tuesday", "Mercoledi": "Wednesday", "Giovedi": "Thursday",
  "Venerdi": "Friday", "Sabato": "Saturday", "Domenica": "Sunday",
  "Tu": "You",
  "Spuntino {n}": "Snack {n}",

  // App / navigazione
  "Nutrizione · Ricette": "Nutrition · Recipes",
  "Tabella": "Weekly",
  "Settimanale": "Table",
  "Impostazioni": "Settings",
  "Categorie": "Categories",
  "Macro per pasto": "Macros per meal",
  "Ricette": "Recipes",
  "Piano settimanale": "Weekly plan",
  "Esci": "Sign out",
  "Caricamento…": "Loading…",
  "Caricamento dati…": "Loading data…",
  "Salvataggio…": "Saving…",
  "Errore di salvataggio": "Save error",
  "Sincronizzato": "Synced",

  // Login / registrazione
  "Accedi per salvare impostazioni, categorie, ricette e piani: li ritrovi ad ogni accesso, da qualsiasi dispositivo.":
    "Sign in to save your settings, categories, recipes and plans: find them again on any device.",
  "Email": "Email",
  "Password": "Password",
  "Conferma password": "Confirm password",
  "Un momento…": "One moment…",
  "Crea account": "Create account",
  "Accedi": "Sign in",
  "Non hai un account? Registrati": "Don't have an account? Sign up",
  "Hai già un account? Accedi": "Already have an account? Sign in",
  "Inserisci un'email valida.": "Enter a valid email.",
  "La password deve avere almeno 8 caratteri.": "Password must be at least 8 characters.",
  "Le due password non coincidono.": "The two passwords don't match.",
  "Email o password errati.": "Wrong email or password.",
  "Errore di rete. Riprova.": "Network error. Try again.",
  "Registrazione non riuscita.": "Registration failed.",

  // Onboarding
  "Passo {n} di 2": "Step {n} of 2",
  "Benvenuta/o": "Welcome",
  "Un paio di informazioni per impostare subito la Tabella Settimanale su misura per te. Puoi cambiare tutto in seguito dalle Impostazioni.":
    "A couple of details to set up your Weekly Table right away. You can change everything later in Settings.",
  "Come ti chiami?": "What's your name?",
  "Calorie giornaliere": "Daily calories",
  "Avanti": "Next",
  "Funzione Family": "Family feature",
  "Pianifichi anche per altre persone? Aggiungile qui con il loro target calorico: condividono lo stesso piano settimanale (stessa categoria e ricetta per ogni pasto), ma le quantità degli ingredienti si ricalibrano sul target di ciascuno. Puoi aggiungerle o toglierle quando vuoi, anche più avanti.":
    "Planning for other people too? Add them here with their own calorie target: they share the same weekly plan (same category and recipe per meal), but ingredient amounts are recalibrated to each person's target. You can add or remove them any time, later too.",
  "Nome": "Name",
  "Rimuovi": "Remove",
  "+ Aggiungi un membro": "+ Add a member",
  "Indietro": "Back",
  "Fine, inizia a pianificare": "Done, start planning",
  "Salta, inizia a pianificare": "Skip, start planning",

  // Impostazioni
  "Obiettivo energetico": "Energy target",
  "Il fabbisogno calorico giornaliero e come ripartirlo tra i pasti della giornata.": "Your daily calorie needs and how to split them across the day's meals.",
  "Il tuo nome": "Your name",
  "Spuntini al giorno": "Snacks per day",
  "Colazione": "Breakfast",
  "Pranzo": "Lunch",
  "Cena": "Dinner",
  "Spuntino": "Snack",
  "Totale: {n}% (deve fare 100%)": "Total: {n}% (must add up to 100%)",
  "Pasti liberi e saltati": "Free & skipped meals",
  "Clicca una cella per farla ciclare: pianificato → libero (mangi quello che vuoi, fuori schema) → saltato (nessun pasto) → pianificato.":
    "Click a cell to cycle it: planned → free (eat whatever, off-plan) → skipped (no meal) → planned.",
  "Obiettivo pasti liberi / settimana": "Free-meal target / week",
  "{n} liberi selezionati su un obiettivo di {t}": "{n} free selected out of a target of {t}",
  "{n} saltati": "{n} skipped",
  "Famiglia": "Family",
  "Persone per cui pianifichi insieme a te: condividono lo stesso piano settimanale (stessa categoria e ricetta per ogni pasto), ma le quantità degli ingredienti si ricalibrano sul target calorico di ciascuna. Le trovi come schede nella scheda Piano settimanale.":
    "People you plan for alongside yourself: they share the same weekly plan (same category and recipe per meal), but ingredient amounts recalibrate to each person's own calorie target. You'll find them as tabs in the Weekly plan tab.",

  // Categorie
  "Categorie alimentari": "Food categories",
  "Quante volte a settimana vuoi ciascuna categoria e in quali pasti puo comparire. Frequenza 0 = disponibile ma non pianificata automaticamente.":
    "How many times a week you want each category and which meals it can appear in. Frequency 0 = available but not auto-planned.",
  "Categoria": "Category",
  "Volte / sett.": "Times / wk.",
  "Spunt.": "Snack",
  "Libero": "Free",
  "Saltato": "Skipped",
  "+ Nuova categoria": "+ New category",
  "Nuova categoria": "New category",
  "Elimina": "Delete",
  "Confermi?": "Confirm?",

  // Macro
  "Range macro per pasto": "Macro ranges per meal",
  "Percentuale di calorie da proteine, carboidrati e grassi accettata per ciascun tipo di pasto. Le percentuali riflettono la composizione della ricetta e non cambiano quando la porzione viene ricalibrata.":
    "Accepted percentage of calories from protein, carbs and fat for each meal type. Percentages reflect the recipe's composition and don't change when the portion is recalibrated.",
  "Proteine %": "Protein %",
  "Carboidrati %": "Carbs %",
  "Grassi %": "Fat %",

  // Ricettario
  "Ricettario": "Recipe book",
  "Incolla il link di una ricetta, oppure il testo della ricetta copiato da qualsiasi fonte (nome + elenco ingredienti), e premi Importa: provo a leggere ingredienti e pesi, poi ti chiedo nome, categoria e pasto. Il link funziona sui siti che pubblicano i dati strutturati della ricetta; se un sito blocca le richieste automatiche o non ha questi dati, incolla direttamente il testo, carica un file di testo (anche con più ricette insieme), oppure aggiungila a mano con \"+ Nuova ricetta\" qui sotto.":
    "Paste a recipe link, or the recipe text copied from anywhere (name + ingredient list), and press Import: I'll try to read ingredients and weights, then ask for name, category and meal. The link works on sites that publish structured recipe data; if a site blocks automated requests or has no such data, paste the text directly, upload a text file (even with several recipes in it), or add it by hand with \"+ New recipe\" below.",
  "Incolla qui il link della ricetta, oppure il testo (nome + ingredienti)…": "Paste the recipe link here, or the text (name + ingredients)…",
  "Importazione…": "Importing…",
  "Importa": "Import",
  "Carica da file di testo…": "Upload a text file…",
  "Import non riuscito": "Import failed",
  "Nessuna ricetta ancora. Importane una dal link o aggiungine una qui sotto.": "No recipes yet. Import one from a link or add one below.",
  "Senza categoria valida": "No valid category",
  "+ Nuova ricetta": "+ New recipe",
  "Nome ricetta": "Recipe name",
  "Link ricetta esterna": "External recipe link",
  "Apri ricetta originale ↗": "Open original recipe ↗",
  "Pasti": "Meals",
  "Col": "Bfst", "Pra": "Lun", "Cen": "Din", "Spu": "Snk",
  "Ingrediente": "Ingredient",
  "Peso (g)": "Weight (g)",
  "Kcal": "Kcal",
  "Prot g": "Prot g",
  "Carb g": "Carb g",
  "Grassi g": "Fat g",
  "Fisso": "Locked",
  "Non scalare questo ingrediente quando si ricalibra": "Don't scale this ingredient when recalibrating",
  "Mantieni fisso in fase di ricalibro": "Keep fixed when recalibrating",
  "Testo letto dal sito": "Text read from the site",
  "— non riconosciuto: scegli —": "— not recognized: choose —",
  "— nessuno —": "— none —",
  "Nessun ingrediente. Aggiungine uno.": "No ingredients. Add one.",
  "+ Ingrediente": "+ Ingredient",
  "{n} kcal totali porzione · P {p}g · C {c}g · G {f}g": "{n} kcal total portion · P {p}g · C {c}g · F {f}g",
  "kcal totali porzione": "kcal total portion",
  "Preparazione (un passaggio per riga)": "Preparation (one step per line)",
  "Elimina ricetta": "Delete recipe",
  "Chiudi": "Close",
  "Stampa": "Print",

  // Import popup
  "Importa ricetta": "Import recipe",
  " (altre {n} in coda)": " ({n} more queued)",
  "Ho letto gli ingredienti e li ho abbinati al database nutrizionale come meglio potevo. Controlla e correggi quello che serve, scegli categoria e pasto, poi premi Ricalibra per adattare le quantità al tetto calorico del pasto scelto (gli ingredienti con la spunta \"Fisso\" non vengono toccati). Conferma quando i numeri ti convincono.":
    "I read the ingredients and matched them to the nutrition database as best I could. Check and fix whatever's needed, choose category and meal, then press Recalibrate to fit the quantities to the chosen meal's calorie ceiling (ingredients marked \"Locked\" are left untouched). Confirm once the numbers look right.",
  "Categoria alimentare": "Food category",
  "— scegli —": "— choose —",
  "scegli": "choose",
  "A quale pasto appartiene": "Which meal it belongs to",
  "Da controllare": "To check",
  "{n} ingredienti non riconosciuti automaticamente: scegli l'alimento corrispondente prima di confermare (o eliminali se non servono).":
    "{n} ingredients not recognized automatically: pick the matching food before confirming (or remove them if not needed).",
  "kcal totali porzione, prima del ricalibro sul pasto scelto": "kcal total portion, before recalibrating to the chosen meal",
  "Ricalibra sul pasto scelto": "Recalibrate to chosen meal",
  "Scegli almeno un pasto per calcolare il tetto calorico": "Choose at least one meal to calculate the calorie ceiling",
  "Annulla": "Cancel",
  "Salta questa ricetta": "Skip this recipe",
  "Conferma e aggiungi": "Confirm and add",

  // File multi-ricetta
  "Ricette trovate nel file": "Recipes found in the file",
  "Ho trovato {n} ricette in questo file. Deseleziona quelle che non vuoi importare, poi procedi: te le farò confermare una alla volta, come per un import singolo.":
    "I found {n} recipes in this file. Uncheck the ones you don't want to import, then continue: I'll have you confirm them one at a time, like a single import.",
  "{n} ingredienti": "{n} ingredients",
  "Ricetta {n} (senza nome)": "Recipe {n} (unnamed)",
  "Continua con {n} ricett{s}": "Continue with {n} recipe{s}",

  // Dettaglio ricetta / picker
  "Nessuna ricetta disponibile in questa categoria per {m}.": "No recipe available in this category for {m}.",
  "Tutte le categorie": "All categories",
  "Cerca per nome": "Search by name",
  "Digita per cercare…": "Type to search…",
  "Selezione manuale — {m}": "Manual selection — {m}",
  "Scegli una categoria (o lascia \"Tutte\") e poi la ricetta da usare per questo pasto.": "Choose a category (or leave \"All\") and then the recipe to use for this meal.",
  "selezionata": "selected",

  // Piano settimanale
  "Genera nuovo piano": "Generate new plan",
  "Salva piano": "Save plan",
  "Generato il {d} alle {t}": "Generated on {d} at {t}",
  "Da controllare": "To check",
  "Nessun piano generato. Premi \"Genera nuovo piano\".": "No plan generated. Press \"Generate new plan\".",
  "↔ scambia": "↔ swap",
  "Pasto saltato": "Skipped meal",
  "Pasto libero": "Free meal",
  "Nessuna categoria": "No category",
  "Nessuna categoria assegnata a questo slot.": "No category assigned to this slot.",
  "Selezione manuale": "Manual selection",
  "Categoria eliminata": "Deleted category",
  "Nessuna ricetta": "No recipe",
  "Aggiungi una ricetta per questa categoria e pasto.": "Add a recipe for this category and meal.",
  "Ricetta eliminata": "Deleted recipe",
  "Nuova ricetta": "New recipe",
  "In range": "In range",
  "Fuori range": "Out of range",
  "Media kcal / giorno": "Avg kcal / day",
  "kcal (target {n})": "kcal (target {n})",
  "Pasti pianificati": "Planned meals",
  "su {n} totali": "of {n} total",
  "Pasti liberi": "Free meals",
  "nella settimana": "this week",
  "Pasti saltati": "Skipped meals",
  "In range macro": "In macro range",
  "% dei pasti pianificati": "% of planned meals",
  "Richieste": "Requested",
  "Pianificate": "Planned",
  "scostamento": "off target",
  "Piani precedenti": "Previous plans",
  "Nessun piano precedente in questa sessione di modifiche.": "No previous plans in this session.",
  "Visualizza": "View",

  // Avvisi generazione piano (lib/data.js)
  "Hai selezionato {n} pasti liberi ma l'obiettivo e {target}.": "You selected {n} free meals but the target is {target}.",
  "{n} pasti richiesti non hanno trovato uno slot compatibile libero: {list}.": "{n} requested meals found no compatible free slot: {list}.",
  "{n} pasti sono rimasti senza categoria assegnata: aumenta le frequenze delle categorie compatibili o riduci i pasti liberi.":
    "{n} meals were left without an assigned category: increase the frequency of compatible categories or reduce free meals.",
  "Nessuna ricetta disponibile per: {list}. Aggiungi ricette in quella categoria/pasto nella sezione Ricette.":
    "No recipe available for: {list}. Add recipes for that category/meal in the Recipes section.",
};

export function makeT(language) {
  const active = language === "en";
  return function t(str, vars) {
    let out = active && EN[str] !== undefined ? EN[str] : str;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        out = out.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return out;
  };
}
