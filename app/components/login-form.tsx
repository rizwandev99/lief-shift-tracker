'use client';

import Link from 'next/link';

export default function LoginForm() {
  return (
    <Link
      href="/auth/login"
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
    >
      Get Started
    </Link>
  );
}