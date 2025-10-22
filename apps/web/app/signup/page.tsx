"use client";

import { useState } from "react";
import Link from "next/link";

interface ApiResponse {
  error?: string;
  message?: string;
}

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.toLowerCase(), password }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Signup failed");
      } else {
        setSuccess(data.message || "Signup successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full space-y-6"
        aria-label="Signup Form"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700">Create an Account</h1>
        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded text-center text-sm tracking-wide" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-700 bg-green-100 p-3 rounded text-center text-sm tracking-wide" role="status">
            {success}
          </p>
        )}

        <div>
          <label htmlFor="name" className="block mb-1 text-gray-700 font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

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

        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-gray-700 font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 w-full py-3 rounded-lg text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-700">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
