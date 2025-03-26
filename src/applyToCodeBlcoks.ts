import { codeToHtml } from "shiki";
import codeBlockCss from "./code-block.css?raw";
import getInnerText from "./utils/getInnerText";

async function applyToCodeBlocks() {
  // Select all code blocks with both .mw-highlight and language class
  const codeBlocks = document.querySelectorAll<HTMLElement>(
    '.mw-highlight[class*="mw-highlight-lang-"], pre.prettyprint'
  );

  codeBlocks.forEach(async (element) => {
    let lang: string;
    if (element.classList.contains("prettyprint")) {
      // Treat .prettyprint as wikitext
      lang = "wikitext";
    } else {
      const langClass = Array.from(element.classList).find((c) =>
        c.startsWith("mw-highlight-lang-")
      );
      lang = langClass?.split("-").pop() || "text";
    }

    try {
      const code = getInnerText(element);

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

      // Create container div
      const container = document.createElement("div");
      container.className = `language-${lang}`;

      // Create and configure copy button
      const copyBtn = document.createElement("button");
      copyBtn.title = "Copy code";
      copyBtn.className = "copy";
      copyBtn.onclick = () => navigator.clipboard.writeText(code);

      // Create language tag
      const langTag = document.createElement("span");
      langTag.className = "lang";
      langTag.textContent = lang;

      // Create highlighted code block
      const codeBlock = document.createElement("div");
      codeBlock.innerHTML = highlighted;

      // Create styles
      const styles = document.createElement("style");
      styles.textContent = codeBlockCss;

      // Build DOM structure
      container.append(copyBtn, langTag, codeBlock, styles);
      shadowRoot.appendChild(container); // Append directly to shadow root

      // Replace original element
      element.replaceWith(host);
    } catch (error) {
      console.error("Error loading Shiki:", error);
    }
  });
}

export default applyToCodeBlocks;
