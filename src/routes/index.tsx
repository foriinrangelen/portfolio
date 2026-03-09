import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getIsAdmin, logout } from "#/lib/auth";
import { logoutApi } from "#/lib/api";
import { fetchAllPortfolios, portfolioKeys } from "#/lib/portfolioStore";
import { TECH_CATALOG } from "#/data/techCatalog";
import type { Tech } from "#/data/portfolios";

const NAME_TO_CATEGORY = new Map(TECH_CATALOG.map((t) => [t.name, t.category]));
const INFRA_CATS = new Set(["클라우드"]);
const GROUP_ORDER = ["언어", "프론트엔드", "백엔드", "데이터베이스", "인프라"];

function getTechSummary(techs: Tech[]) {
  const seen = new Set<string>();
  const icons: { name: string; icon: string }[] = [];

  for (const tech of techs) {
    const cat = NAME_TO_CATEGORY.get(tech.name);
    if (!cat) continue;
    const group = INFRA_CATS.has(cat) ? "인프라" : cat;
    if (GROUP_ORDER.includes(group) && !seen.has(group)) {
      seen.add(group);
      icons.push({ name: tech.name, icon: tech.icon });
    }
  }

  const remaining = techs.length - icons.length;
  return { icons, remaining };
}

export const Route = createFileRoute("/")({ component: PortfolioListPage });

function PortfolioListPage() {
  const navigate = useNavigate();
  const isAdmin = getIsAdmin();
  const { data: portfolios = [], isLoading: loading } = useQuery({
    queryKey: portfolioKeys.all,
    queryFn: fetchAllPortfolios,
    staleTime: 1000 * 60 * 5,
  });

  function handleLogout() {
    logout();          // 메모리(Access Token) 초기화
    logoutApi();       // 서버에 Refresh Token 쿠키 만료 요청 (fire-and-forget)
    navigate({ to: "/login" });
  }

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
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/portfolio/add"
                search={{ edit: undefined }}
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
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gray-100 px-4 text-[13px] font-medium text-gray-600 transition hover:bg-gray-200 hover:text-gray-800"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                <path
                  d="M6 2H3.5A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14H6M10.5 11.5L14 8l-3.5-3.5M14 8H6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              로그아웃
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-20 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <p className="text-[14px] text-gray-400">불러오는 중...</p>
          </div>
        ) : portfolios.length === 0 ? (
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
                  <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-gray-900">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                    {(() => {
                      const { icons, remaining } = getTechSummary(item.techs ?? []);
                      return (
                        <>
                          {icons.map((t) => (
                            <img
                              key={t.name}
                              src={t.icon}
                              alt={t.name}
                              title={t.name}
                              className="h-6 w-6 shrink-0 object-contain sm:h-7 sm:w-7"
                            />
                          ))}
                          {remaining > 0 && (
                            <span className="shrink-0 text-[12px] font-semibold text-gray-400 sm:text-[13px]">
                              +{remaining}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <span className="shrink-0 text-[13px] text-[#7a7af0] group-hover:text-[#4646da]">
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
