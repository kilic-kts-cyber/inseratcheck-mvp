export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
