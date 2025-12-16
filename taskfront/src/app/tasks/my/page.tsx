"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react"; // <-- Icons added

export default function MyTasksPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);

  const loadMyTasks = async () => {
    if (!token) return;
    try {
      const res = await api.get("/tasks/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load your tasks. Please login again.");
      router.push("/login");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.log(err);
      alert("Failed to delete task");
    }
  };

  useEffect(() => {
    loadMyTasks();
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">My Tasks</h1>

        <Link
          href="/tasks/create"
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border p-4 rounded flex justify-between items-center shadow-sm"
            >
              <div>
                <h2 className="font-bold text-xl">{task.title}</h2>
                <p className="text-gray-600">{task.description}</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Edit Icon */}
                <Link
                  href={`/tasks/edit/${task.id}`}
                  className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition"
                  title="Edit Task"
                >
                  <Pencil size={20} />
                </Link>

                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                  title="Delete Task"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
