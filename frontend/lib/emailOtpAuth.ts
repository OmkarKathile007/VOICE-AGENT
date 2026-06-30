const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const headers = SUPABASE_ANON_KEY
  ? {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    }
  : null;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export async function requestEmailOtp(email: string) {
  if (!SUPABASE_URL || !headers) {
    return { error: "Supabase is not configured." };
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, create_user: true }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data?.msg || data?.error_description || "Could not send OTP." };
  }

  return { error: null };
}

export async function verifyEmailOtp(email: string, token: string) {
  if (!SUPABASE_URL || !headers) {
    return { error: "Supabase is not configured." };
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, token, type: "email" }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data?.msg || data?.error_description || "Invalid OTP." };
  }

  return { error: null };
}
