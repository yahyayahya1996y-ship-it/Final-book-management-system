"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";

type CurrentUser = {
  userId: string;
  email: string;
  role: "admin" | "student";
};

export default function BooksPage() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function refreshBooks() {
    const response = await fetch("/api/books");
    const data = await response.json();

    if (!response.ok) {
      router.push("/login");
      return;
    }

    setBooks(data.books);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      const userResponse = await fetch("/api/auth/me");
      const userData = await userResponse.json();

      if (!userResponse.ok) {
        router.push("/login");
        return;
      }

      const booksResponse = await fetch("/api/books");
      const booksData = await booksResponse.json();

      if (!booksResponse.ok) {
        router.push("/login");
        return;
      }

      if (isMounted) {
        setUser(userData.user);
        setBooks(booksData.books);
      }
    }

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (editingBookId) {
      const response = await fetch(`/api/books/${editingBookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Update failed");
        return;
      }

      setMessage("Book updated successfully");
      setEditingBookId(null);
    } else {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Add failed");
        return;
      }

      setMessage("Book added successfully");
    }

    setTitle("");
    setAuthor("");
    setDescription("");
    refreshBooks();
  }

  function startEdit(book: Book) {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
  }

  async function deleteBook(id: string) {
    const response = await fetch(`/api/books/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Delete failed");
      return;
    }

    setMessage("Book deleted successfully");
    refreshBooks();
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
  }

  const isAdmin = user?.role === "admin";

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Books</h1>

            <p className="text-gray-600 mt-1">
              Logged in as {user?.email} - Role:{" "}
              <span className="font-bold text-blue-600">{user?.role}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {isAdmin && (
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingBookId ? "Edit Book" : "Add Book"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Book title"
                required
              />

              <input
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Author"
                required
              />

              <textarea
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                required
              />

              <button className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                {editingBookId ? "Update Book" : "Add Book"}
              </button>
            </form>
          </div>
        )}

        {message && (
          <p className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
            {message}
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>

              <p className="text-gray-600 mt-1">Author: {book.author}</p>

              <p className="text-gray-700 mt-4">{book.description}</p>

              {isAdmin && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => startEdit(book)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteBook(book.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}