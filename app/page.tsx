// app/page.tsx - SERVER COMPONENT for Auth0 v4
import { auth0 } from "../lib/auth0";
import ClockInterface from "./components/clock-interface";

export default async function HomePage() {
  // const session = await auth0.getSession();

  // if (!session) {
  //   return (
  //     <main className="flex items-center justify-center min-h-screen">
  //       <div className="text-center p-8 bg-white rounded-lg shadow-md">
  //         <h2 className="text-2xl font-bold mb-4">
  //           🔒 Authentication Required
  //         </h2>
  //         <a
  //           href="/auth/login"
  //           className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  //         >
  //           Log In
  //         </a>
  //       </div>
  //     </main>
  //   );
  // }

  return (
    <main>
      <ClockInterface />
      <div className="mt-6 flex justify-center">
        <a
          href="/manager"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          👨‍💼 Manager Dashboard
        </a>
      </div>
    </main>
  );
}
