export type CatalogTech = {
  name: string;
  slug: string;
  color: string;
  version: string;
  category: string;
  /** true → simpleicons CDN, default(undefined) → skill-icons CDN */
  simple?: boolean;
};

const SKILL =
  "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons";
const SIMPLE = "https://cdn.simpleicons.org";

export function techIconUrl(t: CatalogTech) {
  if (t.simple) return `${SIMPLE}/${t.slug}/${t.color}`;
  return `${SKILL}/${t.slug}.svg`;
}

export const TECH_CATALOG: CatalogTech[] = [
  // ── 언어 ──
  {
    name: "TypeScript",
    slug: "TypeScript",
    color: "3178C6",
    version: "v5.x",
    category: "언어",
  },
  {
    name: "JavaScript",
    slug: "JavaScript",
    color: "F7DF1E",
    version: "ES2024",
    category: "언어",
  },
  {
    name: "Python",
    slug: "Python-Light",
    color: "3776AB",
    version: "v3.x",
    category: "언어",
  },
  {
    name: "Java",
    slug: "Java-Light",
    color: "007396",
    version: "v21",
    category: "언어",
  },
  {
    name: "Go",
    slug: "GoLang",
    color: "00ADD8",
    version: "v1.x",
    category: "언어",
  },
  {
    name: "Rust",
    slug: "Rust",
    color: "000000",
    version: "v1.x",
    category: "언어",
  },
  {
    name: "Kotlin",
    slug: "Kotlin-Light",
    color: "7F52FF",
    version: "v2.x",
    category: "언어",
  },
  {
    name: "Swift",
    slug: "Swift",
    color: "F05138",
    version: "v5.x",
    category: "언어",
  },
  { name: "C#", slug: "CS", color: "512BD4", version: "v12", category: "언어" },
  {
    name: "PHP",
    slug: "PHP-Light",
    color: "777BB4",
    version: "v8.x",
    category: "언어",
  },
  {
    name: "Ruby",
    slug: "Ruby",
    color: "CC342D",
    version: "v3.x",
    category: "언어",
  },
  {
    name: "Dart",
    slug: "Dart-Light",
    color: "0175C2",
    version: "v3.x",
    category: "언어",
  },
  {
    name: "C++",
    slug: "CPP",
    color: "00599C",
    version: "C++23",
    category: "언어",
  },
  {
    name: "Scala",
    slug: "Scala-Light",
    color: "DC322F",
    version: "v3.x",
    category: "언어",
  },
  {
    name: "Elixir",
    slug: "Elixir-Light",
    color: "4B275F",
    version: "v1.x",
    category: "언어",
  },

  // ── 프론트엔드 ──
  {
    name: "React",
    slug: "React-Light",
    color: "61DAFB",
    version: "v19.x",
    category: "프론트엔드",
  },
  {
    name: "Vue.js",
    slug: "VueJS-Light",
    color: "4FC08D",
    version: "v3.x",
    category: "프론트엔드",
  },
  {
    name: "Angular",
    slug: "Angular-Light",
    color: "DD0031",
    version: "v18.x",
    category: "프론트엔드",
  },
  {
    name: "Svelte",
    slug: "Svelte",
    color: "FF3E00",
    version: "v5.x",
    category: "프론트엔드",
  },
  {
    name: "Next.js",
    slug: "NextJS-Light",
    color: "000000",
    version: "v15.x",
    category: "프론트엔드",
  },
  {
    name: "Nuxt",
    slug: "NuxtJS-Light",
    color: "00DC82",
    version: "v3.x",
    category: "프론트엔드",
  },
  {
    name: "Remix",
    slug: "Remix-Light",
    color: "000000",
    version: "v2.x",
    category: "프론트엔드",
  },
  {
    name: "Astro",
    slug: "Astro",
    color: "FF5D01",
    version: "v4.x",
    category: "프론트엔드",
  },
  {
    name: "SolidJS",
    slug: "SolidJS-Light",
    color: "2C4F7C",
    version: "v1.x",
    category: "프론트엔드",
  },
  {
    name: "Qwik",
    slug: "qwik",
    color: "AC7EF4",
    version: "v1.x",
    category: "프론트엔드",
    simple: true,
  },

  // ── 모바일 ──
  {
    name: "Flutter",
    slug: "Flutter-Light",
    color: "02569B",
    version: "v3.x",
    category: "모바일",
  },
  {
    name: "React Native",
    slug: "React-Light",
    color: "61DAFB",
    version: "v0.x",
    category: "모바일",
  },
  {
    name: "Expo",
    slug: "expo",
    color: "000020",
    version: "v51",
    category: "모바일",
    simple: true,
  },

  // ── 스타일 ──
  {
    name: "Tailwind CSS",
    slug: "TailwindCSS-Light",
    color: "06B6D4",
    version: "v4.x",
    category: "스타일",
  },
  {
    name: "Sass",
    slug: "Sass",
    color: "CC6699",
    version: "v1.x",
    category: "스타일",
  },
  {
    name: "styled-components",
    slug: "StyledComponents",
    color: "DB7093",
    version: "v6.x",
    category: "스타일",
  },
  {
    name: "Emotion",
    slug: "Emotion-Light",
    color: "D36AC2",
    version: "v11.x",
    category: "스타일",
  },
  {
    name: "Material UI",
    slug: "MaterialUI-Light",
    color: "007FFF",
    version: "v6.x",
    category: "스타일",
  },
  {
    name: "Ant Design",
    slug: "antdesign",
    color: "0170FE",
    version: "v5.x",
    category: "스타일",
    simple: true,
  },
  {
    name: "Chakra UI",
    slug: "chakraui",
    color: "319795",
    version: "v2.x",
    category: "스타일",
    simple: true,
  },
  {
    name: "Framer Motion",
    slug: "framer",
    color: "0055FF",
    version: "v11.x",
    category: "스타일",
    simple: true,
  },

  // ── 백엔드 ──
  {
    name: "Node.js",
    slug: "NodeJS-Light",
    color: "339933",
    version: "v22.x",
    category: "백엔드",
  },
  {
    name: "Express",
    slug: "ExpressJS-Light",
    color: "000000",
    version: "v4.x",
    category: "백엔드",
  },
  {
    name: "NestJS",
    slug: "NestJS-Light",
    color: "E0234E",
    version: "v10.x",
    category: "백엔드",
  },
  {
    name: "FastAPI",
    slug: "FastAPI",
    color: "009688",
    version: "v0.x",
    category: "백엔드",
  },
  {
    name: "Django",
    slug: "Django",
    color: "092E20",
    version: "v5.x",
    category: "백엔드",
  },
  {
    name: "Flask",
    slug: "Flask-Light",
    color: "000000",
    version: "v3.x",
    category: "백엔드",
  },
  {
    name: "Spring Boot",
    slug: "Spring-Light",
    color: "6DB33F",
    version: "v3.x",
    category: "백엔드",
  },
  {
    name: "Bun",
    slug: "Bun-Light",
    color: "FBF0DF",
    version: "v1.x",
    category: "백엔드",
  },
  {
    name: "Deno",
    slug: "DENO-Light",
    color: "70FFAF",
    version: "v2.x",
    category: "백엔드",
  },
  {
    name: "Hono",
    slug: "hono",
    color: "E36002",
    version: "v4.x",
    category: "백엔드",
    simple: true,
  },
  {
    name: "Gin",
    slug: "gin",
    color: "00ADD8",
    version: "v1.x",
    category: "백엔드",
    simple: true,
  },
  {
    name: "Phoenix",
    slug: "phoenixframework",
    color: "FD4F00",
    version: "v1.x",
    category: "백엔드",
    simple: true,
  },

  // ── 데이터베이스 ──
  {
    name: "PostgreSQL",
    slug: "PostgreSQL-Light",
    color: "4169E1",
    version: "v16",
    category: "데이터베이스",
  },
  {
    name: "MySQL",
    slug: "MySQL-Light",
    color: "4479A1",
    version: "v8.x",
    category: "데이터베이스",
  },
  {
    name: "MongoDB",
    slug: "MongoDB",
    color: "47A248",
    version: "v7.x",
    category: "데이터베이스",
  },
  {
    name: "Redis",
    slug: "Redis-Light",
    color: "FF4438",
    version: "v7.x",
    category: "데이터베이스",
  },
  {
    name: "SQLite",
    slug: "SQLite",
    color: "003B57",
    version: "v3.x",
    category: "데이터베이스",
  },
  {
    name: "Supabase",
    slug: "Supabase-Light",
    color: "3ECF8E",
    version: "v2.x",
    category: "데이터베이스",
  },
  {
    name: "Firebase",
    slug: "Firebase-Light",
    color: "FFCA28",
    version: "v10.x",
    category: "데이터베이스",
  },
  {
    name: "Elasticsearch",
    slug: "Elasticsearch-Light",
    color: "005571",
    version: "v8.x",
    category: "데이터베이스",
  },

  // ── ORM ──
  {
    name: "Prisma",
    slug: "Prisma",
    color: "2D3748",
    version: "v5.x",
    category: "ORM",
  },
  {
    name: "Drizzle",
    slug: "drizzle",
    color: "C5F74F",
    version: "v0.x",
    category: "ORM",
    simple: true,
  },
  {
    name: "TypeORM",
    slug: "typeorm",
    color: "FE0803",
    version: "v0.x",
    category: "ORM",
    simple: true,
  },

  // ── DevOps ──
  {
    name: "Docker",
    slug: "Docker",
    color: "2496ED",
    version: "v26.x",
    category: "DevOps",
  },
  {
    name: "Kubernetes",
    slug: "Kubernetes",
    color: "326CE5",
    version: "v1.x",
    category: "DevOps",
  },
  {
    name: "GitHub Actions",
    slug: "GithubActions-Light",
    color: "2088FF",
    version: "",
    category: "DevOps",
  },

  // ── 클라우드 ──
  {
    name: "AWS",
    slug: "AWS-Light",
    color: "FF9900",
    version: "",
    category: "클라우드",
  },
  {
    name: "GCP",
    slug: "GCP-Light",
    color: "4285F4",
    version: "",
    category: "클라우드",
  },
  {
    name: "Azure",
    slug: "Azure-Light",
    color: "0078D4",
    version: "",
    category: "클라우드",
  },
  {
    name: "Vercel",
    slug: "Vercel-Light",
    color: "000000",
    version: "",
    category: "클라우드",
  },
  {
    name: "Netlify",
    slug: "Netlify-Light",
    color: "00C7B7",
    version: "",
    category: "클라우드",
  },
  {
    name: "Cloudflare",
    slug: "Cloudflare-Light",
    color: "F48120",
    version: "",
    category: "클라우드",
  },

  // ── 테스트 ──
  {
    name: "Jest",
    slug: "Jest",
    color: "C21325",
    version: "v29.x",
    category: "테스트",
  },
  {
    name: "Vitest",
    slug: "Vitest-Light",
    color: "646CFF",
    version: "v2.x",
    category: "테스트",
  },
  {
    name: "Cypress",
    slug: "Cypress-Light",
    color: "69D3A7",
    version: "v13.x",
    category: "테스트",
  },

  // ── 빌드 ──
  {
    name: "Vite",
    slug: "Vite-Light",
    color: "646CFF",
    version: "v6.x",
    category: "빌드",
  },
  {
    name: "webpack",
    slug: "Webpack-Light",
    color: "8DD6F9",
    version: "v5.x",
    category: "빌드",
  },
  {
    name: "Rollup",
    slug: "RollupJS-Light",
    color: "EC4A3F",
    version: "v4.x",
    category: "빌드",
  },

  // ── API ──
  {
    name: "GraphQL",
    slug: "GraphQL-Light",
    color: "E10098",
    version: "v16.x",
    category: "API",
  },
  {
    name: "tRPC",
    slug: "trpc",
    color: "2596BE",
    version: "v11.x",
    category: "API",
    simple: true,
  },
  {
    name: "Socket.io",
    slug: "socketdotio",
    color: "010101",
    version: "v4.x",
    category: "API",
    simple: true,
  },

  // ── 디자인 ──
  {
    name: "Figma",
    slug: "Figma-Light",
    color: "F24E1E",
    version: "",
    category: "디자인",
  },
  {
    name: "Storybook",
    slug: "storybook",
    color: "FF4785",
    version: "v8.x",
    category: "디자인",
    simple: true,
  },
];

export const CATEGORIES = [
  "전체",
  "언어",
  "프론트엔드",
  "백엔드",
  "데이터베이스",
  "모바일",
  "스타일",
  "DevOps",
  "클라우드",
  "테스트",
  "빌드",
  "API",
  "ORM",
  "디자인",
];
