// Petit rendu Markdown minimal (titres, gras, italique, liens, listes, paragraphes, images)
// Suffisant pour un journal simple sans dépendance externe.

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderMarkdown(md: string): string {
  const src = md.replace(/\r\n/g, "\n");
  const lines = src.split("\n");
  const out: string[] = [];
  let inList = false;
  let paraBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length) {
      const html = inline(paraBuf.join(" ").trim());
      if (html) out.push(`<p>${html}</p>`);
      paraBuf = [];
    }
  };
  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  const inline = (t: string) => {
    let x = escapeHtml(t);
    // images ![alt](url)
    x = x.replace(
      /!\[([^\]]*)\]\(([^)\s]+)\)/g,
      '<img src="$2" alt="$1" class="rounded-lg my-6 w-full" loading="lazy" />'
    );
    // liens [text](url)
    x = x.replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cosmic-gold underline hover:text-cosmic-cyan">$1</a>'
    );
    x = x.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    x = x.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    x = x.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-sm">$1</code>');
    return x;
  };

  for (const raw of lines) {
    const line = raw;
    if (/^\s*$/.test(line)) {
      flushPara();
      closeList();
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^#{1,6}\s+(.*)$/))) {
      flushPara();
      closeList();
      const level = (line.match(/^#+/)?.[0].length ?? 1);
      const sizes = ["", "text-3xl mt-8 mb-4", "text-2xl mt-6 mb-3", "text-xl mt-5 mb-2", "text-lg mt-4 mb-2", "text-base mt-3 mb-2", "text-sm mt-2 mb-1"];
      out.push(`<h${level} class="font-space font-bold ${sizes[level]}">${inline(m[1])}</h${level}>`);
      continue;
    }
    if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      flushPara();
      if (!inList) {
        out.push('<ul class="list-disc pl-6 my-4 space-y-2">');
        inList = true;
      }
      out.push(`<li>${inline(m[1])}</li>`);
      continue;
    }
    closeList();
    paraBuf.push(line);
  }
  flushPara();
  closeList();
  return out.join("\n");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}