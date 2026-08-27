(() => {
  "use strict";

  const state = { user: null, designs: [], draft: null, draftTimer: null, draftSignature: "", editingDesign: null };

  const api = async (path, options = {}) => {
    const response = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: options.body ? { "Content-Type": "application/json", ...(options.headers || {}) } : options.headers,
    });
    const result = await response.json().catch(() => ({ success: false, message: "Invalid server response." }));
    if (!response.ok) throw Object.assign(new Error(result.message || "Request failed."), { status: response.status });
    return result;
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);

  const formatDate = (value) => new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

  const currentConfiguration = () => typeof allData !== "undefined" ? allData : {};

  const snapshotConfiguration = () => {
    const configuration = JSON.parse(JSON.stringify(currentConfiguration()));
    configuration.Quantity = document.querySelector("#QuantityValue")?.value || configuration.Quantity || "0";
    return configuration;
  };

  const isDraftable = (configuration) => configuration && configuration.Panel && configuration.Panel !== "None";

  const ready = (callback) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  };

  ready(async () => {
    const navbar = document.querySelector(".navbar");
    const context = document.querySelector(".navbar-context");
    const downloadControls = document.querySelector(".tp-flogo");
    if (!navbar || !downloadControls) return;

    const navbarActions = document.createElement("div");
    navbarActions.className = "navbar-actions";
    if (context) {
      context.before(navbarActions);
      navbarActions.appendChild(context);
    } else {
      navbar.appendChild(navbarActions);
    }

    const accountButton = document.createElement("button");
    accountButton.type = "button";
    accountButton.className = "account-trigger";
    accountButton.innerHTML = '<span class="account-avatar" aria-hidden="true">A</span><span class="account-trigger-label">Account</span>';
    navbarActions.appendChild(accountButton);

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.id = "SaveDesign";
    saveButton.className = "btn account-save-button hide";
    saveButton.textContent = "Save design";
    downloadControls.insertBefore(saveButton, downloadControls.firstChild);

    const overlay = document.createElement("div");
    overlay.className = "account-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-dialog-title">
        <header class="account-dialog-header">
          <div><span>AutronX account</span><h2 id="account-dialog-title">Welcome</h2></div>
          <button type="button" class="account-close" aria-label="Close account window">×</button>
        </header>
        <div class="account-dialog-body"></div>
      </section>`;
    document.body.appendChild(overlay);

    const accessGate = document.createElement("section");
    accessGate.className = "builder-access-gate";
    accessGate.innerHTML = '<div><span>AutronX account</span><h2>Design access requires approval.</h2><p>Create an account, then sign in after an administrator approves it to start building panels and uploading custom SVG icons.</p><button type="button">Sign in or create account</button></div>';
    document.body.appendChild(accessGate);

    const dialogTitle = overlay.querySelector("#account-dialog-title");
    const dialogBody = overlay.querySelector(".account-dialog-body");
    let lastFocus = null;

    const setBuilderAccess = () => {
      const permitted = Boolean(state.user?.status === "active");
      accessGate.hidden = permitted;
      document.body.classList.toggle("builder-auth-required", !permitted);
    };

    const mountCustomIconUpload = () => {
      const iconList = document.querySelector(".rmenu-icon");
      if (!state.user || !iconList || iconList.querySelector(".custom-icon-upload")) return;
      const item = document.createElement("li");
      item.className = "custom-icon-upload";
      item.innerHTML = '<label><span>Custom SVG</span><input type="file" accept="image/svg+xml,.svg" /><small>Upload an SVG, then drag it onto a switch.</small></label><div class="custom-icon-message" aria-live="polite"></div>';
      iconList.prepend(item);
      item.querySelector("input").addEventListener("change", async (event) => {
        const file = event.target.files?.[0];
        const message = item.querySelector(".custom-icon-message");
        if (!file) return;
        if (file.type !== "image/svg+xml" && !file.name.toLowerCase().endsWith(".svg")) { message.textContent = "SVG files only."; return; }
        if (file.size > 100 * 1024) { message.textContent = "Keep SVG files below 100 KB."; return; }
        const source = await file.text();
        const safe = /^\s*<svg[\s>]/i.test(source) && !/<\s*(script|foreignObject|iframe|object|embed|audio|video)\b/i.test(source) && !/\son[a-z]+\s*=/i.test(source) && !/(javascript:|https?:|data:)/i.test(source);
        if (!safe) { message.textContent = "This SVG contains unsupported or unsafe content."; return; }
        const image = document.createElement("img");
        image.id = `custom-svg-${crypto.randomUUID()}`;
        image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(source)))}`;
        image.alt = file.name.replace(/\.svg$/i, "");
        image.draggable = true;
        image.setAttribute("data-draggable-class", "switch");
        image.addEventListener("dragstart", drag);
        const tile = document.createElement("li");
        tile.className = "rmenu-item-i custom-icon-tile";
        tile.appendChild(image);
        item.insertAdjacentElement("afterend", tile);
        message.textContent = "Ready to drag onto a switch.";
        event.target.value = "";
      });
    };

    const showMessage = (message, type = "error") => {
      const target = dialogBody.querySelector(".account-message");
      if (!target) return;
      target.className = `account-message ${type}`;
      target.textContent = message;
      target.hidden = false;
    };

    const saveDraft = async ({ keepalive = false } = {}) => {
      if (!state.user) return;
      const configuration = snapshotConfiguration();
      if (!isDraftable(configuration)) return;
      const signature = JSON.stringify(configuration);
      if (signature === state.draftSignature) return;
      try {
        const result = await api("/api/draft", { method: "PUT", body: JSON.stringify({ configuration }), keepalive });
        state.draft = result.draft;
        state.draftSignature = signature;
      } catch (error) {
        console.warn("Draft could not be saved.", error.message);
      }
    };

    const scheduleDraftSave = () => {
      if (!state.user) return;
      window.clearTimeout(state.draftTimer);
      state.draftTimer = window.setTimeout(() => void saveDraft(), 900);
    };

    const clearDraft = async () => {
      await api("/api/draft", { method: "DELETE", body: "{}" });
      state.draft = null;
      state.draftSignature = "";
    };

    const findOption = (selector, value) => [...document.querySelectorAll(selector)].find((item) =>
      String(item.getAttribute("title") || "").toLowerCase() === String(value || "").toLowerCase()
    );

    const applyConfiguration = (configuration) => {
      if (!isDraftable(configuration)) return;
      const panelButton = configuration.Panel === "Edge" ? document.querySelector("#buildbtn")
        : configuration.Panel === "Aura+" ? document.querySelector("#auraPlusSec")
          : document.querySelector("#colorSec");
      panelButton?.click();
      findOption(".rmenu-item-material", configuration.Material === "Acrylic" ? "acrylic" : "glass")?.click();
      findOption(".rmenu-item-module", configuration.Module)?.click();
      const accessories = Object.entries(configuration)
        .filter(([key]) => key.startsWith("Accessories-"))
        .sort(([left], [right]) => Number(left.split("-")[1]) - Number(right.split("-")[1]))
        .map(([, value]) => String(value).trim());
      for (const accessory of accessories) {
        [...document.querySelectorAll(".accessories-rmenu .rmenu-item-icon")]
          .find((item) => item.textContent.trim() === accessory)?.click();
      }
      window.requestAnimationFrame(() => window.restoreAutronxPanelIcons?.(configuration));
      const finish = configuration[configuration.Material === "Acrylic" ? "Acrylic" : "Glass Color"] || configuration.glassTitle;
      findOption(".rmenu-item-glass", finish)?.click();
      findOption(".rmenu-item-frame", configuration.frame)?.click();
      if (typeof allData !== "undefined") {
        Object.keys(allData).forEach((key) => delete allData[key]);
        Object.assign(allData, configuration);
      }
      const quantity = document.querySelector("#QuantityValue");
      if (quantity && configuration.Quantity && configuration.Quantity !== "None") quantity.value = configuration.Quantity;
      state.draftSignature = JSON.stringify(configuration);
      syncSaveButton();
    };

    const resumeDraft = () => applyConfiguration(state.draft?.configuration);

    const loadDraft = async ({ resume = false } = {}) => {
      if (!state.user) return;
      const result = await api("/api/draft");
      state.draft = result.draft;
      state.draftSignature = result.draft ? JSON.stringify(result.draft.configuration) : "";
      if (resume && state.draft) resumeDraft();
    };

    const closeDialog = () => {
      overlay.hidden = true;
      document.body.classList.remove("account-open");
      lastFocus?.focus?.();
    };

    const openDialog = (view = state.user ? "designs" : "login") => {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.classList.add("account-open");
      render(view);
      window.setTimeout(() => dialogBody.querySelector("input, button, a")?.focus(), 0);
    };

    const renderAuth = (mode) => {
      const register = mode === "register";
      dialogTitle.textContent = register ? "Create your account" : "Sign in";
      dialogBody.innerHTML = `
        <div class="account-auth-layout">
          <aside class="account-auth-aside">
            <span class="account-auth-logo" aria-hidden="true"><img src="./Image/logoVerni.png" alt="" /></span>
            <div><span>Designed around you</span><h3>Keep every panel in one beautiful workspace.</h3><p>Save configurations, preview your work, and return whenever you are ready.</p></div>
          </aside>
          <div class="account-auth-main">
            <div class="account-tabs" role="tablist">
              <button type="button" class="${register ? "" : "active"}" data-account-view="login">Sign in</button>
              <button type="button" class="${register ? "active" : ""}" data-account-view="register">Create account</button>
            </div>
            <p class="account-intro">${register ? "Create your private workspace. An administrator will approve your access before you sign in." : "Continue to your saved AutronX panel designs."}</p>
            <form class="account-form" data-auth-mode="${mode}">
              ${register ? '<label>Full name<input name="name" autocomplete="name" minlength="2" maxlength="80" required /></label><label>Company name<input name="company" autocomplete="organization" minlength="2" maxlength="120" required /></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="32" required /></label>' : ""}
              <label>Email address<input name="email" type="email" autocomplete="email" required /></label>
              <label>Password<input name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" minlength="8" maxlength="128" required /></label>
              <div class="account-message" hidden></div>
              <button type="submit" class="account-primary">${register ? "Create account" : "Sign in"}</button>
            </form>
          </div>
        </div>
      `;
    };

    const designCard = (design) => {
      const configuration = design.configuration || {};
      const summary = [configuration.Panel, configuration.Material, configuration.Module ? `${configuration.Module} Module` : ""]
        .filter(Boolean).join(" · ");
      return `<article class="saved-design-card">
        <div class="saved-design-preview">${design.preview ? `<img src="${design.preview}" alt="Preview of ${escapeHtml(design.name)}" />` : "<span>No preview</span>"}</div>
        <div class="saved-design-content">
          <div class="saved-design-topline"><span>${escapeHtml(design.reference)}</span><time>${escapeHtml(formatDate(design.createdAt))}</time></div>
          <h3>${escapeHtml(design.name)}</h3>
          <p>${escapeHtml(summary || "Panel configuration")}</p>
          <details><summary>Configuration</summary><dl>${Object.entries(configuration).map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl></details>
          <button type="button" class="saved-design-delete" data-delete-design="${design.id}">Delete</button>
        </div>
      </article>`;
    };

    const renderDesigns = async () => {
      dialogTitle.textContent = "My saved designs";
      dialogBody.innerHTML = '<div class="account-loading">Loading your designs…</div>';
      try {
        state.designs = (await api("/api/designs")).designs;
        dialogBody.innerHTML = `
          <div class="account-profile-row">
            <div><span class="account-profile-avatar">${escapeHtml(state.user.name.charAt(0).toUpperCase())}</span><div><strong>${escapeHtml(state.user.name)}</strong><small>${escapeHtml(state.user.email)}</small></div></div>
            <div class="account-profile-actions"><a href="/dashboard.html">Open dashboard</a>${state.user.role === "admin" ? '<a href="/super-admin.html">Super admin</a>' : ""}<button type="button" data-account-action="logout">Sign out</button></div>
          </div>
          <div class="account-design-heading"><div><strong>Saved panels</strong><span>${state.designs.length} ${state.designs.length === 1 ? "design" : "designs"}</span></div><button type="button" data-account-action="close">Continue designing</button></div>
          ${state.draft ? `<div class="account-draft-card"><div><span>UNFINISHED DESIGN</span><strong>${escapeHtml(state.draft.configuration.Panel || "Panel")} · ${escapeHtml(state.draft.configuration.Material || "Material")} · ${escapeHtml(state.draft.configuration.Module || "?")} Module</strong><small>Saved ${escapeHtml(formatDate(state.draft.updatedAt))}</small></div><div><button type="button" data-account-action="resume-draft">Resume</button><button type="button" data-account-action="discard-draft">Discard</button></div></div>` : ""}
          <div class="account-message" hidden></div>
          <div class="saved-design-list">${state.designs.length ? state.designs.map(designCard).join("") : '<div class="account-empty"><strong>No saved designs yet</strong><span>Complete a panel and choose “Save design”.</span></div>'}</div>`;
      } catch (error) {
        if (error.status === 401) {
          state.user = null;
          updateUserUi();
          renderAuth("login");
          showMessage("Your session expired. Please sign in again.");
          return;
        }
        dialogBody.innerHTML = `<div class="account-empty"><strong>Unable to load designs</strong><span>${escapeHtml(error.message)}</span></div>`;
      }
    };

    const renderSave = () => {
      if (!state.user) {
        renderAuth("login");
        showMessage("Sign in to save this panel to your account.", "info");
        return;
      }
      const configuration = currentConfiguration();
      const panelType = typeof getPanelTypeLabel === "function" ? getPanelTypeLabel(configuration.Panel) : configuration.Panel;
      const editing = state.editingDesign;
      dialogTitle.textContent = editing ? "Edit saved design" : "Save this design";
      dialogBody.innerHTML = `
        <p class="account-intro">${editing ? `Update ${escapeHtml(editing.reference)} without creating a second saved design.` : "Keep the current panel configuration in your account for future reference."}</p>
        <form class="account-form" data-save-design>
          <label>Design name<input name="name" maxlength="80" value="${escapeHtml(editing?.name || `${panelType || "AutronX"} panel`)}" required /></label>
          <div class="save-design-summary"><span>Panel</span><strong>${escapeHtml(panelType || "Not selected")}</strong><span>Material</span><strong>${escapeHtml(configuration.Material || "Not selected")}</strong><span>Size</span><strong>${escapeHtml(configuration.Module ? `${configuration.Module} Module` : "Not selected")}</strong></div>
          <div class="account-message" hidden></div>
          <button type="submit" class="account-primary">${editing ? "Save changes" : "Save to my account"}</button>
        </form>`;
    };

    const render = (view) => {
      if (view === "save") renderSave();
      else if (view === "designs" && state.user) void renderDesigns();
      else renderAuth(view === "register" ? "register" : "login");
    };

    const updateUserUi = () => {
      const label = accountButton.querySelector(".account-trigger-label");
      const avatar = accountButton.querySelector(".account-avatar");
      if (state.user) {
        label.textContent = state.user.name.split(/\s+/)[0];
        avatar.textContent = state.user.name.charAt(0).toUpperCase();
        accountButton.setAttribute("aria-label", `Open account for ${state.user.name}`);
      } else {
        label.textContent = "Account";
        avatar.textContent = "A";
        accountButton.setAttribute("aria-label", "Sign in or create an account");
      }
      setBuilderAccess();
      if (state.user) mountCustomIconUpload();
    };

    const syncSaveButton = () => {
      const visible = document.body.classList.contains("builder-active") && document.querySelector(".rmenu-item.frame.active");
      saveButton.classList.toggle("hide", !visible);
      document.body.classList.toggle("save-design-visible", Boolean(visible));
    };

    const saveCurrentDesign = async (form) => {
      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      submit.textContent = "Saving…";
      try {
        let preview = "";
        const panelPreview = typeof window.captureAutronxPanelPreview === "function"
          ? await window.captureAutronxPanelPreview()
          : null;
        preview = panelPreview?.dataUrl || "";
        const configuration = JSON.parse(JSON.stringify(currentConfiguration()));
        if (typeof getPanelTypeLabel === "function") configuration.Panel = getPanelTypeLabel(configuration.Panel);
        configuration.Quantity = document.querySelector("#QuantityValue")?.value || configuration.Quantity || "0";
        const editing = state.editingDesign;
        const result = await api(editing ? `/api/designs/${editing.id}` : "/api/designs", {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify({
            name: new FormData(form).get("name"),
            configuration,
            preview,
            notes: document.querySelector("#additional_msg")?.value || "",
          }),
        });
        await clearDraft();
        state.editingDesign = null;
        state.designs = editing
          ? state.designs.map((design) => design.id === result.design.id ? result.design : design)
          : [result.design, ...state.designs];
        await renderDesigns();
        showMessage(editing ? "Saved changes to your design." : `Saved as ${result.design.reference}.`, "success");
      } catch (error) {
        showMessage(error.message);
        submit.disabled = false;
        submit.textContent = state.editingDesign ? "Save changes" : "Save to my account";
      }
    };

    accountButton.addEventListener("click", () => openDialog(state.user ? "designs" : "login"));
    accessGate.querySelector("button").addEventListener("click", () => openDialog("login"));
    saveButton.addEventListener("click", () => openDialog("save"));
    overlay.querySelector(".account-close").addEventListener("click", closeDialog);
    overlay.addEventListener("click", (event) => { if (event.target === overlay) closeDialog(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !overlay.hidden) closeDialog(); });
    document.addEventListener("click", () => window.setTimeout(syncSaveButton, 0));
    document.addEventListener("click", () => scheduleDraftSave());
    document.addEventListener("input", () => scheduleDraftSave());
    document.addEventListener("change", () => scheduleDraftSave());
    window.addEventListener("pagehide", () => { if (state.draftTimer) void saveDraft({ keepalive: true }); });

    dialogBody.addEventListener("click", async (event) => {
      const viewButton = event.target.closest("[data-account-view]");
      if (viewButton) render(viewButton.dataset.accountView);
      if (event.target.closest('[data-account-action="close"]')) closeDialog();
      if (event.target.closest('[data-account-action="resume-draft"]')) { resumeDraft(); closeDialog(); }
      if (event.target.closest('[data-account-action="discard-draft"]') && window.confirm("Discard your unfinished design?")) { await clearDraft(); await renderDesigns(); }
      if (event.target.closest('[data-account-action="logout"]')) {
        await api("/api/auth/logout", { method: "POST", body: "{}" });
        state.user = null;
        state.designs = [];
        updateUserUi();
        renderAuth("login");
        showMessage("You have been signed out.", "success");
      }
      const deleteButton = event.target.closest("[data-delete-design]");
      if (deleteButton && window.confirm("Delete this saved design?")) {
        await api(`/api/designs/${deleteButton.dataset.deleteDesign}`, { method: "DELETE", body: "{}" });
        state.designs = state.designs.filter((design) => design.id !== deleteButton.dataset.deleteDesign);
        await renderDesigns();
      }
    });

    dialogBody.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target;
      if (form.matches("[data-save-design]")) {
        await saveCurrentDesign(form);
        return;
      }
      if (!form.matches("[data-auth-mode]")) return;
      const mode = form.dataset.authMode;
      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      const data = Object.fromEntries(new FormData(form));
      try {
        const result = await api(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(data) });
        if (mode === "register") {
          renderAuth("login");
          showMessage(result.message || "Registration received. Please wait for administrator approval.", "success");
          return;
        }
        state.user = result.user;
        updateUserUi();
        await loadDraft({ resume: true });
        if (saveButton.classList.contains("hide")) await renderDesigns();
        else renderSave();
      } catch (error) {
        showMessage(error.message);
        submit.disabled = false;
      }
    });

    try {
      state.user = (await api("/api/auth/me")).user;
      const savedEdit = JSON.parse(sessionStorage.getItem("autronx-edit-design") || "null");
      if (savedEdit?.userId === state.user?.id && savedEdit.design?.configuration) {
        state.editingDesign = savedEdit.design;
        sessionStorage.removeItem("autronx-edit-design");
        await loadDraft();
        applyConfiguration(state.editingDesign.configuration);
      } else {
        await loadDraft({ resume: true });
      }
    } catch {
      state.user = null;
    }
    updateUserUi();
    syncSaveButton();
  });
})();
