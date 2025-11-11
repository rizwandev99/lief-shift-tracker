'use client';

import Link from 'next/link';

export default function LoginButton() {
  return (
    <Link
      href="/auth/login"
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-emerald-200/50"
    >
      Sign In
    </Link>
  );
}
