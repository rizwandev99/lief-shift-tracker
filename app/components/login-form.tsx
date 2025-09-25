'use client';

import Link from 'next/link';

export default function LoginForm() {
  return (
    <Link
      href="/auth/login"
      className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-200/50 transform hover:scale-105"
    >
      Get Started
    </Link>
  );
}