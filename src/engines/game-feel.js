export function installGameFeel(element, options = {}) {
  if (!element) {
    return () => {};
  }

  // Basic game interaction effects
  element.style.userSelect = "none";
  element.style.webkitTapHighlightColor = "transparent";

  const handleClick = (event) => {
    const target = event.target.closest("button");

    if (!target) return;

    target.style.transform = "scale(0.97)";

    requestAnimationFrame(() => {
      target.style.transform = "";
    });
  };

  element.addEventListener("click", handleClick);

  // Cleanup function
  return () => {
    element.removeEventListener("click", handleClick);
  };
}
