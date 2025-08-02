// app/page.js
// This is our main homepage - the first thing users see
// Think of this as the hospital's main entrance

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      {/* Main container - like the hospital lobby */}
      <div className="max-w-4xl mx-auto">
        {/* Header section - hospital welcome sign */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🏥 Lief Shift Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Healthcare worker shift management made simple and secure
          </p>

          {/* Status indicator - shows we're building */}
          <div className="inline-block bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2">
            <span className="text-yellow-800 font-semibold">
              🚧 Under Development - Feature by Feature
            </span>
          </div>
        </div>

        {/* Feature preview cards - what we're building */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Care Worker Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              👨‍⚕️ Care Workers
            </h2>
            <ul className="text-gray-600 space-y-2">
              <li>✅ Clock in/out with GPS verification</li>
              <li>📝 Add optional notes to shifts</li>
              <li>📍 Location-based shift validation</li>
              <li>📱 Mobile-friendly interface</li>
            </ul>
          </div>

          {/* Manager Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              👩‍💼 Managers
            </h2>
            <ul className="text-gray-600 space-y-2">
              <li>👥 View all staff in real-time</li>
              <li>📊 Shift analytics and reports</li>
              <li>🎯 Set location perimeters</li>
              <li>📈 Track attendance patterns</li>
            </ul>
          </div>
        </div>

        {/* Development progress tracker */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🏗️ Development Progress
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
              <span className="text-gray-700">Project Setup Complete ✅</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-gray-300 rounded-full mr-3"></span>
              <span className="text-gray-500">
                UI Library Integration (Next)
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-gray-300 rounded-full mr-3"></span>
              <span className="text-gray-500">
                Database Setup (Coming Soon)
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
