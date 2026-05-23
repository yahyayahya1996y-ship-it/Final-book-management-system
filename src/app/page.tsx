import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Book Management System
        </h1>

        <p className="text-gray-600 mb-6">
          Final exam demo project using Next.js API routes, JWT authentication,
          2FA, roles, and CRUD.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            Student Signup
          </Link>

          <Link
            href="/login"
            className="bg-gray-900 text-white px-5 py-3 rounded-lg hover:bg-gray-800"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}