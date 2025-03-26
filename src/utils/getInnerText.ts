export default function getInnerText(element: HTMLElement) {
  // Clone the element and its subtree
  const clone = element.cloneNode(true) as HTMLElement;

  // Style the clone to be invisible but rendered
  clone.style.position = "fixed"; // Remove from normal flow
  clone.style.left = "-10000px"; // Move off-screen
  clone.style.display = "block"; // Ensure it's visible
  clone.style.visibility = "visible"; // Override visibility

  // Append the clone to the DOM
  document.body.appendChild(clone);

  // Capture the innerText (with proper newlines)
  const text = clone.innerText;

  // Clean up: remove the clone
  document.body.removeChild(clone);

  return text;
}
