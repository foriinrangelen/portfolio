import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

type LoginFormValues = {
  email: string;
  password: string;
};

function fakeLoginApi(values: LoginFormValues) {
  // 실제 API 연동 시 이 부분을 교체하세요.
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log("login", values);
      resolve();
    }, 900);
  });
}

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: fakeLoginApi,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || loginMutation.isPending) return;
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-4 flex items-center justify-center">
      {/* 로그인 카드만 중앙 정렬 */}
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-gray-100 px-6 py-7 md:px-7 md:py-8">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-[-0.02em] text-center">
            로그인
          </h2>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-gray-700"
              >
                아이디
              </label>
              <input
                id="email"
                // type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              disabled={!email || !password || loginMutation.isPending}
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#5b5bd6] text-sm font-medium text-white shadow-sm transition hover:bg-[#4646da] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* <p className="mt-4 text-[11px] text-gray-400">
            아직 계정이 없다면{" "}
            <button
              type="button"
              className="font-medium text-gray-700 underline-offset-2 hover:underline"
            >
              회원가입
            </button>
            을 진행해 주세요.
          </p> */}

          {loginMutation.isError && (
            <p className="mt-3 text-[11px] text-red-500">
              로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          )}
          {loginMutation.isSuccess && (
            <p className="mt-3 text-[11px] text-emerald-600">
              로그인 요청이 완료되었습니다. 실제 서비스 로직을 연결해 주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
