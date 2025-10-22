"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: email.toLowerCase(),
      password,
    });

    if (result?.ok) {
      window.location.href = "/dashboard";
    } else {
      setError(result?.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full space-y-6"
        aria-label="Login Form"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700">Welcome Back</h1>
        {error && (
          <p
            role="alert"
            className="text-red-600 bg-red-100 p-3 rounded text-center text-sm tracking-wide"
          >
            {error}
          </p>
        )}

        <div>
          <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-gray-700 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 w-full py-3 rounded-lg text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-700">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
