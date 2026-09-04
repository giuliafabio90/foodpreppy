import "./globals.css";

export const metadata = {
  title: "Tabella Settimanale",
  description:
    "Pianificatore di pasti settimanali: calorie, frequenze per categoria alimentare, range macro per pasto e ricette a ingredienti, con schema settimanale generato e ricalibrato in automatico.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
