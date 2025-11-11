import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextRequest, NextResponse } from "next/server";

const auth0 = new Auth0Client();

export async function GET(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;

    // Handle login
    if (pathname === "/api/auth/login") {
      return await auth0.handleLogin(req);
    }

    // Handle logout
    if (pathname === "/api/auth/logout") {
      return await auth0.handleLogout(req);
    }

    // Handle callback
    if (pathname === "/api/auth/callback") {
      return await auth0.handleCallback(req);
    }

    // Handle profile
    if (pathname === "/api/auth/profile") {
      const session = await auth0.getSession(req);
      if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      return NextResponse.json(session.user);
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    console.error("Auth0 error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication error" },
      { status: 500 }
    );
  }
}
