"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import Link from "next/link";

export default function AllTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks"); // Public endpoint
      setTasks(res.data);
    } catch (err) {
      console.log("Failed to load all tasks", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">All Tasks</h1>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border p-4 rounded">
              <h2 className="font-bold">{task.title}</h2>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
