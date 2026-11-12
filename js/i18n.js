// Translations for texts that JavaScript writes into the page.
// The language comes from <html lang="…">; English is the default.
export const lang = ["it", "de"].includes(document.documentElement.lang) ? document.documentElement.lang : "en";
export const locale = { en: "en-GB", it: "it-IT", de: "de-DE" }[lang];

const TEXTS = {
  it: {
    "Hiking": "Escursionismo",
    "Cycling": "Ciclismo",
    "Mountain bike": "Mountain bike",
    "easy": "facile",
    "medium": "media",
    "hard": "difficile",
    "Save": "Salva",
    "Saved": "Salvato",
    "Remove": "Rimuovi",
    "Save {name} to my day plan": "Salva {name} nel mio programma",
    "Remove {name} from my day plan": "Rimuovi {name} dal mio programma",
    "{shown} of {all} trails shown.": "{shown} di {all} percorsi mostrati.",
    "No trail matches your search. ": "Nessun percorso corrisponde alla ricerca. ",
    "Clear filters": "Cancella filtri",
    "The trails could not be updated right now, so the saved list is shown. Filters are not available.": "Al momento non è possibile aggiornare i percorsi: viene mostrato l'elenco salvato. I filtri non sono disponibili.",
    "{n} events.": "{n} eventi.",
    "The events could not be updated right now, so the saved list is shown.": "Al momento non è possibile aggiornare gli eventi: viene mostrato l'elenco salvato.",
    "Please enter your name.": "Inserisci il tuo nome.",
    "Please enter a valid email, for example anna@example.com.": "Inserisci un'email valida, ad esempio anna@example.com.",
    "Please write your question (at least 10 characters).": "Scrivi la tua domanda (almeno 10 caratteri).",
    "Please agree so that we can answer you.": "Dai il tuo consenso, così possiamo risponderti.",
    "Thank you, {name}! Your question is ready to be sent. (Student project: sending will work when the back end is added next semester.)": "Grazie, {name}! La tua domanda è pronta per l'invio. (Progetto studentesco: l'invio funzionerà quando il back end sarà aggiunto il prossimo semestre.)",
    "Sorry, your question could not be sent. Please try again later.": "Spiacenti, non è stato possibile inviare la domanda. Riprova più tardi.",
    "not available": "non disponibile",
    "Updated: {time} (local time in Livigno)": "Aggiornato: {time} (ora locale di Livigno)",
    "Live data is not available right now. Please check the official webcams.": "I dati in tempo reale non sono disponibili al momento. Controlla le webcam ufficiali.",
    "Summer: hiking trails, cycling routes, lakes and a bike park.": "Estate: sentieri, percorsi in bici, laghi e un bike park.",
    "Winter: two ski areas, a snow park, ski schools and live snow information.": "Inverno: due comprensori sciistici, uno snow park, scuole di sci e informazioni sulla neve in tempo reale.",
    "Skiing: slopes for beginners and experts in both ski areas.": "Sci: piste per principianti ed esperti in entrambi i comprensori.",
    "Snowboard: a snow park with jumps and rails, plus wide slopes.": "Snowboard: uno snow park con salti e rail, e ampie piste.",
    "Cross-country: prepared tracks along the flat valley floor.": "Sci di fondo: piste preparate lungo il fondovalle pianeggiante.",
    "Livigno valley covered in snow": "La valle di Livigno coperta di neve",
    "Green Livigno valley with the lake and mountains in summer": "La verde valle di Livigno con il lago e le montagne in estate",
  },
  de: {
    "Hiking": "Wandern",
    "Cycling": "Radfahren",
    "Mountain bike": "Mountainbike",
    "easy": "leicht",
    "medium": "mittel",
    "hard": "schwer",
    "Save": "Merken",
    "Saved": "Gemerkt",
    "Remove": "Entfernen",
    "Save {name} to my day plan": "{name} zu meinem Tagesplan hinzufügen",
    "Remove {name} from my day plan": "{name} aus meinem Tagesplan entfernen",
    "{shown} of {all} trails shown.": "{shown} von {all} Touren angezeigt.",
    "No trail matches your search. ": "Keine Tour passt zu deiner Suche. ",
    "Clear filters": "Filter löschen",
    "The trails could not be updated right now, so the saved list is shown. Filters are not available.": "Die Touren können gerade nicht aktualisiert werden, daher wird die gespeicherte Liste angezeigt. Filter sind nicht verfügbar.",
    "{n} events.": "{n} Veranstaltungen.",
    "The events could not be updated right now, so the saved list is shown.": "Die Veranstaltungen können gerade nicht aktualisiert werden, daher wird die gespeicherte Liste angezeigt.",
    "Please enter your name.": "Bitte gib deinen Namen ein.",
    "Please enter a valid email, for example anna@example.com.": "Bitte gib eine gültige E-Mail-Adresse ein, zum Beispiel anna@example.com.",
    "Please write your question (at least 10 characters).": "Bitte schreibe deine Frage (mindestens 10 Zeichen).",
    "Please agree so that we can answer you.": "Bitte stimme zu, damit wir dir antworten können.",
    "Thank you, {name}! Your question is ready to be sent. (Student project: sending will work when the back end is added next semester.)": "Danke, {name}! Deine Frage ist bereit zum Senden. (Studentenprojekt: Das Senden funktioniert, sobald im nächsten Semester das Back-End hinzukommt.)",
    "Sorry, your question could not be sent. Please try again later.": "Leider konnte deine Frage nicht gesendet werden. Bitte versuche es später noch einmal.",
    "not available": "nicht verfügbar",
    "Updated: {time} (local time in Livigno)": "Aktualisiert: {time} (Ortszeit in Livigno)",
    "Live data is not available right now. Please check the official webcams.": "Live-Daten sind gerade nicht verfügbar. Bitte schau dir die offiziellen Webcams an.",
    "Summer: hiking trails, cycling routes, lakes and a bike park.": "Sommer: Wanderwege, Radrouten, Seen und ein Bikepark.",
    "Winter: two ski areas, a snow park, ski schools and live snow information.": "Winter: zwei Skigebiete, ein Snowpark, Skischulen und aktuelle Schneeinfos.",
    "Skiing: slopes for beginners and experts in both ski areas.": "Ski: Pisten für Anfänger und Könner in beiden Skigebieten.",
    "Snowboard: a snow park with jumps and rails, plus wide slopes.": "Snowboard: ein Snowpark mit Sprüngen und Rails sowie breite Pisten.",
    "Cross-country: prepared tracks along the flat valley floor.": "Langlauf: gespurte Loipen entlang des flachen Talbodens.",
    "Livigno valley covered in snow": "Das verschneite Tal von Livigno",
    "Green Livigno valley with the lake and mountains in summer": "Das grüne Tal von Livigno mit See und Bergen im Sommer",
  },
};

const MONTHS = {
  en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  it: ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"],
  de: ["JAN", "FEB", "MÄR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"],
};
export const months = MONTHS[lang];

// t("Save {name} to my day plan", { name: "Lago del Gallo loop" })
export function t(text, vars = {}) {
  const out = (TEXTS[lang] && TEXTS[lang][text]) || text;
  return out.replace(/\{(\w+)\}/g, (all, key) => (key in vars ? vars[key] : all));
}
