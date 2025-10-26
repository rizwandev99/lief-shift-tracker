'use client';

import Link from 'next/link';

export default function LoginButton() {
  return (
    <Link
      href="/auth/login"
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
    >
      Sign In
    </Link>
  );
}