declare module "@auth0/nextjs-auth0" {
  import { NextApiRequest, NextApiResponse } from "next";

  export function handleAuth(req: NextApiRequest, res: NextApiResponse): unknown;
  export function handleLogin(req: NextApiRequest, res: NextApiResponse): unknown;
  export function handleLogout(req: NextApiRequest, res: NextApiResponse): unknown;
  export function handleCallback(req: NextApiRequest, res: NextApiResponse): unknown;
  export function getSession(req: NextApiRequest, res: NextApiResponse): unknown;
  export function withApiAuthRequired(apiRoute: (req: NextApiRequest, res: NextApiResponse) => unknown): (req: NextApiRequest, res: NextApiResponse) => unknown;
  
  const _default: {
    handleAuth: typeof handleAuth;
    handleLogin: typeof handleLogin;
    handleLogout: typeof handleLogout;
    handleCallback: typeof handleCallback;
    getSession: typeof getSession;
    withApiAuthRequired: typeof withApiAuthRequired;
  };
  export default _default;
}

declare module "@auth0/nextjs-auth0/client" {
  import type { ReactNode, FC } from "react";

  interface User {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string | null;
    [key: string]: unknown;
  }

  export const UserProvider: FC<{ children?: ReactNode }>;
  export function useUser(): { user?: User; isLoading: boolean; error?: Error };
  export function getAccessToken(...args: unknown[]): Promise<string | undefined>;
}