"use client";
import * as React from "react";
import type { Task } from "@repo/types";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (!tasks || tasks.length === 0)
    return <div className="text-center text-gray-500 py-8">No tasks found.</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Title</th>
              <th className="px-6 py-3 text-left font-semibold">Description</th>
              <th className="px-6 py-3 text-left font-semibold">Due Date</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {tasks.map((task: Task) => (
              <tr
                key={task._id}
                className="border-t border-gray-200 hover:bg-blue-50 transition-colors"
              >
                <td className="px-6 py-4">{task.title}</td>
                <td className="px-6 py-4">{task.description}</td>
                <td className="px-6 py-4">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("en-GB")
                    : ""}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                  {task.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
