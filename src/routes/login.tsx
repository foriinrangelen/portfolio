import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { login, getIsLoggedIn, type Role } from "#/lib/auth";
import { login as apiLogin, isApiEnabled } from "#/lib/api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (getIsLoggedIn()) {
    navigate({ to: "/" });
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username || !password || loading) return;

    setLoading(true);
    setError("");

    try {
      if (isApiEnabled()) {
        const res = await apiLogin({ username, password });
        login(res.role as Role, res.accessToken);
      } else {
        throw new Error("API not configured");
      }
      navigate({ to: "/" });
    } catch {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-4 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-gray-100 px-6 py-7 md:px-7 md:py-8">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-[-0.02em] text-center">
            로그인
          </h2>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="text-xs font-medium text-gray-700"
              >
                아이디
              </label>
              <input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/80 px-3 text-sm text-gray-900 outline-none transition focus:border-[#5b5bd6] focus:bg-white focus:ring-2 focus:ring-[#5b5bd6]/15"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/80 px-3 text-sm text-gray-900 outline-none transition focus:border-[#5b5bd6] focus:bg-white focus:ring-2 focus:ring-[#5b5bd6]/15"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!username || !password || loading}
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#5b5bd6] text-sm font-medium text-white shadow-sm transition hover:bg-[#4646da] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-[11px] text-red-500 text-center">{error}</p>
          )}

        </div>
      </div>
    </div>
  );
}
