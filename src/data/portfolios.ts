export type Tech = {
  name: string;
  version: string;
  icon: string;
};

export type Section = {
  id: string;
  title: string;
  body: string;
  image?: string;
};

export type Portfolio = {
  id: string;
  title: string;
  description: string;
  detail: string;
  body: string;
  sections?: Section[];
  techs: Tech[];
  url: string;
  github?: string;
};

export const portfolios: Portfolio[] = [
  {
    id: "web-main",
    title: "개발자를 위한 랜덤채팅",
    description: "",
    detail:
      "기술스택을 선택하고 채팅을 시작하여 관심스택이 겹치는 사람과 대화하거나 맞지않는다면 다시 다른사람과 채팅할수 있는 서비스이며 웹소켓의 이해하고 심도있게 공부하기 위해 개발하였습니다",
    body: "여기에 실제 프로젝트 스크린샷, 역할, 사용 기술, 성과 등을 채워 넣으면 됩니다.",
    url: "https://your-random-chat.example.com",
    techs: [
      {
        name: "React",
        version: "v18.2.0",
        icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg",
      },
      {
        name: "TypeScript",
        version: "v5.x",
        icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg",
      },
      {
        name: "Tailwind CSS",
        version: "v3.x",
        icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg",
      },
    ],
  },
  {
    id: "side-projects",
    title: "사이드 프로젝트 모음",
    description: "토이 프로젝트부터 실험적인 아이디어까지 모아둔 공간입니다.",
    detail:
      "Next.js, Node.js 등 다양한 스택으로 만든 개인 프로젝트 모음입니다.",
    body: "각 프로젝트의 목적, 배운 점, 링크(GitHub, 배포 주소 등)를 추가해 보세요.",
    url: "https://your-side-projects.example.com",
    techs: [
      {
        name: "Next.js",
        version: "v14.x",
        icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NextJS-Dark.svg",
      },
      {
        name: "Node.js",
        version: "v20.x",
        icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NodeJS-Dark.svg",
      },
      {
        name: "MongoDB",
        version: "v7.x",
        icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/MongoDB.svg",
      },
    ],
  },
  {
    id: "design-system",
    title: "디자인 시스템 / 컴포넌트",
    description: "재사용 가능한 UI 컴포넌트와 디자인 시스템 정리.",
    detail: "버튼, 폼, 카드 등 공통 패턴을 한 번에 확인할 수 있어요.",
    body: "컴포넌트 구조, 토큰, 가이드라인 등을 문서화해서 보여줄 수 있습니다.",
    url: "https://your-design-system.example.com",
    techs: [
      {
        name: "Storybook",
        version: "v8.x",
        icon: "https://cdn.simpleicons.org/storybook/FF4785",
      },
      {
        name: "Figma",
        version: "Design v1",
        icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Figma-Dark.svg",
      },
      {
        name: "Framer Motion",
        version: "v11.x",
        icon: "https://cdn.simpleicons.org/framer/0055FF",
      },
      {
        name: "Jest",
        version: "v29.x",
        icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Jest.svg",
      },
      {
        name: "Vitest",
        version: "v1.x",
        icon: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Vitest-Dark.svg",
      },
    ],
  },
];
