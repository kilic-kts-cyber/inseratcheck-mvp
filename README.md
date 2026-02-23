# InseratCheck MVP

Kostenloser Gebrauchtwagen-Inserat-Check. Regelbasierte Risikoanalyse,
Verhandlungsfragen, PDF-Export. Kein Backend · Kein Login · Kein E-Mail-Zwang.

## Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Werkstatt-Link anpassen

```ts
// lib/config.ts
export const WORKSHOP_BOOKING_URL = 'https://deine-buchungsseite.de';
```

## Routen

| Route     | Inhalt                        |
|-----------|-------------------------------|
| `/`       | Landing Page                  |
| `/check`  | Formular (60–90 Sek.)         |
| `/result` | Ergebnisseite (State via URL) |

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- jsPDF (client-side, kein Backend)
- State via URL-Query-Parameter
# rebuild
