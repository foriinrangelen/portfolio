import { createFileRoute, Link } from "@tanstack/react-router";
import { getIsAdmin } from "#/lib/auth";
import { getAllPortfolios } from "#/lib/portfolioStore";

export const Route = createFileRoute("/")({ component: PortfolioListPage });

function PortfolioListPage() {
  const isAdmin = getIsAdmin();
  const portfolios = getAllPortfolios();

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.04em] text-gray-900">
              포트폴리오
            </h1>
            <p className="mt-1 text-[13px] text-gray-400">
              {portfolios.length}개의 프로젝트
            </p>
          </div>
          {isAdmin && (
            <Link
              to="/portfolio/add"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#5b5bd6] px-4 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#4a49c4]"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path
                  d="M8 3v10M3 8h10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              추가하기
            </Link>
          )}
        </header>

        {portfolios.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-20 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <p className="text-[14px] text-gray-400">
              등록된 포트폴리오가 없습니다.
            </p>
          </div>
        ) : (
          <main className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {portfolios.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                to="/portfolio/$id"
                params={{ id: item.id }}
                className="group relative flex h-[260px] flex-col justify-between rounded-3xl bg-gradient-to-b from-[#f7f4ff] via-white to-[#f4f8ff] border border-[#ebe7ff] px-5 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.16)]"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-gray-900">
                    {item.title}
                  </h2>
                  <p className="text-[12px] text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-[11px] text-gray-400">{item.detail}</p>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="ml-auto text-[11px] text-[#7a7af0] group-hover:text-[#4646da]">
                    자세히 보기 →
                  </span>
                </div>

                <span className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition group-hover:border-[#b8b6ff]" />
              </Link>
            ))}
          </main>
        )}
      </div>
    </div>
  );
}
