import { Book } from "@/types/book";
import { PendingTwoFactorCode, User } from "@/types/user";

export const users: User[] = [];

export const pendingTwoFactorCodes: PendingTwoFactorCode[] = [];

export const books: Book[] = [
  {
    id: "1",
    title: "Introduction to Next.js",
    author: "Vercel Team",
    description: "A simple book about building web apps with Next.js.",
  },
  {
    id: "2",
    title: "Learning TypeScript",
    author: "Microsoft Team",
    description: "A beginner-friendly book about TypeScript basics.",
  },
  {
    id: "3",
    title: "Web Security Basics",
    author: "Security Academy",
    description: "A simple book about authentication, JWT, and secure login.",
  },
];