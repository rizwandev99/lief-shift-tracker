import { redirect } from "next/navigation";
import { auth0 } from "./auth0";

export async function requireRole(required: "worker" | "manager") {
  const session = await auth0.getSession();
  const roles: string[] = session?.user?.["https://lief.app/roles"] || [];
  if (!roles.includes(required)) redirect("/");
  return session!.user;
}


