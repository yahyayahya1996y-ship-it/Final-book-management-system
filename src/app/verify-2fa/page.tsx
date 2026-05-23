"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyTwoFactorPage() {
  const router = useRouter();

  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return localStorage.getItem("pendingEmail") || "";
  });

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid code");
        return;
      }

      localStorage.removeItem("pendingEmail");

      setMessage("2FA success. Redirecting to dashboard...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verify 2FA Code
        </h1>

        <p className="text-gray-600 mb-6">
          Enter the 6-digit code generated after login. For now, check the code
          in the VS Code terminal.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              2FA Code
            </label>

            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter 6-digit code"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-green-300"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}
      </div>
    </main>
  );
}