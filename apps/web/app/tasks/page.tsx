"use client";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate?: string;
  status: string;
}

const initialForm = { title: "", description: "", dueDate: "", status: "pending" };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const fetchTasks = () => {
    setLoading(true);
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAddTask = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, updates: form }),
      });
    } else {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setForm(initialForm);
    setEditingId(null);
    fetchTasks();
  };

  const handleEdit = (task: Task) => {
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      status: task.status,
    });
    setEditingId(task._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => (filter === "all" ? true : task.status === filter));

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-black text-white rounded shadow hover:bg-gray-800 transition"
      >
        &larr; Back to Dashboard
      </button>
      <div className="max-w-3xl mx-auto mt-8 p-4">
        <h1 className="text-2xl mb-4 font-bold text-gray-900">Tasks</h1>
        <button
          className="mb-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-black transition"
          onClick={handleAddTask}
        >
          + Add Task
        </button>

        {/* Filter Buttons */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded border ${filter === "all" ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded border ${filter === "completed" ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded border ${filter === "pending" ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}
          >
            Pending
          </button>
        </div>

        {/* Form for Add/Edit */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className="mb-6 p-6 border border-gray-300 rounded bg-white shadow-sm">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="mb-3 w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="mb-3 w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              type="date"
              className="mb-3 w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Due Date"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mb-3 w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                {editingId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Task list */}
        {filteredTasks.length === 0 ? (
          <div className="text-center text-gray-500">No tasks found.</div>
        ) : (
          <ul>
            {filteredTasks.map((task) => (
              <li
                key={task._id}
                className="mb-3 p-4 border rounded flex justify-between items-center gap-5 bg-white shadow"
              >
                <div className="text-gray-900">
                  <div className="font-semibold text-lg">{task.title}</div>
                  <div className="text-gray-700">{task.description}</div>
                  <div className="text-sm text-gray-600">
                    Status: <span className="font-medium">{task.status}</span>
                  </div>
                  {task.dueDate && (
                    <div className="text-sm text-gray-600">Due: {task.dueDate.slice(0, 10)}</div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(task)}
                    className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded text-black transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
