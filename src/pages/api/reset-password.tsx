import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  const response = await fetch('https://your-django-backend.com/api/reset-password/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, password }),
  });

  if (response.ok) {
    return NextResponse.json({ message: 'Passwort erfolgreich zurückgesetzt' });
  } else {
    return NextResponse.json({ message: 'Fehler beim Zurücksetzen des Passworts' }, { status: 400 });
  }
}
