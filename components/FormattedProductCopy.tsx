import type { ReactNode } from "react";

const allowedTags = new Set([
  "P",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "H1",
  "H2",
  "H3",
  "DIV",
  "SPAN",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
]);

const allowedStyleProperties = new Set([
  "color",
  "background-color",
  "font-size",
  "font-weight",
  "font-style",
  "font-family",
  "text-decoration",
  "text-align",
  "line-height",
]);

function safeStyle(style: string) {
  return style
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(":");
      if (separator < 1) return "";
      const property = declaration.slice(0, separator).trim().toLowerCase();
      const value = declaration.slice(separator + 1).trim();
      if (!allowedStyleProperties.has(property)) return "";
      if (/url\s*\(|expression\s*\(|@import/i.test(value)) return "";
      return `${property}: ${value}`;
    })
    .filter(Boolean)
    .join("; ");
}

export function sanitizeProductHtml(content: string) {
  if (typeof DOMParser === "undefined" || !content.includes("<"))
    return content;
  const document = new DOMParser().parseFromString(content, "text/html");
  for (const element of Array.from(document.body.querySelectorAll("*"))) {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      continue;
    }
    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name.toLowerCase() !== "style") {
        element.removeAttribute(attribute.name);
        continue;
      }
      const cleanedStyle = safeStyle(attribute.value);
      if (cleanedStyle) element.setAttribute("style", cleanedStyle);
      else element.removeAttribute("style");
    }
  }
  return document.body.innerHTML;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function inlineHtml(value: string) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

/** Converts the supported pasted Markdown format into the same HTML shown on a product page. */
export function productCopyHtml(content: string) {
  const richHtml = sanitizeProductHtml(content);
  if (richHtml !== content || (content.includes("<") && richHtml.includes("<"))) {
    return richHtml;
  }

  const lines = content.replaceAll("\r", "").split("\n");
  const blocks: string[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)?.[0].length || 1;
      blocks.push(`<h${level}>${inlineHtml(line.slice(level + 1))}</h${level}>`);
      index += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (lines[index]?.startsWith("> ")) {
        quote.push(inlineHtml(lines[index].slice(2)));
        index += 1;
      }
      blocks.push(`<blockquote>${quote.join("<br>")}</blockquote>`);
      continue;
    }
    if (line.startsWith("- ") || /^\d+\.\s/.test(line)) {
      const ordered = /^\d+\.\s/.test(line);
      const marker = ordered ? /^\d+\.\s/ : /^-\s/;
      const items: string[] = [];
      while (marker.test(lines[index] || "")) {
        items.push(`<li>${inlineHtml((lines[index] || "").replace(marker, ""))}</li>`);
        index += 1;
      }
      blocks.push(ordered ? `<ol>${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`);
      continue;
    }
    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,3}\s|>\s|-\s|\d+\.\s)/.test(lines[index])
    ) {
      paragraph.push(inlineHtml(lines[index]));
      index += 1;
    }
    blocks.push(`<p>${paragraph.join("<br>")}</p>`);
  }
  return blocks.join("");
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <b className="formatted-copy-bold" key={index}>
          {part.slice(2, -2)}
        </b>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <i className="formatted-copy-italic" key={index}>
          {part.slice(1, -1)}
        </i>
      );
    }
    return part;
  });
}

export default function FormattedProductCopy({ content }: { content: string }) {
  const richHtml = sanitizeProductHtml(content);
  if (
    richHtml !== content ||
    (content.includes("<") && richHtml.includes("<"))
  ) {
    return (
      <div
        className="formatted-product-copy formatted-product-copy-rich"
        dangerouslySetInnerHTML={{ __html: richHtml }}
      />
    );
  }
  const lines = content.replaceAll("\r", "").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push(<h3 key={index}>{inline(line.slice(4))}</h3>);
      index += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(<h2 key={index}>{inline(line.slice(3))}</h2>);
      index += 1;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(<h1 key={index}>{inline(line.slice(2))}</h1>);
      index += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (lines[index]?.startsWith("> ")) {
        quote.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push(
        <blockquote key={index}>
          {quote.map((item, itemIndex) => (
            <span key={itemIndex}>
              {inline(item)}
              {itemIndex < quote.length - 1 && <br />}
            </span>
          ))}
        </blockquote>,
      );
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (lines[index]?.startsWith("- ")) {
        items.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push(
        <ul key={index}>
          {items.map((item) => (
            <li key={item}>{inline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (/^\d+\.\s/.test(lines[index] || "")) {
        items.push((lines[index] || "").replace(/^\d+\.\s/, ""));
        index += 1;
      }
      blocks.push(
        <ol key={index}>
          {items.map((item) => (
            <li key={item}>{inline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,3}\s|>\s|-\s|\d+\.\s)/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(
      <p key={index}>
        {paragraph.map((item, itemIndex) => (
          <span key={itemIndex}>
            {inline(item)}
            {itemIndex < paragraph.length - 1 && <br />}
          </span>
        ))}
      </p>,
    );
  }

  return <div className="formatted-product-copy formatted-product-copy-markdown">{blocks}</div>;
}
