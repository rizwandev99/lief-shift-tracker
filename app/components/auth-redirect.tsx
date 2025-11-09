// app/components/auth-redirect.tsx
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthRedirect() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // User is authenticated, check their role via API
      fetch('/api/check-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            if (data.role === 'manager' || data.role === 'admin') {
              router.push('/manager');
            } else if (data.role === 'worker') {
              router.push('/worker');
            }
            // If unknown role, stay on home page
          }
          // If API fails, stay on home page
        })
        .catch(error => {
          console.error('Error checking user role:', error);
          // Stay on home page if there's an error
        });
    }
  }, [user, isLoading, router]);

  // This component doesn't render anything
  return null;
}
