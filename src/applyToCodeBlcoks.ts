import { codeToHtml } from "shiki";
import codeBlockCss from "./code-block.css?raw";

async function applyToCodeBlocks() {
  // Select all code blocks with both .mw-highlight and language class
  const codeBlocks = document.querySelectorAll<HTMLElement>(
    '.mw-highlight[class*="mw-highlight-lang-"]'
  );

  // Collect unique languages from all code blocks
  const languages = new Set<string>();
  codeBlocks.forEach((element) => {
    const langClass = Array.from(element.classList).find((c) =>
      c.startsWith("mw-highlight-lang-")
    );
    const lang = langClass?.split("-").pop() || "javascript";
    languages.add(lang);
  });

  // Fallback to JavaScript if no languages found
  if (languages.size === 0) languages.add("javascript");

  try {
    // Process each code block
    codeBlocks.forEach(async (originalElement) => {
      // Get language and code content
      const langClass = Array.from(originalElement.classList).find((c) =>
        c.startsWith("mw-highlight-lang-")
      );
      const lang = langClass?.split("-").pop() || "javascript";
      const code = originalElement.innerText;

      // Create shadow host and root
      const host = document.createElement("div");
      const shadowRoot = host.attachShadow({ mode: "open" });

      // Generate syntax-highlighted HTML
      const highlighted = await codeToHtml(code, {
        lang: lang,
        themes: {
          dark: "dark-plus",
          light: "light-plus",
        },
      });

      // Apply styles and content to shadow DOM
      //   <div :class="`language-${lang}`">
      //   <button
      //     :title="t('github-files.copy-code')"
      //     class="copy"
      //     @click="copyToClipboard(code)"
      //   ></button>
      //   <span class="lang">{{ lang }}</span>
      //     <component :is="vnode" />
      //     <style>...</style>
      // </div>
      shadowRoot.innerHTML = (() => {
        // outer html
        let html = document.createElement("div");
        html.className = `language-${lang}`;
        // copy text btn
        let btn = document.createElement("button");
        btn.title = "Copy code";
        btn.className = "copy";
        btn.onclick = () => {
          navigator.clipboard.writeText(code).then(() => {
            console.log("Code copied to clipboard!");
          });
        };
        html.appendChild(btn);
        // lang tag
        let span = document.createElement("span");
        span.className = "lang";
        span.innerText = lang;
        html.appendChild(span);
        // code block
        let codeBlock = document.createElement("div");
        codeBlock.innerHTML = highlighted;
        html.appendChild(codeBlock);
        // style tag
        let style = document.createElement("style");
        style.innerHTML = codeBlockCss;
        html.appendChild(style);
        // return outer html
        return html.outerHTML;
      })();

      // Replace original element with shadow host
      originalElement.replaceWith(host);
    });
  } catch (error) {
    console.error("Error loading Shiki:", error);
  }
}

export default applyToCodeBlocks;
