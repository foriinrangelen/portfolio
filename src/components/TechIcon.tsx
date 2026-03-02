import { useState } from "react";
import { TECH_CATALOG } from "#/data/techCatalog";

type Props = {
  src: string;
  name: string;
  color: string;
  className?: string;
};

/*
  Category-based background icon shown behind the abbreviation
  when a CDN image fails to load.
*/
const CATEGORY_ICONS: Record<string, JSX.Element> = {
  언어: (
    <path
      d="M7 6l-4 6h8l-4-6zM17 6l-4 6h8l-4-6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.2}
    />
  ),
  프론트엔드: (
    <rect
      x="4"
      y="5"
      width="16"
      height="12"
      rx="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      opacity={0.2}
    />
  ),
  백엔드: (
    <g opacity={0.2}>
      <rect x="6" y="4" width="12" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="6" y="10" width="12" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="6" y="16" width="12" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
    </g>
  ),
  데이터베이스: (
    <g opacity={0.2}>
      <ellipse cx="12" cy="7" rx="7" ry="3" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M5 7v10c0 1.66 3.13 3 7 3s7-1.34 7-3V7" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" fill="none" stroke="currentColor" strokeWidth="1" />
    </g>
  ),
  스타일: (
    <path
      d="M12 2l2.5 7H22l-6 4.5 2.5 7L12 16l-6.5 4.5 2.5-7L2 9h7.5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      opacity={0.15}
    />
  ),
  모바일: (
    <rect
      x="7"
      y="3"
      width="10"
      height="18"
      rx="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      opacity={0.2}
    />
  ),
  DevOps: (
    <g opacity={0.2}>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="currentColor" strokeWidth="1" />
    </g>
  ),
  클라우드: (
    <path
      d="M6 18h12a4 4 0 000-8 5 5 0 00-9.9-1A3.5 3.5 0 006 13v0a3 3 0 000 5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      opacity={0.2}
    />
  ),
  테스트: (
    <g opacity={0.2}>
      <path d="M9 3l-6 15h3l1.5-4h9L18 18h3L15 3z" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M8 14l4-8 4 8" fill="none" stroke="currentColor" strokeWidth="1" />
    </g>
  ),
  빌드: (
    <g opacity={0.2}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0z" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M3 21l8-8" stroke="currentColor" strokeWidth="1" />
    </g>
  ),
  API: (
    <g opacity={0.2}>
      <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
    </g>
  ),
  ORM: (
    <g opacity={0.2}>
      <path d="M4 8h16M4 16h16M8 4v16M16 4v16" stroke="currentColor" strokeWidth="1" />
    </g>
  ),
  디자인: (
    <g opacity={0.2}>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
    </g>
  ),
};

