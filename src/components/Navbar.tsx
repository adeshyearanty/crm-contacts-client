// app/Navbar.tsx

"use client";

import { getAuthToken, removeAuthToken } from "@/utils/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const token = getAuthToken();
  const router = useRouter();

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  console.log(token, "TOKEN");

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                CRM Contact Manager
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <Link
              href="/contacts"
              className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              Contacts
            </Link>
            {token ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
