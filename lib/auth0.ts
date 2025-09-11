import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Single Auth0 client instance for server-side usage (v4 pattern)
export const auth0 = new Auth0Client();
