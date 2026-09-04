(() => {
  "use strict";
  const start = () => {
    const panel = document.querySelector("#maindiv");
    if (!panel) return;
    const controls = document.createElement("div");
    controls.className = "panel-zoom";
    controls.hidden = true;
    controls.setAttribute("aria-label", "Panel preview zoom");
    controls.innerHTML = '<button type="button" aria-label="Zoom panel out">−</button><output aria-live="polite">100%</output><button type="button" aria-label="Zoom panel in">+</button><button type="button" data-fit>Fit</button>';
    document.body.append(controls);
    let zoom = 1, limit = 1, frame;
    const fit = () => {
      frame = null;
      const visible = document.body.classList.contains("builder-active") && panel.getClientRects().length > 0 && getComputedStyle(panel).visibility !== "hidden";
      controls.hidden = !visible;
      if (!visible) return;
      const top = Math.max(80, document.querySelector(".right-bar")?.getBoundingClientRect().bottom || 0) + 58;
      let left = 24;
      for (const option of document.querySelectorAll(".rmenu-item-list.show, .accessories-rmenu.show, .rmenu-item-round.show")) {
        option.style.setProperty("top", `${top - 46}px`, "important");
        option.style.setProperty("max-height", `${Math.max(80, window.innerHeight - top + 30)}px`, "important");
        if (option.getClientRects().length) left = Math.max(left, option.getBoundingClientRect().right + 24);
      }
      const right = document.documentElement.clientWidth - 24;
      const actions = document.querySelector(".tp-flogo");
      const rect = actions?.getBoundingClientRect();
      const bottom = Math.min(window.innerHeight - 24, actions?.getClientRects().length && rect.height > 0 ? rect.top - 24 : window.innerHeight - 24);
      const width = Math.max(80, right - left), height = Math.max(60, bottom - top);
      limit = Math.min(1.5, width / panel.offsetWidth, height / panel.offsetHeight);
      const scale = Math.min(zoom, limit);
      panel.style.setProperty("position", "fixed", "important");
      panel.style.setProperty("left", `${left + width / 2}px`, "important");
      panel.style.setProperty("top", `${top + height / 2}px`, "important");
      panel.style.setProperty("transform", `translate(-50%, -50%) scale(${scale})`, "important");
      controls.style.left = `${left}px`;
      controls.style.top = `${top - 48}px`;
      controls.querySelector("output").textContent = `${Math.round(scale * 100)}%`;
      controls.querySelector('[aria-label="Zoom panel in"]').disabled = scale >= limit - 0.01;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(fit); };
    controls.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      zoom = button.hasAttribute("data-fit") ? limit : Math.max(0.2, Math.min(zoom, limit) + (button.getAttribute("aria-label").includes("out") ? -0.1 : 0.1));
      schedule();
    });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    new MutationObserver(schedule).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
    const nav = document.querySelector(".right-bar");
    if (nav) new ResizeObserver(schedule).observe(nav);
    schedule();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
