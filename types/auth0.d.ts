declare module "@auth0/nextjs-auth0" {
  export function handleAuth(...args: any[]): any;
  export function handleLogin(...args: any[]): any;
  export function handleLogout(...args: any[]): any;
  export function handleCallback(...args: any[]): any;
  export function getSession(...args: any[]): any;
  export function withApiAuthRequired(...args: any[]): any;
  const _default: any;
  export default _default;
}

declare module "@auth0/nextjs-auth0/client" {
  import type { ReactNode, FC } from "react";
  export const UserProvider: FC<{ children?: ReactNode }>;
  export function useUser(): { user?: any; isLoading: boolean; error?: any };
  export function getAccessToken(...args: any[]): any;
}
