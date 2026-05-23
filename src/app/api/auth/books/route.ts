import { NextResponse } from "next/server";
import { books } from "@/data/fakeDb";
import { getCurrentUser } from "@/lib/currentUser";
import { Book } from "@/types/book";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { books },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "Only admin can add books" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { title, author, description } = body;

  if (!title || !author || !description) {
    return NextResponse.json(
      { message: "Title, author, and description are required" },
      { status: 400 }
    );
  }

  const newBook: Book = {
    id: Date.now().toString(),
    title,
    author,
    description,
  };

  books.push(newBook);

  return NextResponse.json(
    { message: "Book added successfully", book: newBook },
    { status: 201 }
  );
}