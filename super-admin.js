(() => {
  "use strict";
  const state = { user: null, overview: null };
  const $ = (selector) => document.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
  const date = (value) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  const api = async (path, options = {}) => {
    const response = await fetch(path, { credentials: "same-origin", ...options, headers: options.body ? { "Content-Type": "application/json" } : undefined });
    const result = await response.json();
    if (!response.ok) throw Object.assign(new Error(result.message), { status: response.status });
    return result;
  };
  const statIcons = {
    users: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    designs: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 8h10v8H7z"/></svg>',
    draft: '<svg viewBox="0 0 24 24"><path d="M4 4h12l4 4v12H4z"/><path d="M8 4v5h7M8 15h8M8 18h5"/></svg>',
    admin: '<svg viewBox="0 0 24 24"><path d="M12 3 4.5 6v5c0 4.8 3.2 8.4 7.5 10 4.3-1.6 7.5-5.2 7.5-10V6L12 3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  };

  const formMessage = (selector, message, success = false) => {
    const target = $(selector);
    target.textContent = message;
    target.classList.toggle("success", success);
    target.hidden = false;
  };

  const showLogin = (message = "") => {
    $("#adminLogin").hidden = false;
    $("#adminDashboard").hidden = true;
    $("#adminLogout").hidden = true;
    if (message) { $("#adminLoginMessage").textContent = message; $("#adminLoginMessage").hidden = false; }
  };

  const designHtml = (design) => `<article class="admin-design">
    <div class="admin-design-preview">${design.preview ? `<img src="${design.preview}" alt="Preview of ${escapeHtml(design.name)}" />` : "No preview"}</div>
    <div class="admin-design-body"><div class="admin-design-meta"><span>${escapeHtml(design.reference)}</span><time>${escapeHtml(date(design.createdAt))}</time></div>
    <h3>${escapeHtml(design.name)}</h3><div class="admin-design-owner">${escapeHtml(design.owner?.name || "Unknown user")} · ${escapeHtml(design.owner?.email || "")}</div>
    <dl>${Object.entries(design.configuration || {}).map(([key,value]) => `<div><dt>${escapeHtml(key)}</dt><dd title="${escapeHtml(value)}">${escapeHtml(value)}</dd></div>`).join("")}</dl></div>
  </article>`;

  const render = () => {
    const { stats, users, designs } = state.overview;
    $("#adminAccountEmail").value = state.user?.email || "";
    $("#adminStats").innerHTML = `<div class="admin-stat"><span class="admin-stat-icon">${statIcons.users}</span><div><span>Customer accounts</span><strong>${stats.users}</strong></div></div><div class="admin-stat"><span class="admin-stat-icon">${statIcons.designs}</span><div><span>Saved designs</span><strong>${stats.designs}</strong></div></div><div class="admin-stat"><span class="admin-stat-icon">${statIcons.draft}</span><div><span>Active drafts</span><strong>${stats.drafts}</strong></div></div><div class="admin-stat"><span class="admin-stat-icon">${statIcons.admin}</span><div><span>Administrators</span><strong>${stats.admins}</strong></div></div>`;
    $("#userCountLabel").textContent = `${users.length} total accounts`;
    $("#designCountLabel").textContent = `${designs.length} saved configurations`;
    renderUsers();
    renderDesigns();
  };

  const renderUsers = () => {
    const query = $("#userSearch").value.trim().toLowerCase();
    const users = state.overview.users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query));
    $("#adminUsers").innerHTML = users.map((user) => {
      const status = user.status || "active";
      const controls = user.role === "user" ? `<div class="user-status"><span class="account-status ${escapeHtml(status)}">${escapeHtml(status)}</span>${status !== "active" ? `<button type="button" data-user-status="active" data-user-id="${user.id}">Approve</button>` : ""}${status !== "declined" ? `<button type="button" class="decline" data-user-status="declined" data-user-id="${user.id}">Decline</button>` : ""}</div>` : '<span class="account-status active">active</span>';
      return `<tr><td class="user-cell"><strong>${escapeHtml(user.name)}</strong><span>${escapeHtml(user.email)}</span></td><td class="user-contact"><strong>${escapeHtml(user.company || "—")}</strong><span>${escapeHtml(user.phone || "—")}</span></td><td><span class="role-pill">${escapeHtml(user.role)}</span></td><td>${user.designCount}</td><td><span class="draft-pill ${user.hasDraft ? "draft-present" : ""}">${user.hasDraft ? "In progress" : "None"}</span></td><td>${controls}</td><td>${escapeHtml(date(user.createdAt))}</td></tr>`;
    }).join("") || '<tr><td colspan="7">No users found.</td></tr>';
  };

  const renderDesigns = () => {
    const query = $("#designSearch").value.trim().toLowerCase();
    const designs = state.overview.designs.filter((design) => `${design.name} ${design.reference} ${design.owner?.name} ${design.owner?.email}`.toLowerCase().includes(query));
    $("#adminDesigns").innerHTML = designs.map(designHtml).join("") || '<div class="admin-empty">No saved designs found.</div>';
  };

  const loadDashboard = async () => {
    try {
      state.overview = await api("/api/admin/overview");
      $("#adminLogin").hidden = true;
      $("#adminDashboard").hidden = false;
      $("#adminLogout").hidden = false;
      render();
    } catch (error) {
      showLogin(error.status === 403 ? "This account does not have super-admin access." : "Please sign in as a super admin.");
    }
  };

  $("#adminLoginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.target.querySelector("button");
    button.disabled = true;
    $("#adminLoginMessage").hidden = true;
    try {
      const data = Object.fromEntries(new FormData(event.target));
      const result = await api("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
      if (result.user.role !== "admin") throw Object.assign(new Error("This account does not have super-admin access."), { status: 403 });
      state.user = result.user;
      await loadDashboard();
    } catch (error) {
      showLogin(error.message);
    } finally {
      button.disabled = false;
    }
  });
  $("#adminRefresh").addEventListener("click", loadDashboard);
  $("#adminLogout").addEventListener("click", async () => { await api("/api/auth/logout", { method: "POST", body: "{}" }); state.user = null; showLogin("You have been signed out."); });
  $("#userSearch").addEventListener("input", renderUsers);
  $("#designSearch").addEventListener("input", renderDesigns);
  $("#adminUsers").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-user-status]");
    if (!button) return;
    button.disabled = true;
    try {
      await api(`/api/admin/users/${button.dataset.userId}/status`, { method: "PATCH", body: JSON.stringify({ status: button.dataset.userStatus }) });
      await loadDashboard();
    } catch (error) {
      button.disabled = false;
      window.alert(error.message);
    }
  });
  $("#adminCreateUserForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    button.disabled = true;
    $("#adminCreateUserMessage").hidden = true;
    try {
      const result = await api("/api/admin/users", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      form.reset();
      formMessage("#adminCreateUserMessage", `${result.user.name} can sign in now.`, true);
      await loadDashboard();
    } catch (error) {
      formMessage("#adminCreateUserMessage", error.message);
    } finally {
      button.disabled = false;
    }
  });
  $("#adminCredentialsForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    button.disabled = true;
    $("#adminCredentialsMessage").hidden = true;
    try {
      const result = await api("/api/admin/account", { method: "PATCH", body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      state.user = result.user;
      form.querySelector('[name="currentPassword"]').value = "";
      form.querySelector('[name="newPassword"]').value = "";
      formMessage("#adminCredentialsMessage", "Administrator sign-in details updated.", true);
      render();
    } catch (error) {
      formMessage("#adminCredentialsMessage", error.message);
    } finally {
      button.disabled = false;
    }
  });

  api("/api/auth/me").then((result) => {
    state.user = result.user;
    if (state.user?.role === "admin") loadDashboard(); else showLogin();
  }).catch(() => showLogin());
})();
