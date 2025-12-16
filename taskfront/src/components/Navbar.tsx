"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { loggedIn, setLoggedIn } = useAuthStore();

  useEffect(() => {
    const hasToken = !!localStorage.getItem("token");
    setLoggedIn(hasToken);
  }, [setLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setLoggedIn(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg py-4 px-6 text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide hover:opacity-90 transition"
        >
          TaskManager
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6 text-lg">
          <Link
            href="/tasks"
            className="hover:bg-white/20 px-3 py-2 rounded-xl transition-colors"
          >
            All Tasks
          </Link>

          {loggedIn && (
            <Link
              href="/tasks/my"
              className="hover:bg-white/20 px-3 py-2 rounded-xl transition-colors"
            >
              My Tasks
            </Link>
          )}

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-xl hover:bg-blue-100 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:bg-white/20 px-3 py-2 rounded-xl transition-colors"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-xl hover:bg-blue-100 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
