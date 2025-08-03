export function renderContent(delta: any): string {
  if (!delta) return "";
  if (typeof delta === "string") return delta;
  if (typeof delta === "object" && delta.ops && Array.isArray(delta.ops)) {
    let html = "";
    let listType: "ordered" | "bullet" | null = null;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        if (listType === "ordered") {
          html += `<ol class="list-decimal list-inside ml-4 space-y-1"><li>${listItems.join("</li><li>")}</li></ol>`;
        } else if (listType === "bullet") {
          html += `<ul class="list-disc list-inside ml-4 space-y-1"><li>${listItems.join("</li><li>")}</li></ul>`;
        }
        listItems = [];
        listType = null;
      }
    };

    for (const op of delta.ops) {
      if (typeof op.insert === "string") {
        let text = op.insert;
        if (text === "\n" && op.attributes?.list) {
          const currentListType = op.attributes.list as "ordered" | "bullet";

          if (listType !== currentListType) {
            flushList();
            listType = currentListType;
          }
          continue;
        }

        if (text === "\n") {
          flushList();
          if (op.attributes?.header) {
            html += "<br>";
          } else {
            html += "<br>";
          }
          continue;
        }
        if (op.attributes) {
          if (op.attributes.bold) text = `<strong>${text}</strong>`;
          if (op.attributes.italic) text = `<em>${text}</em>`;
          if (op.attributes.underline) text = `<u>${text}</u>`;
          if (op.attributes.strike) text = `<del>${text}</del>`;
          if (op.attributes.code)
            text = `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">${text}</code>`;
          if (op.attributes.link)
            text = `<a href="${op.attributes.link}" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
          if (op.attributes.header) {
            const level = op.attributes.header;
            flushList();
            text = `<h${level} class="font-bold text-gray-900 my-3 leading-tight">${text}</h${level}>`;
          }
          if (op.attributes.blockquote) {
            flushList();
            text = `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">${text}</blockquote>`;
          }
          if (op.attributes["code-block"]) {
            flushList();
            text = `<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2"><code class="font-mono text-sm">${text}</code></pre>`;
          }
          if (op.attributes.align) {
            const alignment = op.attributes.align;
            text = `<div class="text-${alignment}">${text}</div>`;
          }
        }
        if (
          listType &&
          !op.attributes?.header &&
          !op.attributes?.blockquote &&
          !op.attributes?.["code-block"]
        ) {
          if (listItems.length === 0 || text.trim()) {
            if (listItems.length === 0) {
              listItems.push(text);
            } else {
              listItems[listItems.length - 1] += text;
            }
          }
        } else {
          flushList();
          html += text;
        }
      }
    }

    flushList();

    return html;
  }
  if (typeof delta === "object") {
    try {
      return JSON.stringify(delta);
    } catch {
      return String(delta);
    }
  }

  return String(delta || "");
}
export const CONTENT_DISPLAY_CLASSES =
  "prose prose-sm max-w-none student-content-display rich-text-content day-content-display";
