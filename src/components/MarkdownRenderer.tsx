import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import sql from "highlight.js/lib/languages/sql";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("tsx", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("jsx", javascript);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("sql", sql);

function highlightCode(code: string, lang: string): string {
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(code, { language: lang }).value;
  }
  return hljs.highlightAuto(code).value;
}

function parseInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "<img src='$2' alt='$1' class='md-img' />")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/`(.+?)`/g, "<code class='md-code'>$1</code>")
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      "<a href='$2' class='md-link' target='_blank' rel='noopener noreferrer'>$1</a>",
    );
}

function markdownToHtml(md: string): string {
  const codeBlocks: string[] = [];
  const withPlaceholders = md.replace(
    /```(\w*)\n?([\s\S]*?)```/g,
    (_, lang, code) => {
      const trimmed = code.trimEnd();
      const highlighted = highlightCode(trimmed, lang);
      const langTag = lang ? `<span class='md-lang'>${lang}</span>` : "";
      codeBlocks.push(
        `<pre class='md-pre'>${langTag}<code class="hljs">${highlighted}</code></pre>`,
      );
      return `\x00BLOCK${codeBlocks.length - 1}\x00`;
    },
  );

  const lines = withPlaceholders.split("\n");
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    const ph = trimmed.match(/^\x00BLOCK(\d+)\x00$/);
    if (ph) {
      html.push(codeBlocks[Number(ph[1])]);
      i++;
      continue;
    }

    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      html.push("<hr class='md-hr'>");
      i++;
      continue;
    }

    const h = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      const level = h[1].length;
      html.push(
        `<h${level} class='md-h${level}'>${parseInline(h[2])}</h${level}>`,
      );
      i++;
      continue;
    }

    if (trimmed.startsWith("> ")) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        bqLines.push(lines[i].trim().replace(/^> ?/, ""));
        i++;
      }
      html.push(
        `<blockquote class='md-blockquote'>${parseInline(bqLines.join("<br>"))}</blockquote>`,
      );
      continue;
    }

    if (trimmed.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^[-*] /)) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      html.push(
        `<ul class='md-ul'>${items.map((item) => `<li>${parseInline(item)}</li>`).join("")}</ul>`,
      );
      continue;
    }

    if (trimmed.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\. /)) {
        items.push(lines[i].trim().replace(/^\d+\. /, ""));
        i++;
      }
      html.push(
        `<ol class='md-ol'>${items.map((item) => `<li>${parseInline(item)}</li>`).join("")}</ol>`,
      );
      continue;
    }

    const pLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().match(/^#{1,6}\s/) &&
      !lines[i].trim().match(/^[-*] /) &&
      !lines[i].trim().match(/^\d+\. /) &&
      !lines[i].trim().startsWith("> ") &&
      !lines[i].trim().match(/^---$|^___$|^\*\*\*$/) &&
      !lines[i].trim().match(/^\x00BLOCK\d+\x00$/)
    ) {
      pLines.push(lines[i].trim());
      i++;
    }
    if (pLines.length > 0) {
      html.push(`<p class='md-p'>${parseInline(pLines.join("<br>"))}</p>`);
    }
  }

  return html.join("");
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div
      className="md-content"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
    />
  );
}
