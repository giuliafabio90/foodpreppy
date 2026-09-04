// Costanti e logica pura del pianificatore: nessun accesso al DOM qui,
// cosi la stessa logica e testabile e riusabile dai componenti React.

export const DAYS = ["Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato", "Domenica"];
export const MEAL_TYPES = ["colazione", "pranzo", "cena", "spuntino"];
export const MEAL_LABELS = { colazione: "Colazione", pranzo: "Pranzo", cena: "Cena", spuntino: "Spuntino" };
export const MEAL_SHORT = { colazione: "Col", pranzo: "Pra", cena: "Cen", spuntino: "Spu" };
export const PALETTE_HUES = [8, 150, 28, 200, 95, 340, 45, 280, 190, 50, 320, 120, 33, 60, 250, 10];

export const DEFAULT_CATEGORIES = [
  { id: "carne-rossa", name: "Carne rossa", weeklyFrequency: 2, meals: ["pranzo", "cena"] },
  { id: "carne-bianca", name: "Carne bianca", weeklyFrequency: 3, meals: ["pranzo", "cena"] },
  { id: "pesce", name: "Pesce", weeklyFrequency: 3, meals: ["pranzo", "cena"] },
  { id: "frutti-mare", name: "Frutti di mare", weeklyFrequency: 1, meals: ["pranzo", "cena"] },
  { id: "legumi", name: "Legumi", weeklyFrequency: 3, meals: ["pranzo", "cena"] },
  { id: "pasta", name: "Pasta", weeklyFrequency: 4, meals: ["pranzo", "cena"] },
  { id: "riso", name: "Riso", weeklyFrequency: 2, meals: ["pranzo", "cena"] },
  { id: "altri-cereali", name: "Altri cereali (farro, orzo, quinoa, avena)", weeklyFrequency: 2, meals: ["colazione", "pranzo", "cena"] },
  { id: "uova", name: "Uova", weeklyFrequency: 3, meals: ["colazione", "pranzo", "cena"] },
  { id: "frutta-secca", name: "Frutta secca", weeklyFrequency: 7, meals: ["colazione", "spuntino"] },
  { id: "frutta", name: "Frutta", weeklyFrequency: 7, meals: ["colazione", "spuntino"] },
  { id: "verdura", name: "Verdura", weeklyFrequency: 14, meals: ["pranzo", "cena"] },
  { id: "latticini", name: "Latticini e formaggi", weeklyFrequency: 5, meals: ["colazione", "spuntino"] },
  { id: "tuberi", name: "Tuberi (patate, ecc.)", weeklyFrequency: 2, meals: ["pranzo", "cena"] },
  { id: "grassi", name: "Grassi e condimenti", weeklyFrequency: 0, meals: ["colazione", "pranzo", "cena", "spuntino"] },
  { id: "dolci", name: "Dolci e snack", weeklyFrequency: 0, meals: ["spuntino"] },
];

export const DEFAULT_MACRO_RANGES = {
  colazione: { p: [15, 25], c: [45, 60], f: [20, 30] },
  pranzo: { p: [25, 35], c: [35, 50], f: [20, 30] },
  cena: { p: [30, 40], c: [25, 40], f: [20, 30] },
  spuntino: { p: [15, 30], c: [30, 50], f: [20, 40] },
};

export const DEFAULT_SETTINGS = {
  dailyCalories: 2000,
  mealSplit: { colazione: 20, pranzo: 35, cena: 35, spuntino: 10 },
  spuntiniPerDay: 1,
  freeMealsTarget: 2,
  freeSlots: ["Sabato|cena|0", "Domenica|pranzo|0"],
  skippedSlots: [],
  macroRanges: DEFAULT_MACRO_RANGES,
};

