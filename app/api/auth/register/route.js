import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { getUserByEmail, createUser } from "../../../../lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Inserisci un'email valida." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: "La password deve avere almeno 8 caratteri." }, { status: 400 });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return Response.json({ error: "Esiste già un account con questa email." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = randomUUID();
  await createUser(id, email, passwordHash);

  return Response.json({ ok: true });
}
