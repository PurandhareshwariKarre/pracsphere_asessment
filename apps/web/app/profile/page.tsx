"use client";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  if (!session)
    return <div className="p-8 text-xl text-center text-gray-700">Not logged in</div>;
  const user = session.user;

  return (
    <>
      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-black text-white rounded shadow hover:bg-gray-800 transition"
      >
        &larr; Back to Dashboard
      </button>

      <div className="max-w-lg mx-auto mt-12 bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-4xl font-bold text-white mb-6 select-none"
          aria-label="User Avatar"
        >
          {user?.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
            : user?.email?.[0].toUpperCase()}
        </div>

        <div className="text-2xl font-semibold mb-1 text-gray-900">{user?.name || "No Name"}</div>
        <div className="text-gray-600 mb-6">{user?.email}</div>

        <div className="text-sm text-gray-500 mb-4">Want to change your password?</div>
        <button
          onClick={() => alert("Password reset flow coming soon!")}
          className="bg-gray-200 hover:bg-gray-300 text-black px-6 py-3 rounded-lg font-semibold transition"
        >
          Reset Password
        </button>
      </div>
    </>
  );
}