// Database nutrizionale integrato (valori medi per 100 g, fonti tipo CREA/INRAN).
// L'app non puo leggere il contenuto della pagina esterna incollata come link
// (limite di sicurezza del browser): il link resta un riferimento cliccabile,
// le calorie/macro si calcolano sempre da qui.
export const INGREDIENT_DB = [
  { id: "manzo-magro", name: "Manzo magro (fesa)", categoryId: "carne-rossa", kcal100: 106, protein100: 21.8, carbs100: 0, fat100: 2.1, aliases: ["beef", "lean beef"] },
  { id: "vitello", name: "Vitello (fesa)", categoryId: "carne-rossa", kcal100: 107, protein100: 21.3, carbs100: 0, fat100: 2.2, aliases: ["veal"] },
  { id: "maiale-lonza", name: "Maiale (lonza)", categoryId: "carne-rossa", kcal100: 121, protein100: 21.3, carbs100: 0, fat100: 3.8, aliases: ["pork", "pork loin"] },
  { id: "macinato-manzo", name: "Manzo macinato magro", categoryId: "carne-rossa", kcal100: 137, protein100: 20.0, carbs100: 0, fat100: 6.0, aliases: ["ground beef", "minced beef"] },
  { id: "pollo-petto", name: "Pollo (petto)", categoryId: "carne-bianca", kcal100: 100, protein100: 23.0, carbs100: 0, fat100: 1.0, aliases: ["chicken breast", "chicken breasts", "chicken"] },
  { id: "pollo-coscia", name: "Pollo (coscia, senza pelle)", categoryId: "carne-bianca", kcal100: 119, protein100: 20.0, carbs100: 0, fat100: 4.0, aliases: ["chicken thigh", "chicken thighs"] },
  { id: "tacchino-petto", name: "Tacchino (petto)", categoryId: "carne-bianca", kcal100: 98, protein100: 22.5, carbs100: 0, fat100: 0.7, aliases: ["turkey", "turkey breast"] },
  { id: "coniglio", name: "Coniglio", categoryId: "carne-bianca", kcal100: 118, protein100: 21.0, carbs100: 0, fat100: 3.5, aliases: ["rabbit"] },
  { id: "merluzzo", name: "Merluzzo / nasello", categoryId: "pesce", kcal100: 82, protein100: 17.8, carbs100: 0, fat100: 0.7, aliases: ["cod", "hake"] },
  { id: "salmone", name: "Salmone", categoryId: "pesce", kcal100: 208, protein100: 20.0, carbs100: 0, fat100: 13.6, aliases: ["salmon"] },
  { id: "tonno-fresco", name: "Tonno fresco", categoryId: "pesce", kcal100: 144, protein100: 23.5, carbs100: 0, fat100: 4.9, aliases: ["tuna"] },
  { id: "orata", name: "Orata / branzino", categoryId: "pesce", kcal100: 100, protein100: 20.0, carbs100: 0, fat100: 2.0, aliases: ["sea bream", "sea bass"] },
  { id: "sgombro", name: "Sgombro", categoryId: "pesce", kcal100: 205, protein100: 19.0, carbs100: 0, fat100: 14.0, aliases: ["mackerel"] },
  { id: "gamberi", name: "Gamberi", categoryId: "frutti-mare", kcal100: 71, protein100: 13.6, carbs100: 1.5, fat100: 1.4, aliases: ["shrimp", "prawns"] },
  { id: "cozze-vongole", name: "Cozze / vongole (polpa)", categoryId: "frutti-mare", kcal100: 84, protein100: 12.0, carbs100: 3.4, fat100: 2.0, aliases: ["mussels", "clams"] },
  { id: "calamari", name: "Calamari", categoryId: "frutti-mare", kcal100: 68, protein100: 14.9, carbs100: 1.2, fat100: 0.9, aliases: ["squid"] },
  { id: "ceci", name: "Ceci (cotti)", categoryId: "legumi", kcal100: 139, protein100: 8.9, carbs100: 20.8, fat100: 2.6, aliases: ["chickpeas"] },
  { id: "lenticchie", name: "Lenticchie (cotte)", categoryId: "legumi", kcal100: 116, protein100: 9.0, carbs100: 20.0, fat100: 0.5, aliases: ["lentils"] },
  { id: "fagioli", name: "Fagioli borlotti (cotti)", categoryId: "legumi", kcal100: 91, protein100: 6.6, carbs100: 16.0, fat100: 0.5, aliases: ["beans"] },
  { id: "piselli", name: "Piselli (cotti)", categoryId: "legumi", kcal100: 80, protein100: 5.4, carbs100: 14.0, fat100: 0.4, aliases: ["peas"] },
  { id: "pasta-semola", name: "Pasta di semola (cruda)", categoryId: "pasta", kcal100: 353, protein100: 12.5, carbs100: 71.0, fat100: 1.5,
    aliases: ["spaghetti", "spaghetto", "penne", "rigatoni", "fusilli", "linguine", "tagliatelle", "farfalle", "maccheroni", "bucatini", "vermicelli", "noodles", "egg noodles"] },
  { id: "pasta-integrale", name: "Pasta integrale (cruda)", categoryId: "pasta", kcal100: 335, protein100: 13.0, carbs100: 66.2, fat100: 2.5 },
  { id: "riso", name: "Riso (crudo)", categoryId: "riso", kcal100: 332, protein100: 6.7, carbs100: 74.4, fat100: 0.6, aliases: ["rice"] },
  { id: "riso-integrale", name: "Riso integrale (crudo)", categoryId: "riso", kcal100: 337, protein100: 7.5, carbs100: 72.0, fat100: 2.8, aliases: ["brown rice"] },
  { id: "farro", name: "Farro (crudo)", categoryId: "altri-cereali", kcal100: 335, protein100: 15.1, carbs100: 67.1, fat100: 2.5, aliases: ["spelt", "farro"] },
  { id: "orzo", name: "Orzo perlato (crudo)", categoryId: "altri-cereali", kcal100: 328, protein100: 10.4, carbs100: 69.0, fat100: 1.5, aliases: ["barley"] },
  { id: "quinoa", name: "Quinoa (cruda)", categoryId: "altri-cereali", kcal100: 368, protein100: 14.1, carbs100: 64.2, fat100: 6.1, aliases: ["quinoa"] },
  { id: "avena", name: "Avena (fiocchi)", categoryId: "altri-cereali", kcal100: 375, protein100: 13.0, carbs100: 62.0, fat100: 7.0, aliases: ["oats", "rolled oats"] },
  { id: "uovo", name: "Uovo di gallina (intero)", categoryId: "uova", kcal100: 128, protein100: 12.4, carbs100: 0.7, fat100: 8.7, aliases: ["egg", "eggs"] },
  { id: "mandorle", name: "Mandorle", categoryId: "frutta-secca", kcal100: 603, protein100: 22.0, carbs100: 4.6, fat100: 54.0, aliases: ["almonds"] },
  { id: "noci", name: "Noci", categoryId: "frutta-secca", kcal100: 689, protein100: 14.3, carbs100: 4.4, fat100: 68.1, aliases: ["walnuts"] },
  { id: "nocciole", name: "Nocciole", categoryId: "frutta-secca", kcal100: 655, protein100: 13.8, carbs100: 4.7, fat100: 64.1, aliases: ["hazelnuts"] },
  { id: "mela", name: "Mela", categoryId: "frutta", kcal100: 52, protein100: 0.3, carbs100: 13.8, fat100: 0.2, aliases: ["apple"] },
  { id: "banana", name: "Banana", categoryId: "frutta", kcal100: 89, protein100: 1.1, carbs100: 22.8, fat100: 0.3, aliases: ["banana"] },
  { id: "arancia", name: "Arancia", categoryId: "frutta", kcal100: 47, protein100: 0.9, carbs100: 11.8, fat100: 0.1, aliases: ["orange"] },
  { id: "kiwi", name: "Kiwi", categoryId: "frutta", kcal100: 61, protein100: 1.1, carbs100: 14.7, fat100: 0.5, aliases: ["kiwi"] },
  { id: "fragole", name: "Fragole", categoryId: "frutta", kcal100: 32, protein100: 0.7, carbs100: 7.7, fat100: 0.3, aliases: ["strawberries"] },
  { id: "zucchine", name: "Zucchine", categoryId: "verdura", kcal100: 17, protein100: 1.2, carbs100: 2.4, fat100: 0.3, aliases: ["zucchini", "courgette"] },
  { id: "spinaci", name: "Spinaci", categoryId: "verdura", kcal100: 23, protein100: 2.9, carbs100: 3.6, fat100: 0.4, aliases: ["spinach"] },
  { id: "broccoli", name: "Broccoli", categoryId: "verdura", kcal100: 34, protein100: 2.8, carbs100: 4.0, fat100: 0.4, aliases: ["broccoli"] },
  { id: "pomodoro", name: "Pomodoro", categoryId: "verdura", kcal100: 19, protein100: 0.9, carbs100: 3.5, fat100: 0.2, aliases: ["tomato", "tomatoes", "passata", "tomato sauce"] },
  { id: "carote", name: "Carote", categoryId: "verdura", kcal100: 41, protein100: 0.9, carbs100: 9.6, fat100: 0.2, aliases: ["carrot", "carrots"] },
  { id: "insalata", name: "Insalata / lattuga", categoryId: "verdura", kcal100: 15, protein100: 1.4, carbs100: 2.2, fat100: 0.2, aliases: ["lettuce", "salad"] },
  { id: "peperoni", name: "Peperoni", categoryId: "verdura", kcal100: 20, protein100: 1.0, carbs100: 4.2, fat100: 0.2, aliases: ["bell pepper", "peppers"] },
  { id: "melanzane", name: "Melanzane", categoryId: "verdura", kcal100: 25, protein100: 1.0, carbs100: 5.7, fat100: 0.2, aliases: ["eggplant", "aubergine"] },
  { id: "yogurt-greco", name: "Yogurt greco intero", categoryId: "latticini", kcal100: 97, protein100: 9.0, carbs100: 3.6, fat100: 5.0, aliases: ["greek yogurt"] },
  { id: "yogurt-magro", name: "Yogurt bianco magro", categoryId: "latticini", kcal100: 46, protein100: 4.5, carbs100: 5.6, fat100: 0.4, aliases: ["yogurt", "low fat yogurt"] },
  { id: "latte-ps", name: "Latte parzialmente scremato", categoryId: "latticini", kcal100: 46, protein100: 3.3, carbs100: 4.9, fat100: 1.6, aliases: ["milk"] },
  { id: "parmigiano", name: "Parmigiano reggiano", categoryId: "latticini", kcal100: 392, protein100: 33.0, carbs100: 0, fat100: 28.4, aliases: ["parmesan"] },
  { id: "mozzarella", name: "Mozzarella", categoryId: "latticini", kcal100: 253, protein100: 18.7, carbs100: 0.7, fat100: 19.5, aliases: ["mozzarella"] },
  { id: "ricotta", name: "Ricotta vaccina", categoryId: "latticini", kcal100: 146, protein100: 8.8, carbs100: 3.5, fat100: 10.9, aliases: ["ricotta"] },
  { id: "patate", name: "Patate", categoryId: "tuberi", kcal100: 77, protein100: 2.0, carbs100: 17.6, fat100: 0.1, aliases: ["potato", "potatoes"] },
  { id: "olio-evo", name: "Olio extravergine d'oliva", categoryId: "grassi", kcal100: 899, protein100: 0, carbs100: 0, fat100: 99.9, aliases: ["olive oil", "extra virgin olive oil", "oil"] },
  { id: "burro", name: "Burro", categoryId: "grassi", kcal100: 758, protein100: 0.6, carbs100: 0.1, fat100: 83.0, aliases: ["butter"] },
  { id: "zucchero", name: "Zucchero", categoryId: "dolci", kcal100: 392, protein100: 0, carbs100: 99.8, fat100: 0, aliases: ["sugar"] },
  { id: "cioccolato-fondente", name: "Cioccolato fondente", categoryId: "dolci", kcal100: 546, protein100: 7.5, carbs100: 46.0, fat100: 34.0, aliases: ["dark chocolate", "chocolate"] },
  { id: "pane", name: "Pane comune", categoryId: "altro", kcal100: 275, protein100: 8.0, carbs100: 55.0, fat100: 1.0, aliases: ["bread"] },
  { id: "farina", name: "Farina 00", categoryId: "altro", kcal100: 340, protein100: 11.0, carbs100: 74.0, fat100: 1.0, aliases: ["flour", "all-purpose flour"] },
  { id: "guanciale", name: "Guanciale", categoryId: "carne-rossa", kcal100: 655, protein100: 9.0, carbs100: 0, fat100: 68.0, aliases: ["guanciale", "cured pork cheek"] },
  { id: "pancetta", name: "Pancetta", categoryId: "carne-rossa", kcal100: 457, protein100: 9.0, carbs100: 0.3, fat100: 46.0, aliases: ["bacon", "pancetta"] },
  { id: "salsiccia", name: "Salsiccia fresca", categoryId: "carne-rossa", kcal100: 311, protein100: 15.0, carbs100: 1.0, fat100: 27.0, aliases: ["sausage"] },
  { id: "pecorino", name: "Pecorino romano", categoryId: "latticini", kcal100: 387, protein100: 25.0, carbs100: 0, fat100: 32.0, aliases: ["pecorino"] },
  { id: "mascarpone", name: "Mascarpone", categoryId: "latticini", kcal100: 450, protein100: 5.0, carbs100: 4.0, fat100: 47.0, aliases: ["mascarpone"] },
  { id: "panna-cucina", name: "Panna da cucina", categoryId: "latticini", kcal100: 337, protein100: 2.4, carbs100: 3.5, fat100: 35.0, aliases: ["cooking cream", "heavy cream"] },
  { id: "tuorlo", name: "Tuorlo d'uovo", categoryId: "uova", kcal100: 322, protein100: 16.0, carbs100: 3.6, fat100: 27.0, aliases: ["egg yolk", "egg yolks", "yolk"] },
  { id: "albume", name: "Albume d'uovo", categoryId: "uova", kcal100: 52, protein100: 11.0, carbs100: 0.7, fat100: 0.2, aliases: ["egg white", "egg whites"] },
  { id: "prezzemolo", name: "Prezzemolo", categoryId: "verdura", kcal100: 36, protein100: 3.0, carbs100: 6.0, fat100: 0.8, aliases: ["parsley"] },
  { id: "basilico", name: "Basilico", categoryId: "verdura", kcal100: 23, protein100: 3.2, carbs100: 2.7, fat100: 0.6, aliases: ["basil"] },
  { id: "aglio", name: "Aglio", categoryId: "verdura", kcal100: 149, protein100: 6.4, carbs100: 33.0, fat100: 0.5, aliases: ["garlic"] },
  { id: "cipolla", name: "Cipolla", categoryId: "verdura", kcal100: 40, protein100: 1.1, carbs100: 9.3, fat100: 0.1, aliases: ["onion"] },
  { id: "limone", name: "Limone", categoryId: "frutta", kcal100: 29, protein100: 1.1, carbs100: 9.3, fat100: 0.3, aliases: ["lime"] },
  // erbe aromatiche e spezie
  { id: "rosmarino", name: "Rosmarino", categoryId: "verdura", kcal100: 131, protein100: 3.3, carbs100: 20.7, fat100: 5.9, aliases: ["rosemary"] },
  { id: "timo", name: "Timo", categoryId: "verdura", kcal100: 101, protein100: 5.6, carbs100: 24.5, fat100: 1.7, aliases: ["thyme"] },
  { id: "salvia", name: "Salvia", categoryId: "verdura", kcal100: 315, protein100: 10.6, carbs100: 60.7, fat100: 12.8, aliases: ["sage"] },
  { id: "origano", name: "Origano", categoryId: "verdura", kcal100: 265, protein100: 9.0, carbs100: 68.9, fat100: 4.3, aliases: ["oregano"] },
  { id: "alloro", name: "Alloro", categoryId: "verdura", kcal100: 313, protein100: 7.6, carbs100: 75.0, fat100: 8.4, aliases: ["bay leaf", "bay leaves"] },
  { id: "menta", name: "Menta", categoryId: "verdura", kcal100: 44, protein100: 3.8, carbs100: 8.4, fat100: 0.7, aliases: ["mint"] },
  { id: "coriandolo", name: "Coriandolo", categoryId: "verdura", kcal100: 23, protein100: 2.1, carbs100: 3.7, fat100: 0.5, aliases: ["cilantro", "coriander"] },
  { id: "peperoncino", name: "Peperoncino", categoryId: "verdura", kcal100: 40, protein100: 2.0, carbs100: 7.3, fat100: 0.4, aliases: ["chili", "chilli", "chili pepper", "chili flakes"] },
  { id: "zenzero", name: "Zenzero", categoryId: "verdura", kcal100: 80, protein100: 1.8, carbs100: 17.8, fat100: 0.8, aliases: ["ginger"] },
  { id: "sale", name: "Sale", categoryId: "altro", kcal100: 0, protein100: 0, carbs100: 0, fat100: 0, aliases: ["salt"] },
  { id: "pepe", name: "Pepe nero", categoryId: "altro", kcal100: 251, protein100: 10.4, carbs100: 63.9, fat100: 3.3, aliases: ["pepper", "black pepper"] },
  // condimenti e salse
  { id: "aceto", name: "Aceto", categoryId: "grassi", kcal100: 19, protein100: 0, carbs100: 0.9, fat100: 0, aliases: ["vinegar", "rice vinegar", "balsamic vinegar", "aceto balsamico"] },
  { id: "senape", name: "Senape", categoryId: "grassi", kcal100: 66, protein100: 4.4, carbs100: 4.0, fat100: 3.8, aliases: ["mustard"] },
  { id: "maionese", name: "Maionese", categoryId: "grassi", kcal100: 680, protein100: 1.0, carbs100: 3.0, fat100: 75.0, aliases: ["mayonnaise", "mayo"] },
  { id: "salsa-soia", name: "Salsa di soia", categoryId: "grassi", kcal100: 53, protein100: 8.0, carbs100: 4.9, fat100: 0.1, aliases: ["soy sauce", "soia"] },
  { id: "olio-sesamo", name: "Olio di sesamo", categoryId: "grassi", kcal100: 884, protein100: 0, carbs100: 0, fat100: 100, aliases: ["sesame oil"] },
  { id: "miele", name: "Miele", categoryId: "dolci", kcal100: 304, protein100: 0.3, carbs100: 82.4, fat100: 0, aliases: ["honey"] },
  { id: "zucchero-canna", name: "Zucchero di canna", categoryId: "dolci", kcal100: 380, protein100: 0, carbs100: 100, fat100: 0, aliases: ["brown sugar"] },
  { id: "pangrattato", name: "Pangrattato", categoryId: "altro", kcal100: 375, protein100: 12.0, carbs100: 73.0, fat100: 3.0, aliases: ["breadcrumbs"] },
  { id: "besciamella", name: "Besciamella", categoryId: "altro", kcal100: 130, protein100: 3.5, carbs100: 8.0, fat100: 10.0, aliases: ["bechamel", "white sauce"] },
  { id: "brodo", name: "Brodo (vegetale o di carne)", categoryId: "altro", kcal100: 4, protein100: 0.3, carbs100: 0.6, fat100: 0.1, aliases: ["broth", "stock", "chicken broth", "vegetable broth", "chicken stock"] },
  { id: "vino-bianco", name: "Vino bianco da cucina", categoryId: "altro", kcal100: 82, protein100: 0.1, carbs100: 2.6, fat100: 0, aliases: ["white wine"] },
  { id: "vino-rosso", name: "Vino rosso da cucina", categoryId: "altro", kcal100: 85, protein100: 0.1, carbs100: 2.6, fat100: 0, aliases: ["red wine"] },
  // verdure aggiuntive
  { id: "finocchio", name: "Finocchio", categoryId: "verdura", kcal100: 31, protein100: 1.2, carbs100: 7.3, fat100: 0.2, aliases: ["fennel"] },
  { id: "sedano", name: "Sedano", categoryId: "verdura", kcal100: 16, protein100: 0.7, carbs100: 3.0, fat100: 0.2, aliases: ["celery"] },
  { id: "funghi", name: "Funghi champignon", categoryId: "verdura", kcal100: 22, protein100: 3.1, carbs100: 3.3, fat100: 0.3, aliases: ["mushrooms", "mushroom"] },
  { id: "porri", name: "Porri", categoryId: "verdura", kcal100: 61, protein100: 1.5, carbs100: 14.2, fat100: 0.3, aliases: ["leek", "leeks"] },
  { id: "cipollotto", name: "Cipollotto / cipolla verde", categoryId: "verdura", kcal100: 32, protein100: 1.8, carbs100: 7.3, fat100: 0.2, aliases: ["scallion", "scallions", "green onion", "spring onion"] },
  { id: "zucca", name: "Zucca", categoryId: "verdura", kcal100: 26, protein100: 1.1, carbs100: 6.5, fat100: 0.1, aliases: ["pumpkin", "squash"] },
  { id: "cavolo", name: "Cavolo verza", categoryId: "verdura", kcal100: 27, protein100: 1.4, carbs100: 5.8, fat100: 0.2, aliases: ["cabbage"] },
  { id: "cavolfiore", name: "Cavolfiore", categoryId: "verdura", kcal100: 25, protein100: 2.0, carbs100: 5.0, fat100: 0.3, aliases: ["cauliflower"] },
  { id: "rucola", name: "Rucola", categoryId: "verdura", kcal100: 25, protein100: 2.6, carbs100: 3.7, fat100: 0.7, aliases: ["arugula", "rocket"] },
  { id: "olive", name: "Olive", categoryId: "grassi", kcal100: 145, protein100: 1.0, carbs100: 4.0, fat100: 15.0, aliases: ["olives"] },
  { id: "capperi", name: "Capperi", categoryId: "verdura", kcal100: 23, protein100: 2.4, carbs100: 4.9, fat100: 0.9, aliases: ["capers"] },
  { id: "germogli-soia", name: "Germogli di soia", categoryId: "verdura", kcal100: 30, protein100: 3.0, carbs100: 5.9, fat100: 0.2, aliases: ["bean sprouts", "soy sprouts"] },
  { id: "mais", name: "Mais", categoryId: "verdura", kcal100: 86, protein100: 3.2, carbs100: 19.0, fat100: 1.2, aliases: ["corn", "sweetcorn"] },
  // frutta aggiuntiva
  { id: "pera", name: "Pera", categoryId: "frutta", kcal100: 57, protein100: 0.4, carbs100: 15.2, fat100: 0.1, aliases: ["pear"] },
  { id: "pesca", name: "Pesca", categoryId: "frutta", kcal100: 39, protein100: 0.9, carbs100: 9.5, fat100: 0.3, aliases: ["peach"] },
  { id: "ananas", name: "Ananas", categoryId: "frutta", kcal100: 50, protein100: 0.5, carbs100: 13.1, fat100: 0.1, aliases: ["pineapple"] },
  { id: "mango", name: "Mango", categoryId: "frutta", kcal100: 60, protein100: 0.8, carbs100: 15.0, fat100: 0.4, aliases: ["mango"] },
  { id: "mirtilli", name: "Mirtilli", categoryId: "frutta", kcal100: 43, protein100: 0.7, carbs100: 10.5, fat100: 0.4, aliases: ["blueberries"] },
  { id: "uva", name: "Uva", categoryId: "frutta", kcal100: 69, protein100: 0.5, carbs100: 18.1, fat100: 0.2, aliases: ["grapes"] },
  // pesce/carne aggiuntivi
  { id: "acciughe", name: "Acciughe", categoryId: "pesce", kcal100: 131, protein100: 20.4, carbs100: 0, fat100: 4.8, aliases: ["anchovies"] },
  { id: "tofu", name: "Tofu", categoryId: "legumi", kcal100: 76, protein100: 8.0, carbs100: 1.9, fat100: 4.8, aliases: ["tofu"] },
  // formaggi aggiuntivi
  { id: "feta", name: "Feta", categoryId: "latticini", kcal100: 264, protein100: 14.2, carbs100: 4.1, fat100: 21.3, aliases: ["feta cheese"] },
  { id: "gorgonzola", name: "Gorgonzola", categoryId: "latticini", kcal100: 330, protein100: 19.0, carbs100: 0.4, fat100: 27.0 },
  { id: "grana", name: "Grana padano", categoryId: "latticini", kcal100: 396, protein100: 33.0, carbs100: 0, fat100: 29.0 },
  { id: "formaggio-spalmabile", name: "Formaggio spalmabile", categoryId: "latticini", kcal100: 253, protein100: 7.0, carbs100: 4.0, fat100: 25.0, aliases: ["cream cheese", "philadelphia"] },
];

