import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  getAllPortfolios,
  deletePortfolio,
  getCustomPortfolios,
} from "#/lib/portfolioStore";
import { getIsAdmin } from "#/lib/auth";
import { MarkdownRenderer } from "#/components/MarkdownRenderer";
import { TechIcon } from "#/components/TechIcon";
import { TECH_CATALOG } from "#/data/techCatalog";
import type { Tech, Section } from "#/data/portfolios";

export const Route = createFileRoute("/portfolio/$id")({
  component: PortfolioDetailPage,
});

/* ── Tech tile (square) ──────────────────────────────────── */
function TechTile({ tech }: { tech: Tech }) {
  const cat = TECH_CATALOG.find((c) => c.name === tech.name);
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 text-center transition hover:border-[#d1ccff] hover:bg-[#f7f4ff] hover:shadow-sm w-[96px]">
      <TechIcon
        src={tech.icon}
        name={tech.name}
        color={cat?.color ?? "5b5bd6"}
        className="h-8 w-8"
      />
      <div className="w-full">
        <p className="break-words text-[12px] font-semibold leading-tight text-gray-800">
          {tech.name}
        </p>
        {tech.version && (
          <p className="mt-0.5 text-[14px] leading-tight text-gray-400">
            {tech.version}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Section block ───────────────────────────────────────── */
function SectionBlock({ section }: { section: Section }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      {section.title && (
        <div className="border-gray-100 px-6 py-4 md:px-8">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-gray-900">
            {section.title}
          </h2>
        </div>
      )}
      {section.image && (
        <div className="border-b border-gray-100">
          <img
            src={section.image}
            alt={section.title || "이미지"}
            className="max-h-[480px] w-full object-cover"
          />
        </div>
      )}
      {section.body && (
        <div className="px-6 py-5 md:px-8">
          <MarkdownRenderer content={section.body} />
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
function PortfolioDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const portfolios = getAllPortfolios();
  const portfolio = portfolios.find((p) => p.id === id);
  const isAdmin = getIsAdmin();
  const isCustom = getCustomPortfolios().some((p) => p.id === id);
  const isEditable = isAdmin && isCustom;

  function handleDelete() {
    if (!confirm("정말 이 포트폴리오를 삭제하시겠습니까?")) return;
    deletePortfolio(id);
    navigate({ to: "/" });
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-4">
          <Link
            to="/"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gray-100 px-4 text-[13px] font-medium text-gray-600 transition hover:bg-gray-200 hover:text-gray-800"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M10 12L6 8l4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            목록으로
          </Link>
          <p className="text-[14px] text-gray-400">
            포트폴리오를 찾을 수 없습니다.
          </p>
        </div>
      </div>
    );
  }

  const hasSections = portfolio.sections && portfolio.sections.length > 0;

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-4 py-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-5">
        {/* 헤더 */}
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gray-100 px-4 text-[13px] font-medium text-gray-600 transition hover:bg-gray-200 hover:text-gray-800"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path
                  d="M10 12L6 8l4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              목록으로
            </Link>
            {portfolio.url && (
              <a
                href={portfolio.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#f0eeff] px-4 text-[13px] font-medium text-[#5b5bd6] transition hover:bg-[#e6e2ff]"
              >
                사이트 방문
                <svg
                  viewBox="0 0 12 12"
                  className="h-2.5 w-2.5"
                  aria-hidden="true"
                >
                  <path
                    d="M7 1.5H10.5V5M5 7l5.5-5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 2H2a.5.5 0 0 0-.5.5v7A.5.5 0 0 0 2 10h7a.5.5 0 0 0 .5-.5V6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            )}
            {isEditable && (
              <div className="ml-auto flex items-center gap-2">
                <Link
                  to="/portfolio/add"
                  search={{ edit: id }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#f0eeff] px-4 text-[13px] font-medium text-[#5b5bd6] transition hover:bg-[#e6e2ff]"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M11 2.5l2.5 2.5L5 13.5H2.5V11z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 4.5l2.5 2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  수정하기
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-red-50 px-4 text-[13px] font-medium text-red-500 transition hover:bg-red-100 hover:text-red-600"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M5.5 2h5M2 4h12M3.5 4l.7 9.5a1.5 1.5 0 001.5 1.5h4.6a1.5 1.5 0 001.5-1.5L12.5 4M6.5 7v4M9.5 7v4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  삭제하기
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] leading-tight font-bold tracking-[-0.04em] text-gray-900 md:text-[34px]">
              {portfolio.title}
            </h1>
            {portfolio.github && (
              <a
                href={portfolio.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub 저장소 이동"
                title="GitHub 저장소 이동"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-black"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            )}
          </div>
          {portfolio.description && (
            <p className="text-[14px] text-gray-500 max-w-2xl leading-relaxed">
              {portfolio.description}
            </p>
          )}
          {portfolio.detail && (
            <p className="mt-1 text-[12px] text-gray-400 max-w-2xl leading-relaxed">
              {portfolio.detail}
            </p>
          )}
        </header>

        {/* 기술 스택 — 정사각형 타일 */}
        {portfolio.techs.length > 0 && (
          <section className="rounded-2xl bg-white border border-gray-100 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:p-7">
            <h2 className="mb-4 text-[20px] font-semibold uppercase tracking-widest">
              기술 스택
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {portfolio.techs.map((tech) => (
                <TechTile key={tech.name} tech={tech} />
              ))}
            </div>
          </section>
        )}

        {/* 섹션 콘텐츠 */}
        {hasSections ? (
          portfolio.sections!.map((section) => (
            <SectionBlock key={section.id} section={section} />
          ))
        ) : (
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:p-8">
            <MarkdownRenderer content={portfolio.body || portfolio.detail} />
          </div>
        )}
      </div>
    </div>
  );
}
