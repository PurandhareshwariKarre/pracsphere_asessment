"use client";
import * as React from "react";
import Link from "next/link";


export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-300 h-full flex flex-col p-6"><h1 className="mb-12 font-extrabold text-2xl text-black tracking-wide">PracSphere</h1>
      <nav className="flex flex-col gap-6 font-medium text-gray-800">
        <Link
          href="/dashboard"
          className="hover:text-teal-600 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/tasks"
          className="hover:text-teal-600 transition-colors"
        >
          Tasks
        </Link>
        <Link
          href="/profile"
          className="hover:text-teal-600 transition-colors"
        >
          Profile
        </Link>
        <Link
          href="/api/auth/signout"
          className="text-red-600 hover:text-red-700 mt-auto transition-colors"
        >
          Logout
        </Link>
      </nav>
    </aside>
  );
}