export const EXAMPLE_RECIPES = [
  {
    id: "ex-pasta", name: "Pasta al pomodoro e basilico (esempio)", link: "", categoryId: "pasta",
    meals: ["pranzo", "cena"], notes: "Esempio: sostituiscila con una tua ricetta",
    ingredients: [
      { ingredientId: "pasta-semola", grams: 90 },
      { ingredientId: "pomodoro", grams: 200 },
      { ingredientId: "olio-evo", grams: 10 },
      { ingredientId: "parmigiano", grams: 10 },
    ],
  },
  {
    id: "ex-pollo", name: "Petto di pollo con verdure (esempio)", link: "", categoryId: "carne-bianca",
    meals: ["pranzo", "cena"], notes: "Esempio",
    ingredients: [
      { ingredientId: "pollo-petto", grams: 180 },
      { ingredientId: "zucchine", grams: 150 },
      { ingredientId: "broccoli", grams: 150 },
      { ingredientId: "olio-evo", grams: 10 },
    ],
  },
  {
    id: "ex-yogurt", name: "Yogurt greco con frutta secca e mela (esempio)", link: "", categoryId: "latticini",
    meals: ["colazione", "spuntino"], notes: "Esempio",
    ingredients: [
      { ingredientId: "yogurt-greco", grams: 200 },
      { ingredientId: "mandorle", grams: 15 },
      { ingredientId: "mela", grams: 100 },
    ],
  },
];

