import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InseratCheck – Kostenloser Gebrauchtwagen-Check',
  description:
    'Erhalte sofort eine Risikoanalyse, konkrete Hinweise und professionelle ' +
    'Verhandlungsfragen – kostenlos und ohne Anmeldung.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
