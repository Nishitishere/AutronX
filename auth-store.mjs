import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const scrypt = promisify(scryptCallback);
const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const storePath = resolve(root, "data", "accounts.json");
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000;
let store;
let writeQueue = Promise.resolve();

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function publicUser(user) {
  return user && {
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company || "",
    phone: user.phone || "",
    role: user.role,
    status: user.status || "active",
    createdAt: user.createdAt,
  };
}

async function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const derived = await scrypt(password, salt, 64);
  return { salt, hash: Buffer.from(derived).toString("hex") };
}

async function verifyPassword(password, user) {
  const derived = Buffer.from(await scrypt(password, user.passwordSalt, 64));
  const stored = Buffer.from(user.passwordHash, "hex");
  return derived.length === stored.length && timingSafeEqual(derived, stored);
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

async function persist() {
  const tempPath = `${storePath}.tmp`;
  await mkdir(dirname(storePath), { recursive: true });
  await writeFile(tempPath, JSON.stringify(store, null, 2), "utf8");
  await rename(tempPath, storePath);
}

function queueWrite(task) {
  const operation = writeQueue.then(task, task);
  writeQueue = operation.catch(() => {});
  return operation;
}

export async function initializeAccountStore() {
  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD must be configured when NODE_ENV=production.");
  }
  try {
    store = JSON.parse(await readFile(storePath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    store = { version: 1, users: [], sessions: [], designs: [], drafts: [] };
  }

  store.users ||= [];
  store.sessions ||= [];
  store.designs ||= [];
  store.drafts ||= [];
  let migratedUsers = false;
  for (const user of store.users) {
    if (!user.status) {
      user.status = "active";
      migratedUsers = true;
    }
    if (typeof user.company !== "string") { user.company = ""; migratedUsers = true; }
    if (typeof user.phone !== "string") { user.phone = ""; migratedUsers = true; }
  }
  const now = new Date().toISOString();
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || "admin@autronx.com");

  if (!store.users.some((user) => user.role === "admin")) {
    const credentials = await hashPassword(process.env.ADMIN_PASSWORD || "AutronX@123");
    store.users.push({
      id: randomUUID(),
      name: "Super Admin",
      email: adminEmail,
      role: "admin",
      status: "active",
      passwordSalt: credentials.salt,
      passwordHash: credentials.hash,
      createdAt: now,
    });
    await persist();
    console.log(`Super admin ready: ${adminEmail}`);
  }

  const timestamp = Date.now();
  const initialCount = store.sessions.length;
  store.sessions = store.sessions.filter((session) => Date.parse(session.expiresAt) > timestamp);
  if (store.sessions.length !== initialCount || migratedUsers) await persist();
}

export async function registerUser({ name, email, password, company, phone }) {
  const normalizedEmail = normalizeEmail(email);
  return queueWrite(async () => {
    if (store.users.some((user) => user.email === normalizedEmail)) {
      const error = new Error("An account already exists for this email.");
      error.statusCode = 409;
      throw error;
    }
    const credentials = await hashPassword(password);
    const user = {
      id: randomUUID(),
      name: String(name).trim().slice(0, 80),
      email: normalizedEmail,
      company: String(company).trim().slice(0, 120),
      phone: String(phone).trim().slice(0, 32),
      role: "user",
      status: "pending",
      passwordSalt: credentials.salt,
      passwordHash: credentials.hash,
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    await persist();
    return publicUser(user);
  });
}

export async function createManagedUser({ name, email, password, company, phone }) {
  const normalizedEmail = normalizeEmail(email);
  return queueWrite(async () => {
    if (store.users.some((user) => user.email === normalizedEmail)) {
      const error = new Error("An account already exists for this email.");
      error.statusCode = 409;
      throw error;
    }
    const credentials = await hashPassword(password);
    const user = {
      id: randomUUID(),
      name: String(name).trim().slice(0, 80),
      email: normalizedEmail,
      company: String(company).trim().slice(0, 120),
      phone: String(phone).trim().slice(0, 32),
      role: "user",
      status: "active",
      passwordSalt: credentials.salt,
      passwordHash: credentials.hash,
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    await persist();
    return publicUser(user);
  });
}

export async function authenticateUser(email, password) {
  const user = store.users.find((candidate) => candidate.email === normalizeEmail(email));
  if (!user || !(await verifyPassword(password, user))) return null;
  return publicUser(user);
}

export async function updateUserStatus(userId, status) {
  if (!new Set(["active", "declined"]).has(status)) {
    const error = new Error("Invalid account status.");
    error.statusCode = 400;
    throw error;
  }
  return queueWrite(async () => {
    const user = store.users.find((candidate) => candidate.id === userId);
    if (!user || user.role !== "user") {
      const error = new Error("Customer account not found.");
      error.statusCode = 404;
      throw error;
    }
    user.status = status;
    await persist();
    return publicUser(user);
  });
}

export async function updateAdminCredentials(userId, { email, currentPassword, newPassword }) {
  return queueWrite(async () => {
    const user = store.users.find((candidate) => candidate.id === userId && candidate.role === "admin");
    if (!user) {
      const error = new Error("Administrator account not found.");
      error.statusCode = 404;
      throw error;
    }
    if (!(await verifyPassword(currentPassword, user))) {
      const error = new Error("Your current password is incorrect.");
      error.statusCode = 401;
      throw error;
    }
    const normalizedEmail = normalizeEmail(email);
    if (normalizedEmail !== user.email && store.users.some((candidate) => candidate.email === normalizedEmail)) {
      const error = new Error("An account already exists for this email.");
      error.statusCode = 409;
      throw error;
    }
    user.email = normalizedEmail;
    if (newPassword) {
      const credentials = await hashPassword(newPassword);
      user.passwordSalt = credentials.salt;
      user.passwordHash = credentials.hash;
    }
    await persist();
    return publicUser(user);
  });
}

export async function createSession(userId) {
  const token = randomBytes(32).toString("base64url");
  await queueWrite(async () => {
    store.sessions = store.sessions.filter((session) => session.userId !== userId);
    store.sessions.push({
      id: randomUUID(),
      userId,
      tokenHash: hashToken(token),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + sessionLifetimeMs).toISOString(),
    });
    await persist();
  });
  return { token, maxAge: Math.floor(sessionLifetimeMs / 1000) };
}

export function getSessionUser(token) {
  if (!token) return null;
  const tokenHash = hashToken(token);
  const session = store.sessions.find((candidate) =>
    candidate.tokenHash === tokenHash && Date.parse(candidate.expiresAt) > Date.now()
  );
  if (!session) return null;
  return publicUser(store.users.find((user) => user.id === session.userId));
}

export async function deleteSession(token) {
  if (!token) return;
  const tokenHash = hashToken(token);
  await queueWrite(async () => {
    store.sessions = store.sessions.filter((session) => session.tokenHash !== tokenHash);
    await persist();
  });
}

export function listUserDesigns(userId) {
  return store.designs
    .filter((design) => design.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveUserDesign(userId, input) {
  return queueWrite(async () => {
    const now = new Date();
    const design = {
      id: randomUUID(),
      reference: `AX-${now.getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`,
      userId,
      name: String(input.name || "Untitled panel").trim().slice(0, 80),
      status: "Saved",
      configuration: input.configuration,
      preview: input.preview || "",
      notes: String(input.notes || "").trim().slice(0, 2000),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    store.designs.push(design);
    await persist();
    return design;
  });
}

export async function updateUserDesign(userId, designId, input) {
  return queueWrite(async () => {
    const design = store.designs.find((candidate) => candidate.id === designId && candidate.userId === userId);
    if (!design) return null;
    design.name = String(input.name || design.name).trim().slice(0, 80) || "Untitled panel";
    design.configuration = input.configuration;
    design.preview = input.preview || "";
    design.notes = String(input.notes || "").trim().slice(0, 2000);
    design.updatedAt = new Date().toISOString();
    await persist();
    return design;
  });
}

export async function deleteUserDesign(userId, designId) {
  return queueWrite(async () => {
    const index = store.designs.findIndex((design) => design.id === designId && design.userId === userId);
    if (index === -1) return false;
    store.designs.splice(index, 1);
    await persist();
    return true;
  });
}

export function getUserDraft(userId) {
  const draft = store.drafts.find((candidate) => candidate.userId === userId);
  return draft ? { ...draft } : null;
}

export async function saveUserDraft(userId, configuration) {
  return queueWrite(async () => {
    const now = new Date().toISOString();
    const index = store.drafts.findIndex((candidate) => candidate.userId === userId);
    const draft = {
      id: index === -1 ? randomUUID() : store.drafts[index].id,
      userId,
      configuration,
      updatedAt: now,
    };
    if (index === -1) store.drafts.push(draft);
    else store.drafts[index] = draft;
    await persist();
    return { ...draft };
  });
}

export async function deleteUserDraft(userId) {
  return queueWrite(async () => {
    const index = store.drafts.findIndex((candidate) => candidate.userId === userId);
    if (index === -1) return false;
    store.drafts.splice(index, 1);
    await persist();
    return true;
  });
}

export function getAdminOverview() {
  const users = store.users
    .map((user) => ({
      ...publicUser(user),
      designCount: store.designs.filter((design) => design.userId === user.id).length,
      hasDraft: store.drafts.some((draft) => draft.userId === user.id),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const userLookup = new Map(store.users.map((user) => [user.id, user]));
  const designs = [...store.designs]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((design) => ({
      ...design,
      owner: publicUser(userLookup.get(design.userId)),
    }));
  return {
    stats: {
      users: users.filter((user) => user.role === "user").length,
      designs: designs.length,
      admins: users.filter((user) => user.role === "admin").length,
      drafts: store.drafts.length,
    },
    users,
    designs,
  };
}
