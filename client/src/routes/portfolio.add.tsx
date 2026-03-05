import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORIES, TECH_CATALOG, techIconUrl } from "#/data/techCatalog";
import type { CatalogTech } from "#/data/techCatalog";
import { getIsAdmin } from "#/lib/auth";
import {
  generateId,
  fetchPortfolioById,
  savePortfolio,
  updatePortfolio,
  portfolioKeys,
} from "#/lib/portfolioStore";
import { MarkdownRenderer } from "#/components/MarkdownRenderer";
import { TechIcon } from "#/components/TechIcon";

export const Route = createFileRoute("/portfolio/add")({
  component: AddPortfolioPage,
  validateSearch: (search: Record<string, unknown>) => ({
    edit: (search.edit as string) || undefined,
  }),
});

/* ── Types ───────────────────────────────────────────────── */
type SelectedTech = { name: string; version: string; icon: string };

type SectionDraft = {
  id: string;
  title: string;
  body: string;
  image: string | null;
  tab: "write" | "preview";
};

/* ── Helpers ─────────────────────────────────────────────── */
function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function makeSection(): SectionDraft {
  return { id: uid(), title: "", body: "", image: null, tab: "write" };
}

/* ── Section Editor ──────────────────────────────────────── */
function SectionEditor({
  section,
  index,
  total,
  onChange,
  onRemove,
  isSectionDragging,
  onDragStart,
  onDragEnd,
}: {
  section: SectionDraft;
  index: number;
  total: number;
  onChange: (u: Partial<SectionDraft>) => void;
  onRemove: () => void;
  isSectionDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange({ image: e.target?.result as string });
    reader.readAsDataURL(file);
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      className={`rounded-2xl bg-white border overflow-hidden transition-all duration-200 ${isSectionDragging ? "opacity-40 border-dashed border-[#5b5bd6] shadow-none scale-[0.98]" : "border-gray-100 shadow-[0_4px_20px_rgba(15,23,42,0.06)]"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/60 px-4 py-3">
        <div
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="flex h-7 w-5 shrink-0 cursor-grab items-center justify-center rounded text-gray-300 transition hover:bg-gray-200/60 hover:text-gray-500 active:cursor-grabbing"
          title="드래그하여 순서 변경"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
            <circle cx="5.5" cy="3" r="1.2" fill="currentColor" />
            <circle cx="10.5" cy="3" r="1.2" fill="currentColor" />
            <circle cx="5.5" cy="8" r="1.2" fill="currentColor" />
            <circle cx="10.5" cy="8" r="1.2" fill="currentColor" />
            <circle cx="5.5" cy="13" r="1.2" fill="currentColor" />
            <circle cx="10.5" cy="13" r="1.2" fill="currentColor" />
          </svg>
        </div>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5b5bd6]/10 text-[11px] font-bold text-[#5b5bd6]">
          {index + 1}
        </span>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="섹션 제목 (예: 트러블슈팅, 아키텍처, 성과)"
          className="flex-1 bg-transparent text-[14px] font-semibold text-gray-800 outline-none placeholder:font-normal placeholder:text-gray-300"
        />
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 rounded-lg bg-gray-200/60 p-0.5">
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange({ tab: t })}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                  section.tab === t
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "write" ? "작성" : "미리보기"}
              </button>
            ))}
          </div>
          {total > 1 && (
            <button
              type="button"
              onClick={onRemove}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-400"
              aria-label="섹션 삭제"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path
                  d="M2 4h12M6 4V2h4v2M5 4l1 10h4l1-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            handleFile(file);
            e.target.value = "";
          }}
        />

        {section.image ? (
          <div
            className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50/60"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <img
              src={section.image}
              alt={section.title || "섹션 이미지"}
              className="w-full object-contain bg-white"
            />
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#5b5bd6]/20 backdrop-blur-sm">
                <div className="rounded-xl bg-white/90 px-6 py-3 shadow-lg">
                  <p className="text-[14px] font-semibold text-[#5b5bd6]">
                    이미지를 놓아주세요
                  </p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white px-4 text-[13px] font-medium text-gray-700 shadow-lg transition hover:bg-gray-50"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M2.5 4.5h11v9h-11z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.2 9.6l2-2 2.2 2.2 1.3-1.3 2.1 2.1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                변경
              </button>
              <button
                type="button"
                onClick={() => onChange({ image: null })}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-red-500 px-4 text-[13px] font-medium text-white shadow-lg transition hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
            }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition ${
              isDragging
                ? "border-[#5b5bd6] bg-[#f0eeff] scale-[1.01]"
                : "border-gray-200 bg-gray-50/50 hover:border-[#b8b6ff] hover:bg-[#faf9ff]"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                isDragging ? "bg-[#5b5bd6]/10" : "bg-gray-100"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-6 w-6 transition ${isDragging ? "text-[#5b5bd6]" : "text-gray-400"}`}
                aria-hidden="true"
              >
                <path
                  d="M12 16V8m0 0l-3 3m3-3l3 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 16.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className={`text-[14px] font-semibold transition ${isDragging ? "text-[#5b5bd6]" : "text-gray-500"}`}
              >
                {isDragging
                  ? "여기에 놓아주세요"
                  : "이미지를 드래그하거나 클릭하여 업로드"}
              </p>
              <p className="mt-1 text-[12px] text-gray-400">
                PNG, JPG, GIF, WebP
              </p>
            </div>
          </div>
        )}

        {section.tab === "write" ? (
          <textarea
            value={section.body}
            onChange={(e) => onChange({ body: e.target.value })}
            placeholder="마크다운으로 내용을 작성하세요..."
            rows={10}
            className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 font-mono text-[13px] leading-relaxed text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-[#5b5bd6] focus:bg-white focus:ring-2 focus:ring-[#5b5bd6]/15"
          />
        ) : (
          <div className="min-h-[160px] rounded-xl border border-gray-100 bg-gray-50/50 px-5 py-4">
            {section.body.trim() ? (
              <MarkdownRenderer content={section.body} />
            ) : (
              <p className="text-[13px] text-gray-300">
                미리보기가 여기에 표시됩니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Section Minimap ──────────────────────────────────────── */
function SectionMinimap({
  sections,
  activeIdx,
  onReorder,
  onScrollTo,
}: {
  sections: SectionDraft[];
  activeIdx: number;
  onReorder: (from: number, to: number) => void;
  onScrollTo: (idx: number) => void;
}) {
  const [mDrag, setMDrag] = useState<number | null>(null);
  const [mOver, setMOver] = useState<number | null>(null);

  if (sections.length < 2) return null;

  function onTileDragOver(e: React.DragEvent, idx: number) {
    if (!e.dataTransfer.types.includes("application/minimap-drag")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const target = e.clientY < mid ? idx : idx + 1;
    if (target !== mOver) setMOver(target);
  }

  function onTileDrop(e: React.DragEvent) {
    e.preventDefault();
    if (mDrag != null && mOver != null) {
      const to = mOver > mDrag ? mOver - 1 : mOver;
      if (to !== mDrag) onReorder(mDrag, to);
    }
    setMDrag(null);
    setMOver(null);
  }

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl">
      {/* <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
        섹션
      </p> */}
      <div className="flex flex-col gap-2">
        {sections.map((s, i) => {
          const active = activeIdx === i;
          const dragging = mDrag === i;
          const showLine =
            mDrag != null &&
            mOver === i &&
            mOver !== mDrag &&
            mOver !== mDrag + 1;
          return (
            <div key={s.id}>
              <div
                className={`rounded-full transition-all duration-150 ${showLine ? "mb-2 h-[3px] bg-[#5b5bd6] shadow-[0_0_6px_rgba(91,91,214,0.4)]" : "h-0"}`}
              />
              <button
                type="button"
                draggable
                onClick={() => onScrollTo(i)}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("application/minimap-drag", String(i));
                  requestAnimationFrame(() => setMDrag(i));
                }}
                onDragOver={(e) => onTileDragOver(e, i)}
                onDrop={onTileDrop}
                onDragEnd={() => {
                  setMDrag(null);
                  setMOver(null);
                }}
                className={`flex h-16 w-16 cursor-grab flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-150 active:cursor-grabbing ${
                  dragging
                    ? "scale-90 border-2 border-dashed border-[#5b5bd6] opacity-40"
                    : active
                      ? "bg-[#5b5bd6] text-white shadow-lg shadow-[#5b5bd6]/25"
                      : "border border-gray-200/80 bg-gray-50 text-gray-500 hover:border-[#c5c0ff] hover:bg-[#f0eeff] hover:text-[#5b5bd6]"
                }`}
                title={s.title || `섹션 ${i + 1}`}
              >
                {/* 미니맵 숫자 */}
                <span className="text-ml font-bold leading-none">{i + 1}</span>
                {s.title && !dragging && (
                  // 미니맵 타이틀
                  <span
                    className={`w-full truncate px-1.5 text-center text-[10px] font-medium leading-tight ${active ? "text-white/70" : "text-gray-400"}`}
                  >
                    {s.title}
                  </span>
                )}
              </button>
            </div>
          );
        })}
        {mDrag != null && (
          <div
            onDragOver={(e) => {
              if (!e.dataTransfer.types.includes("application/minimap-drag"))
                return;
              e.preventDefault();
              if (mOver !== sections.length) setMOver(sections.length);
            }}
            onDrop={onTileDrop}
            className="min-h-[10px]"
          >
            <div
              className={`rounded-full transition-all duration-150 ${mOver === sections.length && mOver !== (mDrag ?? -1) + 1 ? "h-[3px] bg-[#5b5bd6] shadow-[0_0_6px_rgba(91,91,214,0.4)]" : "h-0"}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
function AddPortfolioPage() {
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const { edit: editId } = Route.useSearch();
  const isEditMode = !!editId;

  const { data: editTarget, isLoading: loadingEdit } = useQuery({
    queryKey: portfolioKeys.detail(editId ?? ""),
    queryFn: () => fetchPortfolioById(editId!),
    enabled: !!editId,
    staleTime: 1000 * 60 * 5,
  });

  // Basic info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [github, setGithub] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<SelectedTech[]>([]);
  const [techSearch, setTechSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [sections, setSections] = useState<SectionDraft[]>([makeSection()]);
  const [formReady, setFormReady] = useState(!isEditMode);
  const sectionElRefs = useRef(new Map<string, HTMLDivElement>());
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (!getIsAdmin()) {
      navigate({ to: "/" });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!editTarget || formReady) return;
    setTitle(editTarget.title);
    setDescription(editTarget.description ?? "");
    setUrl(editTarget.url ?? "");
    setGithub(editTarget.github ?? "");
    setSelectedTechs(editTarget.techs ?? []);
    if (editTarget.sections && editTarget.sections.length > 0) {
      setSections(
        editTarget.sections.map((s) => ({
          id: s.id,
          title: s.title,
          body: s.body,
          image: s.image ?? null,
          tab: "write" as const,
        })),
      );
    } else if (editTarget.body) {
      setSections([
        {
          id: uid(),
          title: "",
          body: editTarget.body,
          image: null,
          tab: "write" as const,
        },
      ]);
    }
    setFormReady(true);
  }, [editTarget, formReady]);

  const sectionIdsKey = sections.map((s) => s.id).join(",");
  useEffect(() => {
    const ids = sectionIdsKey.split(",");
    const refs = sectionElRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) {
              const idx = ids.indexOf(id);
              if (idx !== -1) setActiveSection(idx);
            }
          }
        }
      },
      { threshold: 0.15, rootMargin: "-15% 0px -55% 0px" },
    );
    refs.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIdsKey]);

  const filteredTechs = useMemo(
    () =>
      TECH_CATALOG.filter((t) => {
        const matchCat =
          activeCategory === "전체" || t.category === activeCategory;
        const matchQ =
          !techSearch ||
          t.name.toLowerCase().includes(techSearch.toLowerCase()) ||
          t.category.includes(techSearch);
        return matchCat && matchQ;
      }),
    [techSearch, activeCategory],
  );

  function isSelected(t: CatalogTech) {
    return selectedTechs.some((s) => s.name === t.name);
  }
  function toggleTech(t: CatalogTech) {
    if (isSelected(t)) {
      setSelectedTechs((p) => p.filter((s) => s.name !== t.name));
    } else {
      setSelectedTechs((p) => [
        ...p,
        { name: t.name, version: t.version, icon: techIconUrl(t) },
      ]);
    }
  }
  function updateVersion(name: string, v: string) {
    setSelectedTechs((p) =>
      p.map((s) => (s.name === name ? { ...s, version: v } : s)),
    );
  }
  function removeTech(name: string) {
    setSelectedTechs((p) => p.filter((s) => s.name !== name));
  }

  function updateSection(id: string, updates: Partial<SectionDraft>) {
    setSections((p) => p.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }
  function removeSection(id: string) {
    setSections((p) => p.filter((s) => s.id !== id));
  }
  function addSection() {
    setSections((p) => [...p, makeSection()]);
  }

  function moveSection(from: number, to: number) {
    setSections((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function scrollToSection(idx: number) {
    const id = sections[idx]?.id;
    if (!id) return;
    const el = sectionElRefs.current.get(id);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  function handleSectionDragStart(e: React.DragEvent, idx: number) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/section-drag", String(idx));
    requestAnimationFrame(() => setDragIdx(idx));
  }

  function handleSectionDragOver(e: React.DragEvent, idx: number) {
    if (!e.dataTransfer.types.includes("application/section-drag")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const target = e.clientY < midY ? idx : idx + 1;
    if (target !== overIdx) setOverIdx(target);
    const edge = 80;
    const speed = 14;
    if (e.clientY < edge) window.scrollBy(0, -speed);
    else if (e.clientY > window.innerHeight - edge) window.scrollBy(0, speed);
  }

  function handleSectionDrop(e: React.DragEvent) {
    e.preventDefault();
    if (dragIdx != null && overIdx != null) {
      const to = overIdx > dragIdx ? overIdx - 1 : overIdx;
      if (to !== dragIdx) moveSection(dragIdx, to);
    }
    setDragIdx(null);
    setOverIdx(null);
  }

  function handleSectionDragEnd() {
    setDragIdx(null);
    setOverIdx(null);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const cleanSections = sections
        .filter((s) => s.title || s.body)
        .map(({ id: sid, title: stitle, body, image }) => ({
          id: sid,
          title: stitle,
          body,
          image: image ?? undefined,
        }));
      const combinedBody = sections.map((s) => s.body).join("\n\n");
      const portfolio = {
        title: title.trim(),
        description: description.trim(),
        detail: description.trim(),
        body: combinedBody,
        sections: cleanSections.length ? cleanSections : undefined,
        techs: selectedTechs,
        url: url.trim(),
        github: github.trim() || undefined,
      };
      if (isEditMode && editTarget) {
        await updatePortfolio({ ...portfolio, id: editTarget.id });
        return editTarget.id;
      } else {
        const newId = generateId(title);
        await savePortfolio({ ...portfolio, id: newId });
        return newId;
      }
    },
    onSuccess: (savedId) => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.detail(savedId),
      });
      navigate({ to: "/portfolio/$id", params: { id: savedId } });
    },
  });

  function handleSave() {
    if (!title.trim()) return;
    saveMutation.mutate();
  }

  if (isEditMode && loadingEdit) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        <p className="text-[14px] text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
            <span className="text-[14px] font-semibold text-gray-800">
              {isEditMode ? "포트폴리오 수정" : "포트폴리오 추가"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim() || saveMutation.isPending}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#5b5bd6] px-5 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#4646da] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saveMutation.isPending
              ? "저장 중..."
              : isEditMode
                ? "수정 완료"
                : "저장하기"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-8">
        {/* ── 기본 정보 ── */}
        <section className="rounded-2xl bg-white border border-gray-100 p-6 shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
          <h2 className="text-[15px] font-semibold uppercase tracking-widest text-gray-900">
            기본 정보
          </h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="프로젝트 제목 *"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-[16px] font-semibold text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-300 focus:border-[#5b5bd6] focus:bg-white focus:ring-2 focus:ring-[#5b5bd6]/15"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="한 줄 소개 (카드에 표시됩니다)"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-[#5b5bd6] focus:bg-white focus:ring-2 focus:ring-[#5b5bd6]/15"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="사이트 URL (https://...)"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-[#5b5bd6] focus:bg-white focus:ring-2 focus:ring-[#5b5bd6]/15"
          />
          <div className="relative">
            <svg
              viewBox="0 0 16 16"
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
                fill="currentColor"
              />
            </svg>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="GitHub 저장소 URL (https://github.com/...)"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-4 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-[#5b5bd6] focus:bg-white focus:ring-2 focus:ring-[#5b5bd6]/15"
            />
          </div>
        </section>

        {/* ── 기술 스택 ── */}
        <section className="rounded-2xl bg-white border border-gray-100 p-6 shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
          <h2 className="text-[15px] font-semibold uppercase tracking-widest text-gray-900">
            기술 스택
          </h2>

          {/* 선택된 기술 */}
          {selectedTechs.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500">
                선택된 기술{" "}
                <span className="text-[#5b5bd6]">{selectedTechs.length}</span>개
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {selectedTechs.map((tech) => {
                  const cat = TECH_CATALOG.find((c) => c.name === tech.name);
                  return (
                    <div
                      key={tech.name}
                      className="group flex items-center gap-3 rounded-xl border border-[#e0ddff] bg-[#faf9ff] px-4 py-3 transition-all hover:border-[#c5c0ff] hover:shadow-sm"
                    >
                      <TechIcon
                        src={tech.icon}
                        name={tech.name}
                        color={cat?.color ?? "5b5bd6"}
                        className="h-7 w-7"
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800">
                        {tech.name}
                      </span>
                      <div className="flex items-center gap-1 rounded-lg border border-[#d1ccff] bg-white px-2.5 py-1.5 transition-all focus-within:border-[#5b5bd6] focus-within:ring-2 focus-within:ring-[#5b5bd6]/20 hover:border-[#b8b6ff]">
                        <span className="text-xs font-semibold text-[#8b8bc7]">
                          v
                        </span>
                        <input
                          type="text"
                          value={tech.version.replace(/^v/, "")}
                          onChange={(e) =>
                            updateVersion(
                              tech.name,
                              e.target.value ? `v${e.target.value}` : "",
                            )
                          }
                          placeholder="1.0"
                          className="w-14 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTech(tech.name)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-base text-[#b0b0e0] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#ebe8ff] hover:text-[#5b5bd6]"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 검색 */}
          <div className="relative">
            <svg
              viewBox="0 0 20 20"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300"
              aria-hidden="true"
            >
              <circle
                cx="8.5"
                cy="8.5"
                r="5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M13 13l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              value={techSearch}
              onChange={(e) => {
                setTechSearch(e.target.value);
                setActiveCategory("전체");
              }}
              placeholder="기술 검색..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-9 pr-4 text-[13px] text-gray-900 outline-none transition focus:border-[#5b5bd6] focus:bg-white focus:ring-2 focus:ring-[#5b5bd6]/15"
            />
          </div>

          {/* 카테고리 */}
          {!techSearch && (
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                    activeCategory === cat
                      ? "bg-[#5b5bd6] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* 기술 그리드 — 정사각형 타일 */}
          <div className="max-h-96 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/40 p-3">
            {filteredTechs.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-gray-300">
                검색 결과 없음
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
                {filteredTechs.map((tech) => {
                  const sel = isSelected(tech);
                  return (
                    <button
                      key={`${tech.name}-${tech.category}`}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={`relative flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition ${
                        sel
                          ? "border-[#b8b6ff] bg-[#f0eeff] shadow-sm"
                          : "border-gray-100 bg-white hover:border-[#d1ccff] hover:bg-[#faf9ff]"
                      }`}
                    >
                      {sel && (
                        <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#5b5bd6]">
                          <svg
                            viewBox="0 0 12 12"
                            className="h-3 w-3 text-white"
                            aria-hidden="true"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                      <TechIcon
                        src={techIconUrl(tech)}
                        name={tech.name}
                        color={tech.color}
                      />
                      <p
                        className={`w-full truncate text-[12px] font-semibold leading-tight ${sel ? "text-[#4646da]" : "text-gray-700"}`}
                      >
                        {tech.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── 섹션 목록 ── */}
        <div className="flex gap-4">
          {sections.length >= 2 && (
            <div className="sticky top-20 hidden self-start md:block">
              <SectionMinimap
                sections={sections}
                activeIdx={activeSection}
                onReorder={moveSection}
                onScrollTo={scrollToSection}
              />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold uppercase tracking-widest text-gray-900">
                내용 섹션
              </h2>
              <span className="text-[11px] text-gray-400">
                {sections.length}개
              </span>
            </div>

            {sections.map((section, i) => {
              const showBefore =
                dragIdx != null &&
                overIdx === i &&
                overIdx !== dragIdx &&
                overIdx !== dragIdx + 1;
              return (
                <div
                  key={section.id}
                  ref={(el) => {
                    if (el) sectionElRefs.current.set(section.id, el);
                    else sectionElRefs.current.delete(section.id);
                  }}
                  data-section-id={section.id}
                  onDragOver={(e) => handleSectionDragOver(e, i)}
                  onDrop={handleSectionDrop}
                >
                  <div
                    className={`mx-6 rounded-full transition-all duration-200 ease-out ${showBefore ? "mb-3 h-[3px] bg-[#5b5bd6] shadow-[0_0_8px_rgba(91,91,214,0.35)]" : "h-0"}`}
                  />
                  <SectionEditor
                    section={section}
                    index={i}
                    total={sections.length}
                    onChange={(u) => updateSection(section.id, u)}
                    onRemove={() => removeSection(section.id)}
                    isSectionDragging={dragIdx === i}
                    onDragStart={(e) => handleSectionDragStart(e, i)}
                    onDragEnd={handleSectionDragEnd}
                  />
                </div>
              );
            })}
            {dragIdx != null && (
              <div
                onDragOver={(e) => {
                  if (
                    !e.dataTransfer.types.includes("application/section-drag")
                  )
                    return;
                  e.preventDefault();
                  if (overIdx !== sections.length) setOverIdx(sections.length);
                  const edge = 80;
                  const speed = 14;
                  if (e.clientY > window.innerHeight - edge)
                    window.scrollBy(0, speed);
                }}
                onDrop={handleSectionDrop}
                className="min-h-[20px]"
              >
                <div
                  className={`mx-6 rounded-full transition-all duration-200 ease-out ${overIdx === sections.length && overIdx !== dragIdx + 1 ? "h-[3px] bg-[#5b5bd6] shadow-[0_0_8px_rgba(91,91,214,0.35)]" : "h-0"}`}
                />
              </div>
            )}

            <button
              type="button"
              onClick={addSection}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#d1ccff] py-4 text-[13px] font-medium text-[#7a7af0] transition hover:border-[#5b5bd6] hover:bg-[#faf9ff] hover:text-[#5b5bd6]"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              섹션 추가하기
            </button>
          </div>
        </div>

        {/* 하단 저장 */}
        <div className="flex items-center justify-between pb-6">
          <Link
            to="/"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gray-100 px-5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-200 hover:text-gray-800"
          >
            취소
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim() || saveMutation.isPending}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5b5bd6] px-7 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#4646da] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saveMutation.isPending ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
