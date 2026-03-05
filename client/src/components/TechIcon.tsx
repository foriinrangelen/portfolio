import { useState } from "react";

type Props = {
  src: string;
  name: string;
  color: string;
  className?: string;
};

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

export function TechIcon({ src, name, color, className = "h-8 w-8" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={src}
        alt={name}
        className={`${className} shrink-0`}
        onError={() => setFailed(true)}
      />
    );
  }

  const abbr = getAbbreviation(name);

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
        rx="5"
        fill={`#${color}22`}
        stroke={`#${color}88`}
        strokeWidth="0.8"
      />
      <text
        x="12"
        y="13"
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