export function ingredientById(id) {
  return INGREDIENT_DB.find((i) => i.id === id);
}

// Ingredienti raggruppati per categoria (indipendentemente dall'ordine in
// cui compaiono nel database), pronti per essere resi come <optgroup> da
// un componente React.
export function ingredientsGrouped(categories) {
  const groups = [];
  const byId = new Map();
  INGREDIENT_DB.forEach((ing) => {
    let group = byId.get(ing.categoryId);
    if (!group) {
      const cat = categories.find((c) => c.id === ing.categoryId);
      group = { categoryId: ing.categoryId, label: cat ? cat.name : ing.categoryId === "altro" ? "Altro" : ing.categoryId, items: [] };
      byId.set(ing.categoryId, group);
      groups.push(group);
    }
    group.items.push(ing);
  });
  return groups;
}

export function computeRecipeMacros(recipe) {
  let kcal = 0, protein = 0, carbs = 0, fat = 0;
  (recipe.ingredients || []).forEach((ing) => {
    const def = ingredientById(ing.ingredientId);
    if (!def) return;
    const f = (ing.grams || 0) / 100;
    kcal += def.kcal100 * f;
    protein += def.protein100 * f;
    carbs += def.carbs100 * f;
    fat += def.fat100 * f;
  });
  return { kcal, protein, carbs, fat };
}

