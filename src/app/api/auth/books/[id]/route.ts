import { NextResponse } from "next/server";
import { books } from "@/data/fakeDb";
import { getCurrentUser } from "@/lib/currentUser";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "Only admin can edit books" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await request.json();
  const { title, author, description } = body;

  const book = books.find((item) => item.id === id);

  if (!book) {
    return NextResponse.json(
      { message: "Book not found" },
      { status: 404 }
    );
  }

  book.title = title || book.title;
  book.author = author || book.author;
  book.description = description || book.description;

  return NextResponse.json(
    { message: "Book updated successfully", book },
    { status: 200 }
  );
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "Only admin can delete books" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const bookIndex = books.findIndex((item) => item.id === id);

  if (bookIndex === -1) {
    return NextResponse.json(
      { message: "Book not found" },
      { status: 404 }
    );
  }

  books.splice(bookIndex, 1);

  return NextResponse.json(
    { message: "Book deleted successfully" },
    { status: 200 }
  );
}