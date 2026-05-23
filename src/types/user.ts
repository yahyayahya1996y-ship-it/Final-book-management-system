export type UserRole = "admin" | "student";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export type PendingTwoFactorCode = {
  email: string;
  code: string;
  expiresAt: number;
};