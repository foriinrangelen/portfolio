export type CatalogTech = {
  name: string;
  slug: string;
  color: string;
  version: string;
  category: string;
};

export const TECH_CATALOG: CatalogTech[] = [
  // 언어
  { name: "TypeScript", slug: "typescript", color: "3178C6", version: "v5.x", category: "언어" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E", version: "ES2024", category: "언어" },
  { name: "Python", slug: "python", color: "3776AB", version: "v3.x", category: "언어" },
  { name: "Java", slug: "java", color: "007396", version: "v21", category: "언어" },
  { name: "Go", slug: "go", color: "00ADD8", version: "v1.x", category: "언어" },
  { name: "Rust", slug: "rust", color: "000000", version: "v1.x", category: "언어" },
  { name: "Kotlin", slug: "kotlin", color: "7F52FF", version: "v2.x", category: "언어" },
  { name: "Swift", slug: "swift", color: "F05138", version: "v5.x", category: "언어" },
  { name: "C#", slug: "csharp", color: "512BD4", version: "v12", category: "언어" },
  { name: "PHP", slug: "php", color: "777BB4", version: "v8.x", category: "언어" },
  { name: "Ruby", slug: "ruby", color: "CC342D", version: "v3.x", category: "언어" },
  { name: "Dart", slug: "dart", color: "0175C2", version: "v3.x", category: "언어" },
  { name: "C++", slug: "cplusplus", color: "00599C", version: "C++23", category: "언어" },
  { name: "Scala", slug: "scala", color: "DC322F", version: "v3.x", category: "언어" },
  { name: "Elixir", slug: "elixir", color: "4B275F", version: "v1.x", category: "언어" },
  // 프론트엔드
  { name: "React", slug: "react", color: "61DAFB", version: "v19.x", category: "프론트엔드" },
  { name: "Vue.js", slug: "vuedotjs", color: "4FC08D", version: "v3.x", category: "프론트엔드" },
  { name: "Angular", slug: "angular", color: "DD0031", version: "v18.x", category: "프론트엔드" },
  { name: "Svelte", slug: "svelte", color: "FF3E00", version: "v5.x", category: "프론트엔드" },
  { name: "Next.js", slug: "nextdotjs", color: "000000", version: "v15.x", category: "프론트엔드" },
  { name: "Nuxt", slug: "nuxtdotjs", color: "00DC82", version: "v3.x", category: "프론트엔드" },
  { name: "Remix", slug: "remix", color: "000000", version: "v2.x", category: "프론트엔드" },
  { name: "Astro", slug: "astro", color: "FF5D01", version: "v4.x", category: "프론트엔드" },
  { name: "SolidJS", slug: "solid", color: "2C4F7C", version: "v1.x", category: "프론트엔드" },
  { name: "Qwik", slug: "qwik", color: "AC7EF4", version: "v1.x", category: "프론트엔드" },
  // 모바일
  { name: "Flutter", slug: "flutter", color: "02569B", version: "v3.x", category: "모바일" },
  { name: "React Native", slug: "react", color: "61DAFB", version: "v0.x", category: "모바일" },
  { name: "Expo", slug: "expo", color: "000000", version: "v51", category: "모바일" },
  // 스타일
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4", version: "v4.x", category: "스타일" },
  { name: "Sass", slug: "sass", color: "CC6699", version: "v1.x", category: "스타일" },
  { name: "styled-components", slug: "styledcomponents", color: "DB7093", version: "v6.x", category: "스타일" },
  { name: "Emotion", slug: "emotion", color: "D36AC2", version: "v11.x", category: "스타일" },
  { name: "Material UI", slug: "mui", color: "007FFF", version: "v6.x", category: "스타일" },
  { name: "Ant Design", slug: "antdesign", color: "0170FE", version: "v5.x", category: "스타일" },
  { name: "Chakra UI", slug: "chakraui", color: "319795", version: "v2.x", category: "스타일" },
  { name: "Framer Motion", slug: "framer", color: "0055FF", version: "v11.x", category: "스타일" },
  // 백엔드
  { name: "Node.js", slug: "nodedotjs", color: "339933", version: "v22.x", category: "백엔드" },
  { name: "Express", slug: "express", color: "000000", version: "v4.x", category: "백엔드" },
  { name: "NestJS", slug: "nestjs", color: "E0234E", version: "v10.x", category: "백엔드" },
  { name: "FastAPI", slug: "fastapi", color: "009688", version: "v0.x", category: "백엔드" },
  { name: "Django", slug: "django", color: "092E20", version: "v5.x", category: "백엔드" },
  { name: "Flask", slug: "flask", color: "000000", version: "v3.x", category: "백엔드" },
  { name: "Spring Boot", slug: "springboot", color: "6DB33F", version: "v3.x", category: "백엔드" },
  { name: "Bun", slug: "bun", color: "FBF0DF", version: "v1.x", category: "백엔드" },
  { name: "Deno", slug: "deno", color: "70FFAF", version: "v2.x", category: "백엔드" },
  { name: "Hono", slug: "hono", color: "E36002", version: "v4.x", category: "백엔드" },
  { name: "Gin", slug: "go", color: "00ADD8", version: "v1.x", category: "백엔드" },
  { name: "Phoenix", slug: "phoenixframework", color: "FD4F00", version: "v1.x", category: "백엔드" },
  // 데이터베이스
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1", version: "v16", category: "데이터베이스" },
  { name: "MySQL", slug: "mysql", color: "4479A1", version: "v8.x", category: "데이터베이스" },
  { name: "MongoDB", slug: "mongodb", color: "47A248", version: "v7.x", category: "데이터베이스" },
  { name: "Redis", slug: "redis", color: "FF4438", version: "v7.x", category: "데이터베이스" },
  { name: "SQLite", slug: "sqlite", color: "003B57", version: "v3.x", category: "데이터베이스" },
  { name: "Supabase", slug: "supabase", color: "3ECF8E", version: "v2.x", category: "데이터베이스" },
  { name: "Firebase", slug: "firebase", color: "FFCA28", version: "v10.x", category: "데이터베이스" },
  { name: "Elasticsearch", slug: "elasticsearch", color: "005571", version: "v8.x", category: "데이터베이스" },
  // ORM
  { name: "Prisma", slug: "prisma", color: "2D3748", version: "v5.x", category: "ORM" },
  { name: "Drizzle", slug: "drizzle", color: "C5F74F", version: "v0.x", category: "ORM" },
  { name: "TypeORM", slug: "typeorm", color: "FE0803", version: "v0.x", category: "ORM" },
  // DevOps / 클라우드
  { name: "Docker", slug: "docker", color: "2496ED", version: "v26.x", category: "DevOps" },
  { name: "Kubernetes", slug: "kubernetes", color: "326CE5", version: "v1.x", category: "DevOps" },
  { name: "GitHub Actions", slug: "githubactions", color: "2088FF", version: "", category: "DevOps" },
  { name: "AWS", slug: "amazonaws", color: "FF9900", version: "", category: "클라우드" },
  { name: "GCP", slug: "googlecloud", color: "4285F4", version: "", category: "클라우드" },
  { name: "Azure", slug: "microsoftazure", color: "0078D4", version: "", category: "클라우드" },
  { name: "Vercel", slug: "vercel", color: "000000", version: "", category: "클라우드" },
  { name: "Netlify", slug: "netlify", color: "00C7B7", version: "", category: "클라우드" },
  { name: "Cloudflare", slug: "cloudflare", color: "F48120", version: "", category: "클라우드" },
  // 테스트
  { name: "Jest", slug: "jest", color: "C21325", version: "v29.x", category: "테스트" },
  { name: "Vitest", slug: "vitest", color: "646CFF", version: "v2.x", category: "테스트" },
  { name: "Playwright", slug: "playwright", color: "2EAD33", version: "v1.x", category: "테스트" },
  { name: "Cypress", slug: "cypress", color: "69D3A7", version: "v13.x", category: "테스트" },
  // 빌드
  { name: "Vite", slug: "vite", color: "646CFF", version: "v6.x", category: "빌드" },
  { name: "webpack", slug: "webpack", color: "8DD6F9", version: "v5.x", category: "빌드" },
  { name: "Rollup", slug: "rollup", color: "EC4A3F", version: "v4.x", category: "빌드" },
  // API
  { name: "GraphQL", slug: "graphql", color: "E10098", version: "v16.x", category: "API" },
  { name: "tRPC", slug: "trpc", color: "2596BE", version: "v11.x", category: "API" },
  { name: "Socket.io", slug: "socketdotio", color: "010101", version: "v4.x", category: "API" },
  // 디자인
  { name: "Figma", slug: "figma", color: "F24E1E", version: "", category: "디자인" },
  { name: "Storybook", slug: "storybook", color: "FF4785", version: "v8.x", category: "디자인" },
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
