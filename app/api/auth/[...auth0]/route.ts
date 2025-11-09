import { createAuthServer } from "@auth0/nextjs-auth0/server";

const handler = createAuthServer();

export const GET = handler.auth;
export const POST = handler.auth;
