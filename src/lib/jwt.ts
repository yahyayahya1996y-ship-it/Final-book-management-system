import jwt from "jsonwebtoken";
import { UserRole } from "@/types/user";

export type JwtPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

const JWT_SECRET = process.env.JWT_SECRET || "temporary_exam_secret_key";

export function createToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}