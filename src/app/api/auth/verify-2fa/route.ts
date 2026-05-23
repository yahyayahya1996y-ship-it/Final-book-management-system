import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pendingTwoFactorCodes } from "@/data/fakeDb";
import { findUserByEmail } from "@/lib/auth";
import { createToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and 2FA code are required" },
        { status: 400 }
      );
    }

    const savedCode = pendingTwoFactorCodes.find(
      (item) => item.email === email && item.code === code
    );

    if (!savedCode) {
      return NextResponse.json(
        { message: "Invalid 2FA code" },
        { status: 401 }
      );
    }

    if (savedCode.expiresAt < Date.now()) {
      return NextResponse.json(
        { message: "2FA code expired" },
        { status: 401 }
      );
    }

    const user = findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    const codeIndex = pendingTwoFactorCodes.findIndex(
      (item) => item.email === email
    );

    if (codeIndex !== -1) {
      pendingTwoFactorCodes.splice(codeIndex, 1);
    }

    return NextResponse.json(
      {
        message: "2FA verified successfully",
        role: user.role,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong during 2FA verification" },
      { status: 500 }
    );
  }
}