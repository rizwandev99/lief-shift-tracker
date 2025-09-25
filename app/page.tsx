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
              Streamline your healthcare workforce management with our intuitive shift tracking system.
              Ensure compliance, improve efficiency, and maintain accurate records with location-based verification.
            </p>

            <div className="flex justify-center">
              <LoginForm />
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-emerald-600 text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location Verification</h3>
              <p className="text-gray-600 leading-relaxed">
                GPS-based geofencing ensures staff are at their assigned locations during clock-in and clock-out.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-emerald-600 text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor active shifts, track working hours, and manage staff schedules in real-time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-emerald-600 text-3xl">🌳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive analytics and reporting tools for managers to optimize workforce management.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl shadow-lg p-10 border border-emerald-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Trusted by Healthcare Organizations</h2>
              <p className="text-gray-600 text-lg">Join thousands of healthcare professionals using our platform</p>
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
                <div className="text-4xl font-bold text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-300">5</div>
                <div className="text-gray-700 font-medium">Organizations</div>
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
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/lief-logo-with-name.svg"
                  alt="Lief Logo"
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Revolutionizing healthcare workforce management with innovative technology.
                Our platform ensures seamless shift tracking and location verification for healthcare professionals.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌱</span>
                </div>
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌿</span>
                </div>
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌳</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-emerald-400">Product</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-emerald-400">Company</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">About</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-emerald-400">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Documentation</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img
                src="/lief-logo-with-name.svg"
                alt="Lief Logo"
                className="h-6 w-auto opacity-75"
              />
              <span className="text-gray-400">&copy; 2025 Lief Healthcare. All rights reserved.</span>
            </div>
            <p className="text-gray-500 text-sm">
              Built with care for healthcare professionals • Made with 🌱 nature-inspired design
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
