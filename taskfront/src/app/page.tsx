import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h1 className="text-5xl font-bold mb-6 text-blue-600">
        Welcome to Task Manager
      </h1>
      <p className="text-gray-700 mb-6">
        Manage your tasks efficiently and effortlessly.
      </p>
      <Link
        href="/tasks"
        className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
      >
        Go to Tasks
      </Link>
    </div>
  );
}
