import { redirect } from "next/navigation";
import { auth0 } from "./auth0";

export async function requireUser() {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/");
  return session.user;
}


