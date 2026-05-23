import { User } from "@/types/user";
import { users } from "@/data/fakeDb";
import { hashPassword } from "@/lib/password";

export async function getAdminUser(): Promise<User> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = users.find((user) => user.role === "admin");

  if (existingAdmin) {
    return existingAdmin;
  }

  const adminUser: User = {
    id: "admin-1",
    email: adminEmail,
    passwordHash: await hashPassword(adminPassword),
    role: "admin",
  };

  users.push(adminUser);

  return adminUser;
}

export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email);
}

export function studentAlreadyExists() {
  return users.some((user) => user.role === "student");
}