"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">
              SRSN Result Portal
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {session && (
              <>
                <span className="text-white text-sm">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

