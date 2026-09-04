import { auth } from "../../../auth";
import { getUserData, setUserData } from "../../../lib/db";

export async function GET() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return Response.json({ error: "Non autenticato." }, { status: 401 });
  }
  const data = await getUserData(session.user.id);
  return Response.json({ data });
}

export async function PUT(request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return Response.json({ error: "Non autenticato." }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON non valido." }, { status: 400 });
  }
  await setUserData(session.user.id, body);
  return Response.json({ ok: true });
}
