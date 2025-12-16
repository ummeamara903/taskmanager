"use client";
import { useState } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    // Basic frontend validation
    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Enter a valid email");
      setLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(
        "/auth/register",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(res.data.message); // Shows "User registered successfully!"
      router.push("/login");
    } catch (err: any) {
      console.log("Backend error:", err.response?.data);

      // Display backend error (email exists, username exists, etc.)
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Registration failed. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow-lg bg-white rounded">
      <h1 className="text-2xl mb-4 font-bold">Register</h1>

      {error && <p className="text-red-600 mb-3 font-medium">{error}</p>}

      <input
        type="text"
        placeholder="Username"
        className="border w-full p-2 mb-3 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border w-full p-2 mb-3 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border w-full p-2 mb-3 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <p className="mt-3 text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600">
          Login
        </a>
      </p>
    </div>
  );
}