export function macroPctOf(macros) {
  const kf = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
  if (kf <= 0) return { p: 0, c: 0, f: 0 };
  return { p: (macros.protein * 4) / kf * 100, c: (macros.carbs * 4) / kf * 100, f: (macros.fat * 9) / kf * 100 };
}

export function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
export function round1(n) { return Math.round(n * 10) / 10; }

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function allSlots(spuntiniPerDay) {
  const slots = [];
  DAYS.forEach((day) => {
    ["colazione", "pranzo", "cena"].forEach((mt) => slots.push({ day, mealType: mt, idx: 0, key: `${day}|${mt}|0` }));
    for (let i = 0; i < spuntiniPerDay; i++) slots.push({ day, mealType: "spuntino", idx: i, key: `${day}|spuntino|${i}` });
  });
  return slots;
}

// Scala i grammi degli ingredienti NON fissi (ing.locked) per far
// combaciare il totale calorico con targetKcal, lasciando invariati
// quelli fissi. Se i fissi da soli superano gia il target, i non fissi
// vengono azzerati (mai grammi negativi) invece di sballare il calcolo.
export function rescaleIngredients(ingredients, targetKcal) {
  let lockedKcal = 0, unlockedKcal = 0;
  (ingredients || []).forEach((ing) => {
    const def = ingredientById(ing.ingredientId);
    if (!def) return;
    const kcal = def.kcal100 * ((ing.grams || 0) / 100);
    if (ing.locked) lockedKcal += kcal; else unlockedKcal += kcal;
  });
  const remaining = Math.max(0, targetKcal - lockedKcal);
  const scale = unlockedKcal > 0 ? remaining / unlockedKcal : 1;
  return (ingredients || []).map((ing) => (ing.locked ? { ...ing } : { ...ing, grams: round1((ing.grams || 0) * scale) }));
}

