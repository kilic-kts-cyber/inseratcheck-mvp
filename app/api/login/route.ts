import { NextResponse } from 'next/server';

export async function POST(req: Request) {

  const body = await req.json();

  const email = body.email;
  const password = body.password;

  if (email === 'test@test.de' && password === '123456') {
    return NextResponse.json({
      success: true
    });
  }

  return NextResponse.json(
    {
      error: 'Falsche Zugangsdaten'
    },
    {
      status: 401
    }
  );
}
