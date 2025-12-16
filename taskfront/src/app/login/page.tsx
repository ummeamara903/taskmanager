"use client";
import { useState } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedIn, setToken } = useAuthStore();

  const handleLogin = async () => {
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);

      const res = await api.post("/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Get token from response
      const token = (res.data as { access_token: string }).access_token;

      // Store token in Zustand state
      setLoggedIn(true);
      setToken(token);

      // Navigate to user's tasks page
      router.push("/tasks/my");
    } catch (err) {
      alert("Login failed! Check credentials.");
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-5 shadow-lg bg-white rounded">
      <h1 className="text-2xl mb-4 font-bold">Login</h1>

      <input
        type="text"
        placeholder="Username or Email"
        className="border w-full p-2 mb-3 rounded"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border w-full p-2 mb-3 rounded"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  );
}
