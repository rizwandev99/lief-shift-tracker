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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
            <div className="flex items-center space-x-4">
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-6">
              Healthcare Shift
              <span className="block text-emerald-600">Tracking Made Simple</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline healthcare workforce management at City General Hospital with our intuitive shift tracking system.
              Ensure compliance, improve efficiency, and maintain accurate records with location-based verification.
            </p>

            <div className="flex justify-center">
              <LoginForm />
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-4">💡 Try the app with these demo accounts:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Worker Demo */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-emerald-600 text-lg mr-2">👩‍⚕️</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Healthcare Worker</p>
                      <p className="text-xs text-emerald-600">Clock in/out & view shifts</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <code className="bg-emerald-50 px-1 py-0.5 rounded text-emerald-700">alice.johnson@citygeneral.com</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Password:</span>
                      <code className="bg-emerald-50 px-1 py-0.5 rounded text-emerald-700">Alice1234$</code>
                    </div>
                  </div>
                </div>

                {/* Manager Demo */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-emerald-600 text-lg mr-2">👨‍⚕️</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Manager</p>
                      <p className="text-xs text-emerald-600">Analytics & staff management</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <code className="bg-emerald-50 px-1 py-0.5 rounded text-emerald-700">robert.smith@citygeneral.com</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Password:</span>
                      <code className="bg-emerald-50 px-1 py-0.5 rounded text-emerald-700">Robert1234$</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Lief?</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Discover the features that make healthcare shift tracking effortless and reliable</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-200 group">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-emerald-600 text-4xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-emerald-800 transition-colors duration-300">Location Verification</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  GPS-based geofencing ensures staff are at their assigned locations during clock-in and clock-out.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-200 group">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-emerald-600 text-4xl">🌿</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-emerald-800 transition-colors duration-300">Real-time Tracking</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Monitor active shifts, track working hours, and manage staff schedules in real-time.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-200 group">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-emerald-600 text-4xl">🌳</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-emerald-800 transition-colors duration-300">Analytics Dashboard</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Comprehensive analytics and reporting tools for managers to optimize workforce management.
                </p>
              </div>
            </div>
          </div>


          {/* Stats Section */}
          <div className="mt-20 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl shadow-lg p-10 border border-emerald-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Trusted by City General Hospital</h2>
              <p className="text-gray-600 text-lg">Join healthcare professionals using our platform</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="text-4xl font-bold text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-300">268+</div>
                <div className="text-gray-700 font-medium">Shifts Tracked</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-300">12</div>
                <div className="text-gray-700 font-medium">Active Staff</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-300">1</div>
                <div className="text-gray-700 font-medium">Organization</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                <div className="text-gray-700 font-medium">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img
                src="/lief-logo-with-name.svg"
                alt="Lief Logo"
                className="h-8 w-auto"
              />
              <span className="text-gray-300 text-sm">&copy; 2025 Lief Healthcare. All rights reserved.</span>
            </div>

            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">About</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Contact</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
