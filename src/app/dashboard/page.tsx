import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <p className="text-gray-600 mt-2">
            Welcome, {user.email}
          </p>

          <p className="text-gray-600">
            Your role is:{" "}
            <span className="font-bold text-blue-600">{user.role}</span>
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Books Section
          </h2>

          <p className="text-gray-600 mb-4">
            Admin can add, edit, delete, and view books. Student can only view
            books.
          </p>

          <a
            href="/books"
            className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            Open Books
          </a>
        </div>
      </div>
    </main>
  );
}