import { NextResponse } from "next/server";
import { pendingTwoFactorCodes } from "@/data/fakeDb";
import { comparePassword } from "@/lib/password";
import { findUserByEmail, getAdminUser } from "@/lib/auth";

function generateTwoFactorCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    await getAdminUser();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordIsCorrect = await comparePassword(password, user.passwordHash);

    if (!passwordIsCorrect) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const code = generateTwoFactorCode();

    const existingCodeIndex = pendingTwoFactorCodes.findIndex(
      (item) => item.email === email
    );

    if (existingCodeIndex !== -1) {
      pendingTwoFactorCodes.splice(existingCodeIndex, 1);
    }

    pendingTwoFactorCodes.push({
      email,
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log(`2FA code for ${email}: ${code}`);

    return NextResponse.json(
      {
        message: "Password correct. 2FA code generated.",
        email,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong during login" },
      { status: 500 }
    );
  }
}