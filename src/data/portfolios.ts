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

export const portfolios: Portfolio[] = [];