export function computeEntry(settings, mt, catId, recipe) {
  const mealBudget = (settings.dailyCalories * (settings.mealSplit[mt] / 100)) / (mt === "spuntino" ? Math.max(1, settings.spuntiniPerDay) : 1);
  const scaledRaw = rescaleIngredients(recipe.ingredients || [], mealBudget);
  const macros = computeRecipeMacros({ ingredients: scaledRaw });
  const pct = macroPctOf(macros);
  const range = settings.macroRanges[mt];
  const inRange = pct.p >= range.p[0] && pct.p <= range.p[1] && pct.c >= range.c[0] && pct.c <= range.c[1] && pct.f >= range.f[0] && pct.f <= range.f[1];
  const ingredients = scaledRaw.map((ing) => {
    const def = ingredientById(ing.ingredientId);
    return { ingredientId: ing.ingredientId, name: def ? def.name : ing.ingredientId, grams: ing.grams, locked: !!ing.locked };
  });
  return {
    mealType: mt, free: false, categoryId: catId, recipeId: recipe.id, kcal: Math.round(macros.kcal),
    protein: round1(macros.protein), carbs: round1(macros.carbs), fat: round1(macros.fat),
    pPct: round1(pct.p), cPct: round1(pct.c), fPct: round1(pct.f), inRange,
    ingredients,
  };
}

