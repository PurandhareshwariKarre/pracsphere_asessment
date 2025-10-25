"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Sidebar } from "@repo/ui";
import { Topbar } from "@repo/ui";
import { Tasklist } from "@repo/ui";
import type { Task } from "@repo/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/tasks")
        .then((res) => res.json())
        .then(data => setTasks(Array.isArray(data) ? data : []))
        .catch(() => setTasks([]))
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) return <div>Loading...</div>;
  if (status === "unauthenticated") {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard header bar */}
        <div className="w-full bg-black h-16 flex items-center pl-8 shadow-md">
          <span className="text-2xl font-extrabold tracking-wide text-white">
            Dashboard
          </span>
          {session?.user && (session.user.name || session.user.email) && (
            <span className="ml-auto mr-8 rounded-full bg-teal-400 px-5 py-2 font-semibold tracking-wide select-none text-black">
              {session.user.name ?? session.user.email}
            </span>
          )}
        </div>
        {/* Main content area with centered card */}
        <main className="flex-1 flex flex-col items-center justify-start p-12 bg-gray-50">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}
          <div className="w-full max-w-4xl">
            {/* Card for TaskList */}
            <div className="rounded-lg shadow-lg border border-gray-300 bg-white">
              <Tasklist tasks={tasks} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
