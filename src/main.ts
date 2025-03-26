import applyToCodeBlocks from "./applyToCodeBlcoks";
import { debounce } from "lodash-es";

// Function to observe changes to #wiki-body
async function observeWikiBody() {
  await new Promise((resolve) => {
    document.onload = resolve;
  });

  const wikiBody = document.querySelector("#wiki-body");
  if (!wikiBody) return;

  const debouncedApply = debounce(() => {
    applyToCodeBlocks();
  }, 300); // Adjust debounce delay as needed

  const observer = new MutationObserver(() => {
    debouncedApply();
  });

  observer.observe(wikiBody, { childList: true, subtree: true });
}

// Start observing #wiki-body
observeWikiBody();
// Run applyToCodeBlocks once initially
applyToCodeBlocks();