/*
  Recognisable SVG shapes for the most popular technologies.
  Each returns a <g> that fills a 24×24 viewBox.
*/
function getTechSvg(name: string, color: string): JSX.Element | null {
  const c = `#${color}`;
  switch (name) {
    case "React":
    case "React Native":
      return (
        <g>
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke={c} strokeWidth="1.2" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke={c} strokeWidth="1.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke={c} strokeWidth="1.2" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="2" fill={c} />
        </g>
      );
    case "Vue.js":
      return (
        <g>
          <polygon points="12,3 2,21 6,21 12,10.5 18,21 22,21" fill="none" stroke={c} strokeWidth="1.3" strokeLinejoin="round" />
          <polygon points="12,8 8,21 16,21" fill={`${c}33`} stroke={c} strokeWidth="0.8" strokeLinejoin="round" />
        </g>
      );
    case "Angular":
      return (
        <g>
          <polygon points="12,2 2,6 4,19 12,23 20,19 22,6" fill={`${c}22`} stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
          <text x="12" y="15" textAnchor="middle" fill={c} fontSize="10" fontWeight="700" fontFamily="system-ui">A</text>
        </g>
      );
    case "Svelte":
      return (
        <g>
          <path d="M19 4.5C16.5 1 11 1.5 8.5 4.5S7 11 10 13l4 2.5c3 2 3.5 5 1 7.5" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M5 19.5c2.5 3.5 8 3 10.5 0S17 13 14 11l-4-2.5c-3-2-3.5-5-1-7.5" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case "TypeScript":
      return (
        <g>
          <rect x="2" y="2" width="20" height="20" rx="3" fill={c} />
          <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="system-ui">TS</text>
        </g>
      );
    case "JavaScript":
      return (
        <g>
          <rect x="2" y="2" width="20" height="20" rx="3" fill={c} />
          <text x="12" y="16" textAnchor="middle" fill="#000" fontSize="12" fontWeight="700" fontFamily="system-ui">JS</text>
        </g>
      );
    case "Python":
      return (
        <g>
          <path d="M12 2C8 2 6 3 6 6v3h6v1H5c-2 0-3 2-3 5s1 5 3 5h2v-3c0-2 1-3 3-3h6c2 0 3-1 3-3V6c0-2-2-4-6-4z" fill={`${c}44`} stroke={c} strokeWidth="1" />
          <circle cx="9" cy="5.5" r="1" fill={c} />
          <path d="M12 22c4 0 6-1 6-4v-3h-6v-1h7c2 0 3-2 3-5s-1-5-3-5h-2v3c0 2-1 3-3 3h-6c-2 0-3 1-3 3v4c0 2 2 4 6 4z" fill={`${c}22`} stroke={c} strokeWidth="1" />
          <circle cx="15" cy="18.5" r="1" fill={c} />
        </g>
      );
    case "Node.js":
      return (
        <g>
          <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill={`${c}22`} stroke={c} strokeWidth="1.3" strokeLinejoin="round" />
          <text x="12" y="15" textAnchor="middle" fill={c} fontSize="9" fontWeight="700" fontFamily="system-ui">N</text>
        </g>
      );
    case "Next.js":
      return (
        <g>
          <circle cx="12" cy="12" r="10" fill="#000" stroke="#333" strokeWidth="0.8" />
          <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="system-ui">N</text>
        </g>
      );
    case "Docker":
      return (
        <g>
          <rect x="3" y="10" width="18" height="10" rx="2" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
          <rect x="5" y="6" width="3" height="3" rx="0.5" fill={`${c}44`} stroke={c} strokeWidth="0.8" />
          <rect x="9" y="6" width="3" height="3" rx="0.5" fill={`${c}44`} stroke={c} strokeWidth="0.8" />
          <rect x="13" y="6" width="3" height="3" rx="0.5" fill={`${c}44`} stroke={c} strokeWidth="0.8" />
          <rect x="9" y="2" width="3" height="3" rx="0.5" fill={`${c}44`} stroke={c} strokeWidth="0.8" />
        </g>
      );
    case "PostgreSQL":
    case "MySQL":
    case "SQLite":
      return (
        <g>
          <ellipse cx="12" cy="6" rx="8" ry="3.5" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
          <path d="M4 6v12c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5V6" fill="none" stroke={c} strokeWidth="1.2" />
          <path d="M4 12c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5" fill="none" stroke={c} strokeWidth="1" />
        </g>
      );
    case "MongoDB":
      return (
        <g>
          <path d="M12 2c-1 4-5 6-5 12 0 4 2 7 5 8 3-1 5-4 5-8 0-6-4-8-5-12z" fill={`${c}22`} stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
          <line x1="12" y1="6" x2="12" y2="20" stroke={c} strokeWidth="1" />
        </g>
      );
    case "Redis":
      return (
        <g>
          <polygon points="12,2 22,8 12,14 2,8" fill={`${c}22`} stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
          <polygon points="12,10 22,16 12,22 2,16" fill={`${c}11`} stroke={c} strokeWidth="1" strokeLinejoin="round" />
        </g>
      );
    case "GraphQL":
      return (
        <g>
          <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill={`${c}22`} stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="12" cy="2" r="1.5" fill={c} />
          <circle cx="21" cy="7" r="1.5" fill={c} />
          <circle cx="21" cy="17" r="1.5" fill={c} />
          <circle cx="12" cy="22" r="1.5" fill={c} />
          <circle cx="3" cy="17" r="1.5" fill={c} />
          <circle cx="3" cy="7" r="1.5" fill={c} />
        </g>
      );
    case "Tailwind CSS":
      return (
        <g>
          <path d="M6 10c1.5-4 4-5 6-5 3 0 4 2 6 2s3.5-1 4-3" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M4 17c1.5-4 4-5 6-5 3 0 4 2 6 2s3.5-1 4-3" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      );
    case "Git":
      return (
        <g>
          <circle cx="7" cy="7" r="2.5" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
          <circle cx="17" cy="7" r="2.5" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
          <circle cx="7" cy="18" r="2.5" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
          <path d="M7 9.5V15.5M9.5 7h5M17 9.5V12c0 1-1 2-2 2H9" fill="none" stroke={c} strokeWidth="1.2" />
        </g>
      );
    case "AWS":
      return (
        <g>
          <path d="M2 14c3 3 7 4 10 4s7-1 10-4" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <text x="12" y="12" textAnchor="middle" fill={c} fontSize="8" fontWeight="700" fontFamily="system-ui">AWS</text>
        </g>
      );
    case "Firebase":
    case "Supabase":
      return (
        <g>
          <path d="M5 20L10 3l4 8 3-4 3 13z" fill={`${c}22`} stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
        </g>
      );
    case "Spring Boot":
      return (
        <g>
          <circle cx="12" cy="12" r="9" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
          <path d="M8 8c4 0 5 2 5 4s-1 4-5 4" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="16.5" r="1" fill={c} />
        </g>
      );
    case "Kubernetes":
      return (
        <g>
          <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill={`${c}22`} stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="4" fill="none" stroke={c} strokeWidth="1" />
          <path d="M12 8v-3M12 16v3M8.5 10L6 7.5M15.5 14L18 16.5M8.5 14L6 16.5M15.5 10L18 7.5" stroke={c} strokeWidth="0.8" />
        </g>
      );
    case "Vite":
      return (
        <g>
          <path d="M21 3L12 22 7 12 1 14" fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M21 3L14 5" fill="none" stroke="#FFC107" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case "Go":
    case "Gin":
      return (
        <g>
          <text x="12" y="16" textAnchor="middle" fill={c} fontSize="14" fontWeight="700" fontFamily="system-ui">Go</text>
        </g>
      );
    case "Rust":
      return (
        <g>
          <circle cx="12" cy="12" r="9" fill="none" stroke={c || "#000"} strokeWidth="1.2" />
          <circle cx="12" cy="12" r="5" fill="none" stroke={c || "#000"} strokeWidth="1" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" stroke={c || "#000"} strokeWidth="1" />
        </g>
      );
    case "Figma":
      return (
        <g>
          <circle cx="15" cy="8" r="3" fill="none" stroke={c} strokeWidth="1.2" />
          <rect x="6" y="5" width="6" height="6" rx="3" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
          <rect x="6" y="11" width="6" height="6" rx="3" fill={`${c}33`} stroke={c} strokeWidth="1.2" />
          <circle cx="9" cy="20" r="3" fill={`${c}44`} stroke={c} strokeWidth="1.2" />
          <rect x="12" y="11" width="6" height="6" rx="3" fill={`${c}55`} stroke={c} strokeWidth="1.2" />
        </g>
      );
    case "Sass":
      return (
        <g>
          <circle cx="12" cy="12" r="10" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
          <text x="12" y="16" textAnchor="middle" fill={c} fontSize="11" fontWeight="700" fontFamily="system-ui">S</text>
        </g>
      );
    case "Jest":
      return (
        <g>
          <circle cx="12" cy="16" r="5" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
          <path d="M8 3h8l-4 10z" fill={`${c}33`} stroke={c} strokeWidth="1" strokeLinejoin="round" />
        </g>
      );
    case "webpack":
      return (
        <g>
          <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill={`${c}22`} stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
          <polygon points="12,6 18,9 18,15 12,18 6,15 6,9" fill="none" stroke={c} strokeWidth="0.8" strokeLinejoin="round" />
          <line x1="12" y1="6" x2="12" y2="18" stroke={c} strokeWidth="0.8" />
          <line x1="6" y1="9" x2="18" y2="15" stroke={c} strokeWidth="0.6" />
          <line x1="18" y1="9" x2="6" y2="15" stroke={c} strokeWidth="0.6" />
        </g>
      );
    case "NestJS":
      return (
        <g>
          <circle cx="12" cy="12" r="10" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
          <text x="12" y="16" textAnchor="middle" fill={c} fontSize="7" fontWeight="700" fontFamily="system-ui">Nest</text>
        </g>
      );
    default:
      return null;
  }
}

function getAbbreviation(name: string): string {
  if (name.length <= 3) return name;
  const parts = name.replace(/[.\-_/]/g, " ").split(/\s+/);
  if (parts.length >= 2) {
    return parts
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join("");
  }
  return name.slice(0, 2).toUpperCase();
}

function getCategoryForFallback(name: string): string {
  const found = TECH_CATALOG.find((t) => t.name === name);
  return found?.category ?? "언어";
}

export function TechIcon({ src, name, color, className = "h-8 w-8" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={src}
        alt=""
        className={`${className} shrink-0`}
        onError={() => setFailed(true)}
      />
    );
  }

  const techSvg = getTechSvg(name, color);

  if (techSvg) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} shrink-0`}
        aria-hidden="true"
      >
        {techSvg}
      </svg>
    );
  }

  const abbr = getAbbreviation(name);
  const category = getCategoryForFallback(name);
  const catIcon = CATEGORY_ICONS[category] ?? CATEGORY_ICONS["언어"];

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="6"
        fill={`#${color}18`}
        stroke={`#${color}66`}
        strokeWidth="0.8"
      />
      {catIcon}
      <text
        x="12"
        y="14"
        textAnchor="middle"
        dominantBaseline="central"
        fill={`#${color}`}
        fontSize="8"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        {abbr}
      </text>
    </svg>
  );
}
