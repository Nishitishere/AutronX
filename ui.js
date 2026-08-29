(() => {
  "use strict";

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  onReady(() => {
    const body = document.body;
    const seriesButtons = [...document.querySelectorAll("#buildbtn, #colorSec, #auraPlusSec")];
    const stepItems = [...document.querySelectorAll(".rmenu-list > .rmenu-item")];
    const status = document.querySelector("#builder-progress-hint");
    const statusText = document.querySelector("#workspaceStatusText");
    const quantity = document.querySelector("#QuantityValue");
    const email = document.querySelector("#email-verify");
    const navbarContext = document.querySelector(".navbar-context");
    const stepNames = ["material", "size", "accessories", "icons", "glass colour", "frame finish"];

    const setupStepIcons = () => {
      const icons = [
        '<path d="m12 3-8 4.5 8 4.5 8-4.5L12 3Z"/><path d="m4 12 8 4.5 8-4.5"/><path d="m4 16.5 8 4.5 8-4.5"/>',
        '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 8h8v8H8z"/><path d="M16.5 3v3.5H20"/>',
        '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><path d="M17 13.5v7M13.5 17h7"/>',
        '<path d="M12 3.5a7 7 0 0 0-4.25 12.56c.8.62 1.25 1.44 1.25 2.32V19h6v-.62c0-.9.48-1.74 1.3-2.38A7 7 0 0 0 12 3.5Z"/><path d="M9.5 22h5M9 8.5c.7-1 1.7-1.5 3-1.5"/>',
        '<path d="M12 3a9 9 0 1 0 9 9c0-1.1-.9-2-2-2h-1.1a2 2 0 0 1-1.8-2.9l.45-.9A2.2 2.2 0 0 0 14.58 3H12Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="15.5" r="1"/>',
        '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 9h10v6H7z"/><path d="M3 10h4M17 10h4"/>',
      ];

      stepItems.forEach((item, index) => {
        const svg = item.querySelector(":scope > svg");
        if (!svg || !icons[index]) return;
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.8");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.removeAttribute("style");
        svg.innerHTML = icons[index];
      });
    };

    setupStepIcons();

    const setupMaterialStage = () => {
      const workspace = document.querySelector(".tp-container");
      const materialStep = document.querySelector(".rmenu-item.material");
      if (!workspace || !materialStep || workspace.querySelector(".material-stage")) return null;

      const stage = document.createElement("section");
      stage.className = "material-stage";
      stage.hidden = true;
      stage.setAttribute("aria-labelledby", "material-stage-title");
      stage.innerHTML = `
        <div class="material-stage-content">
          <span class="material-stage-kicker">Step 1 · Material</span>
          <h2 id="material-stage-title">Choose your material</h2>
          <p>Select the surface that best suits your interior. You can return and change it at any time.</p>
          <div class="material-choice-grid" role="group" aria-label="Panel material">
            <button class="material-choice-card" type="button" data-material="glass">
              <span class="material-choice-copy"><strong>Glass</strong><small>Polished, reflective finish</small></span>
              <span class="material-choice-arrow" aria-hidden="true">→</span>
            </button>
            <button class="material-choice-card" type="button" data-material="acrylic">
              <span class="material-choice-copy"><strong>Acrylic</strong><small>Clean, durable finish</small></span>
              <span class="material-choice-arrow" aria-hidden="true">→</span>
            </button>
          </div>
          <span class="material-stage-note">Your selection unlocks panel sizing</span>
        </div>`;
      workspace.appendChild(stage);

      for (const button of stage.querySelectorAll(".material-choice-card")) {
        button.addEventListener("click", () => {
          const source = document.querySelector(`.rmenu-item-material[title="${button.dataset.material}"]`);
          if (!source) return;
          source.click();
          window.setTimeout(() => document.querySelector(".rmenu-item.size")?.click(), 0);
        });
      }

      return stage;
    };

    const materialStage = setupMaterialStage();
    const stepPanelSelector = ":scope > .rmenu-item-list, :scope > .accessories-rmenu, :scope > .rmenu-item-round";
    const optionPanels = stepItems.flatMap((item) => [...item.querySelectorAll(stepPanelSelector)]);

    // Treat the stepper as one controlled view: a step change closes every
    // previous option surface before the legacy handlers open the new one.
    // This mirrors the reference builder's single currentStep state and keeps
    // saved selections independent from which options panel is visible.
    const closeStepPanels = () => {
      for (const panel of optionPanels) {
        panel.classList.remove("show");
        panel.classList.add("hide");
      }
      for (const item of stepItems) item.setAttribute("aria-expanded", "false");
    };

    const syncStepPanels = (activeIndex) => {
      const activeItem = stepItems[activeIndex];
      for (const panel of optionPanels) {
        const owner = panel.closest(".rmenu-list > .rmenu-item");
        const materialIsCentral = owner?.classList.contains("material") && body.classList.contains("material-stage-active");
        const shouldRemainOpen = owner === activeItem && panel.classList.contains("show") && !materialIsCentral;
        panel.classList.toggle("hide", !shouldRemainOpen);
        if (!shouldRemainOpen) panel.classList.remove("show");
      }
      stepItems.forEach((item, index) => {
        const panel = item.querySelector(stepPanelSelector);
        item.setAttribute("aria-expanded", String(Boolean(panel && index === activeIndex && panel.classList.contains("show"))));
      });
    };

    const syncMaterialStage = () => {
      if (!materialStage) return;
      const materialStep = document.querySelector(".rmenu-item.material");
      const anotherStepIsActive = stepItems.slice(1).some((item) => item.classList.contains("active"));
      const showStage = body.classList.contains("builder-active") &&
        materialStep &&
        !materialStep.classList.contains("disabled") &&
        !anotherStepIsActive;

      materialStage.hidden = !showStage;
      body.classList.toggle("material-stage-active", Boolean(showStage));

      for (const button of materialStage.querySelectorAll(".material-choice-card")) {
        const source = document.querySelector(`.rmenu-item-material[title="${button.dataset.material}"]`);
        const selected = Boolean(source?.classList.contains("active"));
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      }
    };

    const setupIconBrowser = () => {
      const iconList = document.querySelector(".rmenu-icon");
      if (!iconList || iconList.querySelector(".icon-browser-toolbar")) return;

      const initialChildren = [...iconList.children];
      const firstCategoryIndex = initialChildren.findIndex((child) => child.classList.contains("rmenu-icon-title"));
      const leadingIcon = initialChildren
        .slice(0, firstCategoryIndex === -1 ? initialChildren.length : firstCategoryIndex)
        .find((child) => child.classList.contains("rmenu-item-i"));
      if (leadingIcon) {
        const essentialsTitle = document.createElement("li");
        essentialsTitle.className = "rmenu-icon-title";
        essentialsTitle.innerHTML = "<strong>Essentials</strong>";
        iconList.insertBefore(essentialsTitle, leadingIcon);
      }

      const sections = [];
      let currentSection = null;

      for (const child of [...iconList.children]) {
        if (child.classList.contains("rmenu-icon-title")) {
          currentSection = {
            title: child,
            name: child.textContent.trim(),
            items: [],
          };
          sections.push(currentSection);
        } else if (child.classList.contains("rmenu-item-i") && currentSection) {
          const image = child.querySelector("img");
          const imageLabel = image?.alt?.trim() || "Icon";
          currentSection.items.push({ element: child, label: imageLabel });
          child.dataset.iconCategory = currentSection.name;
          child.setAttribute("aria-label", `${currentSection.name}: ${imageLabel}`);
          child.title = `${currentSection.name} · ${imageLabel}`;
        }
      }

      const iconCount = sections.reduce((total, section) => total + section.items.length, 0);
      const toolbar = document.createElement("li");
      toolbar.className = "icon-browser-toolbar";
      toolbar.innerHTML = `
        <div class="icon-browser-heading">
          <div>
            <strong>Icon library</strong>
            <span>Choose or drag an icon onto a switch</span>
          </div>
          <span class="icon-result-count" aria-live="polite">${iconCount}</span>
        </div>
        <label class="icon-search-field">
          <span class="sr-only">Search icons</span>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"/></svg>
          <input type="search" placeholder="Search icons" autocomplete="off" />
        </label>
        <label class="icon-category-field">
          <span class="sr-only">Icon category</span>
          <select aria-label="Icon category">
            <option value="all">All categories</option>
            ${sections.map((section) => `<option value="${section.name.replace(/"/g, "&quot;")}">${section.name}</option>`).join("")}
          </select>
        </label>`;
      iconList.insertBefore(toolbar, iconList.firstChild);

      const emptyState = document.createElement("li");
      emptyState.className = "icon-empty-state";
      emptyState.hidden = true;
      emptyState.innerHTML = "<strong>No icons found</strong><span>Try another keyword or category.</span>";
      toolbar.insertAdjacentElement("afterend", emptyState);

      const searchInput = toolbar.querySelector("input");
      const categorySelect = toolbar.querySelector("select");
      const resultCount = toolbar.querySelector(".icon-result-count");

      const syncCategoryTitle = () => {
        categorySelect.title = categorySelect.selectedOptions[0]?.textContent || "All categories";
      };

      const updateIconResults = () => {
        const term = searchInput.value.trim().toLocaleLowerCase();
        const selectedCategory = categorySelect.value;
        let visibleCount = 0;

        for (const section of sections) {
          const categoryMatches = selectedCategory === "all" || selectedCategory === section.name;
          let sectionCount = 0;

          for (const item of section.items) {
            const searchableText = `${section.name} ${item.label}`.toLocaleLowerCase();
            const visible = categoryMatches && (!term || searchableText.includes(term));
            item.element.hidden = !visible;
            if (visible) sectionCount += 1;
          }

          section.title.hidden = sectionCount === 0;
          visibleCount += sectionCount;
        }

        resultCount.textContent = String(visibleCount);
        emptyState.hidden = visibleCount !== 0;
        iconList.scrollTop = 0;
      };

      toolbar.addEventListener("click", (event) => event.stopPropagation());
      toolbar.addEventListener("pointerdown", (event) => event.stopPropagation());
      toolbar.addEventListener("keydown", (event) => event.stopPropagation());
      searchInput.addEventListener("input", updateIconResults);
      categorySelect.addEventListener("change", () => {
        syncCategoryTitle();
        updateIconResults();
      });
      syncCategoryTitle();
    };

    const syncSeries = (selectedButton) => {
      body.classList.add("builder-active");
      status?.removeAttribute("hidden");
      for (const button of seriesButtons) {
        button.setAttribute("aria-pressed", String(button === selectedButton));
      }
      if (navbarContext) {
        const collectionName = selectedButton.querySelector("strong")?.textContent || selectedButton.textContent;
        navbarContext.textContent = `${collectionName.trim()} · Configurator`;
      }
      syncSteps();
    };

    const syncSteps = () => {
      if (!stepItems.length) return;

      for (const [index, item] of stepItems.entries()) {
        const disabled = item.classList.contains("disabled");
        item.setAttribute("role", "button");
        item.setAttribute("aria-disabled", String(disabled));
        item.setAttribute("aria-label", `Step ${index + 1}: ${stepNames[index]}`);
        item.tabIndex = disabled ? -1 : 0;
      }

      const openStepIndex = stepItems.findIndex((item) =>
        !item.classList.contains("disabled") && item.classList.contains("active")
      );
      const firstAvailableIndex = Math.max(0, stepItems.findIndex((item) => !item.classList.contains("disabled")));
      const activeIndex = openStepIndex === -1 ? firstAvailableIndex : openStepIndex;

      stepItems.forEach((item, index) => {
        if (index === activeIndex) item.setAttribute("aria-current", "step");
        else item.removeAttribute("aria-current");
      });

      if (statusText && body.classList.contains("builder-active")) {
        statusText.textContent = `Step ${activeIndex + 1} of ${stepItems.length} · Select ${stepNames[activeIndex]}`;
      }

      syncMaterialStage();
      syncStepPanels(activeIndex);
    };

    for (const button of seriesButtons) {
      button.addEventListener("click", () => syncSeries(button));
    }

    for (const item of stepItems) {
      item.addEventListener("click", (event) => {
        // Controls inside an open step belong to the panel, not the step tab.
        // Ignoring them here prevents search/select/upload interactions from
        // closing the icon library during the capture phase.
        if (event.target.closest(".rmenu-item-list, .accessories-rmenu, .rmenu-item-round")) return;
        if (item.classList.contains("disabled")) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
        closeStepPanels();
        stepItems.forEach((candidate) => candidate.classList.toggle("active", candidate === item));
      }, true);
      item.addEventListener("keydown", (event) => {
        if ((event.key === "Enter" || event.key === " ") && !item.classList.contains("disabled")) {
          event.preventDefault();
          item.click();
        }
      });
    }

    document.addEventListener("click", () => window.setTimeout(syncSteps, 0));

    if (quantity) {
      quantity.min = "0";
      quantity.setAttribute("inputmode", "numeric");
      quantity.setAttribute("aria-label", "Panel quantity");
    }
    email?.setAttribute("aria-label", "Email address for the panel specification");
    document.querySelector(".button-minus")?.setAttribute("aria-label", "Decrease quantity");
    document.querySelector(".button-plus")?.setAttribute("aria-label", "Increase quantity");

    window.setTimeout(setupIconBrowser, 60);
    syncSteps();
  });
})();
