"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TaskList from "../components/Tasklist";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate?: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/tasks")
        .then((res) => res.json())
        .then((data: Task[]) => setTasks(data))
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
        <Topbar user={session?.user} />
        <main className="flex-1 p-6 overflow-auto">
          <TaskList tasks={tasks} />
        </main>
      </div>
    </div>
  );
}
