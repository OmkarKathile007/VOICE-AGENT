import { NextResponse } from "next/server";

type RoleKey = "FPO" | "SHG" | "Startup" | "Processor" | "Consumer";

type AuthUser = {
  identifier: string;
  password: string;
  roles?: RoleKey[];
};

const DEFAULT_USERS: AuthUser[] = [
  {
    identifier: "demo@shreeanna.com",
    password: "password123",
    roles: ["FPO", "SHG", "Startup", "Processor", "Consumer"],
  },
  {
    identifier: "+919876543210",
    password: "password123",
    roles: ["SHG", "Consumer"],
  },
];

const normalizeIdentifier = (value: string) => {
  const trimmed = value.trim();
  const isPhone = /^\+?[0-9\s-]{10,20}$/.test(trimmed);
  if (isPhone) return trimmed.replace(/[\s-]/g, "");
  return trimmed.toLowerCase();
};

const isValidIdentifier = (value: string) => {
  const trimmed = value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const phoneOk = /^\+?[0-9]{10,15}$/.test(trimmed.replace(/[\s-]/g, ""));
  return emailOk || phoneOk;
};

function loadUsers(): AuthUser[] {
  const raw = process.env.AUTH_USERS_JSON;
  if (!raw) return DEFAULT_USERS;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_USERS;

    const users: AuthUser[] = parsed
      .filter((u) => u && typeof u.identifier === "string" && typeof u.password === "string")
      .map((u) => ({
        identifier: u.identifier,
        password: u.password,
        roles: Array.isArray(u.roles) ? u.roles : undefined,
      }));

    return users.length ? users : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const identifier = body?.identifier as string | undefined;
  const password = body?.password as string | undefined;
  const role = body?.role as RoleKey | undefined;

  if (!identifier || !password || !role) {
    return NextResponse.json({ error: "Identifier, password and role are required." }, { status: 400 });
  }

  if (!isValidIdentifier(identifier)) {
    return NextResponse.json({ error: "Invalid email or phone number." }, { status: 400 });
  }

  const users = loadUsers();
  const normalized = normalizeIdentifier(identifier);

  const user = users.find((u) => normalizeIdentifier(u.identifier) === normalized);

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  if (user.roles?.length && !user.roles.includes(role)) {
    return NextResponse.json({ error: "This account cannot access the selected role." }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
