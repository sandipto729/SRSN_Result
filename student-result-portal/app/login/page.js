"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loginType, setLoginType] = useState("google"); // "google" or "credentials"
  const [credentials, setCredentials] = useState({
    userId: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const role = session.user?.role;
      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "student") {
        router.replace("/dashboard/student");
      } else {
        router.replace("/");
      }
    }
  }, [status, session, router]);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        userId: credentials.userId,
        email: credentials.email,
        phone: credentials.phone,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your User ID, Email, and Phone number.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl mb-4">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14v9M12 14l-9-5M12 14l9-5M12 5v9"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            SRSN Result Portal
          </h1>
          <p className="text-gray-600">
            Sri Ramkrishna Siksha Niketan
          </p>
        </div>

        {/* Login Type Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setLoginType("google");
              setError("");
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              loginType === "google"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Google
          </button>
          <button
            onClick={() => {
              setLoginType("credentials");
              setError("");
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              loginType === "credentials"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Student Login
          </button>
        </div>

        {loginType === "google" ? (
          <div className="space-y-4">
            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
            <p className="text-xs text-gray-500 text-center">
              Available for both Admin and Students
            </p>
          </div>
        ) : (
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={credentials.userId}
                onChange={(e) =>
                  setCredentials({ ...credentials, userId: e.target.value })
                }
                required
                placeholder="Enter your User ID"
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-400 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                User ID written during online admission
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-400 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={credentials.phone}
                onChange={(e) =>
                  setCredentials({ ...credentials, phone: e.target.value })
                }
                required
                placeholder="Enter your phone number"
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-400 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
            <p className="text-xs text-gray-500 text-center">
              Only for Students (Admin must use Google login)
            </p>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Access your academic results securely
          </p>
        </div>
      </div>
    </div>
  );
}
