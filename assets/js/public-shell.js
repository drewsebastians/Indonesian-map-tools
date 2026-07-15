(function () {
  "use strict";

  const header = document.querySelector("[data-public-header]");
  if (!header) return;

  const toggle = header.querySelector(".nav-toggle");
  const links = header.querySelector(".nav-links");
  if (!toggle || !links) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    links.removeAttribute("data-open");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    if (open) links.setAttribute("data-open", "");
    else links.removeAttribute("data-open");
  });

  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      close();
      toggle.focus();
    }
  });
}());
