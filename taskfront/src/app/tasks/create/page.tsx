"use client";
import { useState } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function CreateTaskPage() {
  const router = useRouter();
  const { token } = useAuthStore(); // Get JWT from global state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTask = async () => {
    if (!token) {
      alert("You must be logged in to create a task!");
      router.push("/login");
      return;
    }

    try {
      await api.post(
        "/tasks",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } } // send JWT
      );

      router.push("/tasks/my"); // redirect to MyTasks
    } catch (err: any) {
      console.log(err.response?.data);
      alert(err.response?.data?.detail || "Failed to create task");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Create Task</h1>

      <input
        type="text"
        placeholder="Task Title"
        className="border w-full p-2 mb-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Task Description"
        className="border w-full p-2 mb-3 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleCreateTask}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}
