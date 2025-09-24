import Link from "next/link";
import ClockInterface from "./components/clock-interface";
import LoginForm from "./components/login-form";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import LoginButton from "./components/login-button";

export default async function HomePage() {
   const session = await auth0.getSession();

   // If user is authenticated, redirect based on role
   if (session?.user) {
     // Import prisma client dynamically to avoid SSR issues
     const { default: prisma } = await import("@/lib/prisma");
     const user = await prisma.users.findUnique({
       where: { email: session.user.email },
       select: { role: true },
     });

     if (user?.role === "manager" || user?.role === "admin") {
       // Redirect managers to manager dashboard
       redirect("/manager");
     } else {
       // Redirect workers to worker dashboard
       redirect("/worker");
     }
   }

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <img
              src="/lief-logo-with-name.svg"
              alt="Lief Logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </nav>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Healthcare Shift
              <span className="block text-blue-600">Tracking Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your healthcare workforce management with our advanced shift tracking system.
              Ensure compliance, improve efficiency, and maintain accurate records with location-based verification.
            </p>

            <div className="flex justify-center">
              <LoginForm />
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Location Verification</h3>
              <p className="text-gray-600">
                GPS-based geofencing ensures staff are at their assigned locations during clock-in and clock-out.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-600 text-2xl">⏱️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor active shifts, track working hours, and manage staff schedules in real-time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-600 text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Comprehensive analytics and reporting tools for managers to optimize workforce management.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Healthcare Organizations</h2>
              <p className="text-gray-600">Join thousands of healthcare professionals using our platform</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">268+</div>
                <div className="text-gray-600">Shifts Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                <div className="text-gray-600">Active Staff</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
                <div className="text-gray-600">Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/lief-logo-with-name.svg"
                  alt="Lief Logo"
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-400">
                Revolutionizing healthcare workforce management with innovative technology.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Lief Healthcare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
