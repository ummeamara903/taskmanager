"use client";

import { api } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Load existing task
  const loadTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await api.get(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTitle(res.data.title);
    setDescription(res.data.description);
  };

  // Update task
  const handleUpdate = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await api.put(
      `/tasks/${id}`,
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Instead of navigating or alerting
    // Send user back to tasks list
    router.push("/tasks");

  } catch (err) {
    console.log(err);
  }
};


  useEffect(() => {
    loadTask();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>

      <input
        className="border w-full p-2 mb-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border w-full p-2 mb-3 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white w-full py-2 rounded"
      >
        Update
      </button>
    </div>
  );
}
