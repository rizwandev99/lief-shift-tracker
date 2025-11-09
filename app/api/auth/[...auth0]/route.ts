import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextRequest } from 'next/server';

const auth0Client = new Auth0Client();

export async function GET(req: NextRequest) {
  try {
    const session = await auth0Client.getSession(req);
    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Auth0 error:', error);
    return new Response('Authentication error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth0Client.getSession(req);
    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Auth0 error:', error);
    return new Response('Authentication error', { status: 500 });
  }
}