function buildMealEntry(settings, recipes, day, mt, idx, freeSet, skipSet, assignMap, usedRecipeIds) {
  const key = `${day}|${mt}|${idx}`;
  if (skipSet.has(key)) return { mealType: mt, idx, skipped: true };
  if (freeSet.has(key)) return { mealType: mt, idx, free: true };
  const catId = assignMap.get(key);
  if (!catId) return { mealType: mt, idx, free: false, categoryId: null, unassigned: true };
  const pool = recipes.filter((r) => r.categoryId === catId && r.meals.includes(mt));
  if (pool.length === 0) return { mealType: mt, idx, free: false, categoryId: catId, noRecipe: true };
  const unused = pool.filter((r) => !usedRecipeIds.has(r.id));
  const choicePool = unused.length ? unused : pool;
  const recipe = choicePool[Math.floor(Math.random() * choicePool.length)];
  usedRecipeIds.add(recipe.id);
  return { idx, ...computeEntry(settings, mt, catId, recipe) };
}

export function generatePlan(settings, categories, recipes) {
  const slots = allSlots(settings.spuntiniPerDay);
  const freeSet = new Set(settings.freeSlots.filter((k) => slots.some((s) => s.key === k)));
  const skipSet = new Set((settings.skippedSlots || []).filter((k) => slots.some((s) => s.key === k)));
  const warnings = [];
  if (freeSet.size !== settings.freeMealsTarget) {
    warnings.push(`Hai selezionato ${freeSet.size} pasti liberi ma l'obiettivo e ${settings.freeMealsTarget}.`);
  }
  const available = shuffle(slots.filter((s) => !freeSet.has(s.key) && !skipSet.has(s.key)));
  let tokens = [];
  categories.filter((c) => c.weeklyFrequency > 0).forEach((c) => {
    for (let i = 0; i < c.weeklyFrequency; i++) tokens.push(c);
  });
  tokens = shuffle(tokens);
  const assignMap = new Map();
  const usedSlotKeys = new Set();
  const unallocated = [];
  tokens.forEach((cat) => {
    const candidates = available.filter((s) => !usedSlotKeys.has(s.key) && cat.meals.includes(s.mealType));
    if (candidates.length === 0) { unallocated.push(cat); return; }
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    assignMap.set(chosen.key, cat.id);
    usedSlotKeys.add(chosen.key);
  });
  const leftover = available.filter((s) => !usedSlotKeys.has(s.key));
  if (unallocated.length) {
    const names = {};
    unallocated.forEach((c) => { names[c.name] = (names[c.name] || 0) + 1; });
    const list = Object.keys(names).map((n) => `${n} x${names[n]}`).join(", ");
    warnings.push(`${unallocated.length} pasti richiesti non hanno trovato uno slot compatibile libero: ${list}.`);
  }
  if (leftover.length) {
    warnings.push(`${leftover.length} pasti sono rimasti senza categoria assegnata: aumenta le frequenze delle categorie compatibili o riduci i pasti liberi.`);
  }
  const usedRecipeIds = new Set();
  const days = DAYS.map((day) => {
    const meals = [];
    ["colazione", "pranzo", "cena"].forEach((mt) => meals.push(buildMealEntry(settings, recipes, day, mt, 0, freeSet, skipSet, assignMap, usedRecipeIds)));
    for (let i = 0; i < settings.spuntiniPerDay; i++) meals.push(buildMealEntry(settings, recipes, day, "spuntino", i, freeSet, skipSet, assignMap, usedRecipeIds));
    return { day, meals };
  });
  const noRecipeCats = {};
  days.forEach((d) => d.meals.forEach((m) => {
    if (m.noRecipe) {
      const c = categories.find((x) => x.id === m.categoryId);
      noRecipeCats[`${c ? c.name : m.categoryId} / ${MEAL_LABELS[m.mealType]}`] = 1;
    }
  }));
  const nrList = Object.keys(noRecipeCats);
  if (nrList.length) warnings.push(`Nessuna ricetta disponibile per: ${nrList.join(", ")}. Aggiungi ricette in quella categoria/pasto nella sezione Ricette.`);

  return { createdAt: new Date().toISOString(), days, warnings };
}

