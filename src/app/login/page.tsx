"use client";

import Script from "next/script";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("yahya.yahya.1996y@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [turnstileToken, setTurnstileToken] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!turnstileToken) {
      setMessage("Please complete the human verification before login.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        window.turnstile?.reset();
        setTurnstileToken("");
        return;
      }

      localStorage.setItem("pendingEmail", email);

      setMessage("Password correct. Check your email or terminal for the 2FA code.");

      setTimeout(() => {
        router.push("/verify-2fa");
      }, 1000);
    } catch {
      setMessage("Something went wrong");
      window.turnstile?.reset();
      setTurnstileToken("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Login</h1>

        <p className="text-gray-600 mb-6">
          Complete the human check first, then login. After password is correct,
          a 2FA code will be generated.
        </p>

        <div className="mb-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
          For admin demo, use:
          <br />
          Email: yahya.yahya.1996y@gmail.com
          <br />
          Password: admin123
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="yahya.yahya.1996y@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div
            className="cf-turnstile"
            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            data-callback="onTurnstileSuccess"
            data-expired-callback="onTurnstileExpired"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onTurnstileSuccess = function(token) {
                window.dispatchEvent(new CustomEvent("turnstile-success", { detail: token }));
              };

              window.onTurnstileExpired = function() {
                window.dispatchEvent(new CustomEvent("turnstile-expired"));
              };
            `,
          }}
        />

        <TurnstileListener
          onSuccess={(token) => setTurnstileToken(token)}
          onExpired={() => setTurnstileToken("")}
        />

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Need student account?{" "}
          <Link href="/signup" className="text-blue-600 font-medium">
            Signup
          </Link>
        </p>
      </div>
    </main>
  );
}

function TurnstileListener({
  onSuccess,
  onExpired,
}: {
  onSuccess: (token: string) => void;
  onExpired: () => void;
}) {
  useState(() => {
    function handleSuccess(event: Event) {
      const customEvent = event as CustomEvent<string>;
      onSuccess(customEvent.detail);
    }

    function handleExpired() {
      onExpired();
    }

    window.addEventListener("turnstile-success", handleSuccess);
    window.addEventListener("turnstile-expired", handleExpired);

    return () => {
      window.removeEventListener("turnstile-success", handleSuccess);
      window.removeEventListener("turnstile-expired", handleExpired);
    };
  });

  return null;
}