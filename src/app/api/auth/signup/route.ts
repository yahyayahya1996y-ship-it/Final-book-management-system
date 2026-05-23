import { NextResponse } from "next/server";
import { users } from "@/data/fakeDb";
import { hashPassword } from "@/lib/password";
import { studentAlreadyExists } from "@/lib/auth";
import { User } from "@/types/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (studentAlreadyExists()) {
      return NextResponse.json(
        { message: "Only one student account is allowed in this demo project" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newStudent: User = {
      id: Date.now().toString(),
      email,
      passwordHash,
      role: "student",
    };

    users.push(newStudent);

    return NextResponse.json(
      { message: "Student account created successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong during signup" },
      { status: 500 }
    );
  }
}