function replaceMealEntry(plan, day, mt, idx, newEntry) {
  return {
    ...plan,
    days: plan.days.map((d) => d.day !== day ? d : {
      ...d,
      meals: d.meals.map((m) => (m.mealType === mt && m.idx === idx) ? newEntry : m),
    }),
  };
}

export function rerollMeal(settings, recipes, plan, day, mt, idx) {
  const dayObj = plan.days.find((d) => d.day === day);
  const entry = dayObj.meals.find((m) => m.mealType === mt && m.idx === idx);
  if (!entry || entry.free || !entry.categoryId) return plan;
  let pool = recipes.filter((r) => r.categoryId === entry.categoryId && r.meals.includes(mt) && r.id !== entry.recipeId);
  if (pool.length === 0) pool = recipes.filter((r) => r.categoryId === entry.categoryId && r.meals.includes(mt));
  if (pool.length === 0) return plan;
  const recipe = pool[Math.floor(Math.random() * pool.length)];
  const newEntry = { idx, ...computeEntry(settings, mt, entry.categoryId, recipe) };
  return replaceMealEntry(plan, day, mt, idx, newEntry);
}

// Sostituisce il pasto con una ricetta specifica scelta dall'utente dal
// popup di selezione manuale. La categoria della cella diventa quella
// della ricetta scelta (il popup lascia scegliere anche una categoria
// diversa da quella attuale).
export function selectMealRecipe(settings, recipes, plan, day, mt, idx, recipeId) {
  const dayObj = plan.days.find((d) => d.day === day);
  const entry = dayObj && dayObj.meals.find((m) => m.mealType === mt && m.idx === idx);
  const recipe = recipes.find((r) => r.id === recipeId);
  if (!entry || !recipe) return plan;
  const newEntry = { idx, ...computeEntry(settings, mt, recipe.categoryId, recipe) };
  return replaceMealEntry(plan, day, mt, idx, newEntry);
}

// Scambia tutti i pasti di un giorno con quelli di un altro giorno.
export function swapDays(plan, dayA, dayB) {
  if (dayA === dayB) return plan;
  const objA = plan.days.find((d) => d.day === dayA);
  const objB = plan.days.find((d) => d.day === dayB);
  if (!objA || !objB) return plan;
  return {
    ...plan,
    days: plan.days.map((d) => {
      if (d.day === dayA) return { ...objB, day: dayA };
      if (d.day === dayB) return { ...objA, day: dayB };
      return d;
    }),
  };
}

export function hueColor(catHueMap, id, l) {
  const h = catHueMap[id] == null ? 0 : catHueMap[id];
  return `hsl(${h} 42% ${l || 42}%)`;
}

export function assignHues(categories) {
  const map = {};
  categories.forEach((c, i) => { map[c.id] = PALETTE_HUES[i % PALETTE_HUES.length]; });
  return map;
}
