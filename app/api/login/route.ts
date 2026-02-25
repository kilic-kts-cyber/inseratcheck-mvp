import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'E-Mail und Passwort erforderlich' },
      { status: 400 }
    );
  }

  // TEMPORÄRER Test-Login
  // Hier später Supabase oder Datenbank einbauen

  if (email === 'test@test.de' && password === '123456') {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: 'Ungültige Zugangsdaten' },
    { status: 401 }
  );
}
