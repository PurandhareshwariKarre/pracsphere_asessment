"use client";
import * as React from "react";
import type { User } from "@repo/types";

interface TopbarProps {
  user?: User | null;
}

export default function Topbar({ user }: TopbarProps) {
  return (
    <header className="h-16 w-full bg-black flex items-center px-8 justify-between text-black shadow">
      <div className="text-2xl font-bold tracking-wide text-white">Dashboard</div>
      <div>
        {user && (user.name || user.email) && (
          <span className="rounded-full bg-teal-400 px-5 py-2 font-semibold tracking-wide select-none text-black">
            {user.name ?? user.email}
          </span>
        )}
      </div>
    </header>
  );
}
