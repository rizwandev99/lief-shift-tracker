import { supabaseAdmin } from "./supabaseAdmin";

export async function ensureUser({
  auth0Id,
  email,
  fullName,
}: {
  auth0Id: string;
  email?: string;
  fullName?: string;
}) {
  const { error } = await supabaseAdmin
    .from("users")
    .upsert(
      { auth0_sub: auth0Id, email, full_name: fullName },
      { onConflict: "auth0_sub" }
    );
  if (error) throw error;
}


