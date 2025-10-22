"use client";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate?: string;
  status: string;
}

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (!tasks || tasks.length === 0)
    return <div className="text-center text-gray-500">No tasks found.</div>;

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
      <table className="min-w-full bg-white text-black rounded-lg">
        <thead>
          <tr className="bg-blue-200">
            <th className="px-6 py-3 text-left font-semibold tracking-tight">Title</th>
            <th className="px-6 py-3 text-left font-semibold tracking-tight">Description</th>
            <th className="px-6 py-3 text-left font-semibold tracking-tight">Due Date</th>
            <th className="px-6 py-3 text-left font-semibold tracking-tight">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task: Task) => (
            <tr
              key={task._id}
              className="border-b border-gray-300 hover:bg-teal-100 transition-colors"
            >
              <td className="px-6 py-3">{task.title}</td>
              <td className="px-6 py-3">{task.description}</td>
              <td className="px-6 py-3">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
              </td>
              <td className="px-6 py-3 capitalize">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
