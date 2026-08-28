import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import {
  authenticateUser,
  createManagedUser,
  createSession,
  deleteSession,
  deleteUserDraft,
  deleteUserDesign,
  getAdminOverview,
  getSessionUser,
  getUserDraft,
  initializeAccountStore,
  listUserDesigns,
  registerUser,
  saveUserDesign,
  saveUserDraft,
  updateAdminCredentials,
  updateUserDesign,
  updateUserStatus,
} from "./auth-store.mjs";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const host = process.env.HOST || "127.0.0.1";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const maxBodyBytes = 2 * 1024 * 1024;
const authAttempts = new Map();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".htm": "text/html; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jfif": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const blockedTopLevelEntries = new Set([
  ".env",
  ".env.example",
  ".git",
  "autronx.7z",
  "autronx.zip",
  "beforepanelnamefix",
  "data",
  "Git",
  "node_modules",
  "package-lock.json",
  "package.json",
  "server.mjs",
]);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(payload));
}

function pdfText(value) {
  return String(value ?? "")
    .replace(/[\\()]/g, "\\$&")
    .replace(/[^\x20-\x7e]/g, "?");
}

function wrapPdfLine(value, width = 88) {
  const words = String(value ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const lines = [];
  let line = "";
  for (const word of words) {
    if (word.length > width) {
      if (line) lines.push(line);
      lines.push(word.slice(0, width));
      line = word.slice(width);
    } else if (!line || `${line} ${word}`.length <= width) {
      line = line ? `${line} ${word}` : word;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function jpegPreview(dataUri) {
  const match = String(dataUri || "").match(/^data:image\/jpeg;base64,([a-z0-9+/=]+)$/i);
  if (!match) return null;
  const data = Buffer.from(match[1], "base64");
  if (data.length < 4 || data[0] !== 0xff || data[1] !== 0xd8) return null;
  for (let index = 2; index < data.length - 9;) {
    if (data[index] !== 0xff) { index += 1; continue; }
    const marker = data[index + 1];
    if (marker === 0xd8 || marker === 0xd9) { index += 2; continue; }
    const length = data.readUInt16BE(index + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { data, height: data.readUInt16BE(index + 5), width: data.readUInt16BE(index + 7) };
    }
    index += length + 2;
  }
  return null;
}

function createOrderPdf(user, design) {
  const configuration = design.configuration || {};
  const preview = jpegPreview(design.preview);
  const lines = [
    "AUTRONX | ORDER SUMMARY",
    `Reference: ${design.reference}`,
    `Saved: ${new Date(design.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`,
    "",
    "CUSTOMER",
    `Name: ${user.name}`,
    `Company: ${user.company || "Not provided"}`,
    `Email: ${user.email}`,
    `Phone: ${user.phone || "Not provided"}`,
    "",
    "PANEL CONFIGURATION",
    ...Object.entries(configuration)
      .filter(([key]) => !/^\s*icon[-_:]/i.test(String(key)))
      .flatMap(([key, value]) => wrapPdfLine(`${key}: ${value}`)),
    ...(design.notes ? ["", "NOTES", ...wrapPdfLine(design.notes)] : []),
    "",
    "This document is a saved AutronX configuration summary.",
  ];
  const pageLines = [lines.slice(0, preview ? 16 : 43)];
  for (let index = preview ? 16 : 43; index < lines.length; index += 43) pageLines.push(lines.slice(index, index + 43));
  const objects = [];
  const pageIds = [];
  const contentIds = [];
  const imageId = preview ? 4 : null;
  let nextId = preview ? 5 : 4;
  for (const page of pageLines) {
    pageIds.push(nextId++);
    contentIds.push(nextId++);
  }
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  if (preview) {
    objects[imageId] = Buffer.concat([
      Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${preview.width} /Height ${preview.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${preview.data.length} >>\nstream\n`, "ascii"),
      preview.data,
      Buffer.from("\nendstream", "ascii"),
    ]);
  }
  pageLines.forEach((page, index) => {
    const pageId = pageIds[index];
    const contentId = contentIds[index];
    let body = page.map((line, lineIndex) => {
      const y = 790 - lineIndex * 16;
      const size = lineIndex === 0 ? 15 : /^[A-Z][A-Z ]+$/.test(line) ? 10 : 9;
      return `BT /F1 ${size} Tf 48 ${y} Td (${pdfText(line)}) Tj ET`;
    }).join("\n");
    if (preview && index === 0) {
      // Fit the saved builder snapshot into one stable box. A single scale
      // preserves the panel's exact proportions for every module size.
      const imageBox = { x: 48, y: 70, width: 499, height: 390 };
      const scale = Math.min(imageBox.width / preview.width, imageBox.height / preview.height);
      const width = Math.round(preview.width * scale);
      const height = Math.round(preview.height * scale);
      const x = Math.round(imageBox.x + (imageBox.width - width) / 2);
      const y = Math.round(imageBox.y + (imageBox.height - height) / 2);
      body += `\nq ${width} 0 0 ${height} ${x} ${y} cm /PanelPreview Do Q`;
    }
    const imageResource = preview && index === 0 ? ` /XObject << /PanelPreview ${imageId} 0 R >>` : "";
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >>${imageResource} >> /Contents ${contentId} 0 R >>`;
    objects[contentId] = `<< /Length ${Buffer.byteLength(body, "ascii")} >>\nstream\n${body}\nendstream`;
  });
  const chunks = [Buffer.from("%PDF-1.4\n", "ascii")];
  const offsets = [0];
  let offset = chunks[0].length;
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = offset;
    const object = Buffer.isBuffer(objects[id]) ? objects[id] : Buffer.from(objects[id], "ascii");
    const wrapper = Buffer.from(`${id} 0 obj\n`, "ascii");
    const suffix = Buffer.from("\nendobj\n", "ascii");
    chunks.push(wrapper, object, suffix);
    offset += wrapper.length + object.length + suffix.length;
  }
  let trailer = `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id += 1) trailer += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  trailer += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`;
  chunks.push(Buffer.from(trailer, "ascii"));
  return Buffer.concat(chunks);
}

function sendPdf(response, filename, pdf) {
  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Disposition": `attachment; filename="${filename.replace(/[^a-z0-9._-]/gi, "-")}"`,
    "Content-Length": pdf.length,
    "Content-Type": "application/pdf",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(pdf);
}

function parseCookies(request) {
  return Object.fromEntries(
    String(request.headers.cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf("=");
        return [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
      })
  );
}

function sessionCookie(request, token, maxAge) {
  const secure = request.socket.encrypted || request.headers["x-forwarded-proto"] === "https";
  return [
    `autronx_session=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    secure ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

function currentUser(request) {
  const user = getSessionUser(parseCookies(request).autronx_session);
  return user?.status === "active" ? user : null;
}

function requireUser(request, response, role) {
  const user = currentUser(request);
  if (!user) {
    sendJson(response, 401, { success: false, message: "Please sign in to continue." });
    return null;
  }
  if (role && user.role !== role) {
    sendJson(response, 403, { success: false, message: "You do not have access to this area." });
    return null;
  }
  return user;
}

function validateAuthInput(data, isRegistration = false) {
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");
  const name = String(data.name || "").trim();
  const company = String(data.company || "").trim();
  const phone = String(data.phone || "").trim();
  if (!isValidEmail(email)) throw Object.assign(new Error("Enter a valid email address."), { statusCode: 400 });
  if (password.length < 8 || password.length > 128) {
    throw Object.assign(new Error("Password must be between 8 and 128 characters."), { statusCode: 400 });
  }
  if (isRegistration && (name.length < 2 || name.length > 80)) {
    throw Object.assign(new Error("Name must be between 2 and 80 characters."), { statusCode: 400 });
  }
  if (isRegistration && (company.length < 2 || company.length > 120)) {
    throw Object.assign(new Error("Company name must be between 2 and 120 characters."), { statusCode: 400 });
  }
  if (isRegistration && !/^[+0-9][0-9 ()-]{6,30}$/.test(phone)) {
    throw Object.assign(new Error("Enter a valid phone number."), { statusCode: 400 });
  }
  return { email, password, name, company, phone };
}

function checkAuthRateLimit(request) {
  const key = request.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = authAttempts.get(key) || { count: 0, resetAt: now + 10 * 60 * 1000 };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + 10 * 60 * 1000;
  }
  entry.count += 1;
  authAttempts.set(key, entry);
  if (entry.count > 30) {
    throw Object.assign(new Error("Too many attempts. Please try again later."), { statusCode: 429 });
  }
}

async function handleApi(request, response, pathname) {
  try {
    if (pathname === "/api/auth/me" && request.method === "GET") {
      sendJson(response, 200, { success: true, user: currentUser(request) });
      return true;
    }

    if (pathname === "/api/auth/register" && request.method === "POST") {
      checkAuthRateLimit(request);
      const input = validateAuthInput(await readBody(request), true);
      const user = await registerUser(input);
      sendJson(response, 202, { success: true, user, message: "Registration received. An administrator must approve your account before you can sign in." });
      return true;
    }

    if (pathname === "/api/auth/login" && request.method === "POST") {
      checkAuthRateLimit(request);
      const input = validateAuthInput(await readBody(request));
      const user = await authenticateUser(input.email, input.password);
      if (!user) {
        sendJson(response, 401, { success: false, message: "Email or password is incorrect." });
        return true;
      }
      if (user.status !== "active") {
        sendJson(response, 403, {
          success: false,
          message: user.status === "pending" ? "Your account is awaiting administrator approval." : "This account has not been approved. Please contact AutronX support.",
        });
        return true;
      }
      const session = await createSession(user.id);
      response.setHeader("Set-Cookie", sessionCookie(request, session.token, session.maxAge));
      sendJson(response, 200, { success: true, user });
      return true;
    }

    if (pathname === "/api/auth/logout" && request.method === "POST") {
      const token = parseCookies(request).autronx_session;
      await deleteSession(token);
      response.setHeader("Set-Cookie", sessionCookie(request, "", 0));
      sendJson(response, 200, { success: true });
      return true;
    }

    if (pathname === "/api/designs" && request.method === "GET") {
      const user = requireUser(request, response);
      if (!user) return true;
      sendJson(response, 200, { success: true, designs: listUserDesigns(user.id) });
      return true;
    }

    if (pathname === "/api/draft" && request.method === "GET") {
      const user = requireUser(request, response);
      if (!user) return true;
      sendJson(response, 200, { success: true, draft: getUserDraft(user.id) });
      return true;
    }

    if (pathname === "/api/draft" && request.method === "PUT") {
      const user = requireUser(request, response);
      if (!user) return true;
      const data = await readBody(request);
      if (!data.configuration || typeof data.configuration !== "object" || Array.isArray(data.configuration)) {
        sendJson(response, 400, { success: false, message: "A valid draft configuration is required." });
        return true;
      }
      const serialized = JSON.stringify(data.configuration);
      if (serialized.length > 100_000) {
        sendJson(response, 413, { success: false, message: "The draft is too large to save." });
        return true;
      }
      const draft = await saveUserDraft(user.id, data.configuration);
      sendJson(response, 200, { success: true, draft });
      return true;
    }

    if (pathname === "/api/draft" && request.method === "DELETE") {
      const user = requireUser(request, response);
      if (!user) return true;
      await deleteUserDraft(user.id);
      sendJson(response, 200, { success: true });
      return true;
    }

    if (pathname === "/api/designs" && request.method === "POST") {
      const user = requireUser(request, response);
      if (!user) return true;
      const data = await readBody(request);
      if (!data.configuration || typeof data.configuration !== "object" || Array.isArray(data.configuration)) {
        sendJson(response, 400, { success: false, message: "A valid panel configuration is required." });
        return true;
      }
      const preview = String(data.preview || "");
      if (preview && (!/^data:image\/(png|jpeg|webp);base64,/.test(preview) || preview.length > 1_600_000)) {
        sendJson(response, 400, { success: false, message: "The design preview is invalid or too large." });
        return true;
      }
      const design = await saveUserDesign(user.id, {
        name: data.name,
        configuration: data.configuration,
        preview,
        notes: data.notes,
      });
      const adminNotificationSent = await notifyAdminOfNewDesign(user, design);
      sendJson(response, 201, { success: true, design, adminNotificationSent });
      return true;
    }

    const designPdfMatch = pathname.match(/^\/api\/designs\/([a-f0-9-]+)\/pdf$/i);
    if (designPdfMatch && request.method === "GET") {
      const user = requireUser(request, response);
      if (!user) return true;
      const design = listUserDesigns(user.id).find((item) => item.id === designPdfMatch[1]);
      if (!design) {
        sendJson(response, 404, { success: false, message: "Design not found." });
        return true;
      }
      sendPdf(response, `${design.reference || "autronx-order"}.pdf`, createOrderPdf(user, design));
      return true;
    }

    const designMatch = pathname.match(/^\/api\/designs\/([a-f0-9-]+)$/i);
    if (designMatch && request.method === "GET") {
      const user = requireUser(request, response);
      if (!user) return true;
      const design = listUserDesigns(user.id).find((item) => item.id === designMatch[1]);
      if (!design) {
        sendJson(response, 404, { success: false, message: "Design not found." });
        return true;
      }
      sendJson(response, 200, { success: true, design });
      return true;
    }

    if (designMatch && request.method === "PUT") {
      const user = requireUser(request, response);
      if (!user) return true;
      const data = await readBody(request);
      if (!data.configuration || typeof data.configuration !== "object" || Array.isArray(data.configuration)) {
        sendJson(response, 400, { success: false, message: "A valid panel configuration is required." });
        return true;
      }
      const preview = String(data.preview || "");
      if (preview && (!/^data:image\/(png|jpeg|webp);base64,/.test(preview) || preview.length > 1_600_000)) {
        sendJson(response, 400, { success: false, message: "The design preview is invalid or too large." });
        return true;
      }
      const design = await updateUserDesign(user.id, designMatch[1], { ...data, preview });
      if (!design) {
        sendJson(response, 404, { success: false, message: "Design not found." });
        return true;
      }
      sendJson(response, 200, { success: true, design });
      return true;
    }

    const duplicateMatch = pathname.match(/^\/api\/designs\/([a-f0-9-]+)\/duplicate$/i);
    if (duplicateMatch && request.method === "POST") {
      const user = requireUser(request, response);
      if (!user) return true;
      const source = listUserDesigns(user.id).find((item) => item.id === duplicateMatch[1]);
      if (!source) {
        sendJson(response, 404, { success: false, message: "Design not found." });
        return true;
      }
      const design = await saveUserDesign(user.id, {
        name: `${source.name} copy`,
        configuration: JSON.parse(JSON.stringify(source.configuration)),
        preview: source.preview,
        notes: source.notes,
      });
      sendJson(response, 201, { success: true, design });
      return true;
    }

    if (designMatch && request.method === "DELETE") {
      const user = requireUser(request, response);
      if (!user) return true;
      const deleted = await deleteUserDesign(user.id, designMatch[1]);
      sendJson(response, deleted ? 200 : 404, {
        success: deleted,
        message: deleted ? "Design deleted." : "Design not found.",
      });
      return true;
    }

    if (pathname === "/api/admin/overview" && request.method === "GET") {
      const user = requireUser(request, response, "admin");
      if (!user) return true;
      sendJson(response, 200, { success: true, ...getAdminOverview() });
      return true;
    }

    if (pathname === "/api/admin/users" && request.method === "POST") {
      const admin = requireUser(request, response, "admin");
      if (!admin) return true;
      const input = validateAuthInput(await readBody(request), true);
      const user = await createManagedUser(input);
      sendJson(response, 201, { success: true, user });
      return true;
    }

    const userStatusMatch = pathname.match(/^\/api\/admin\/users\/([a-f0-9-]+)\/status$/i);
    if (userStatusMatch && request.method === "PATCH") {
      const admin = requireUser(request, response, "admin");
      if (!admin) return true;
      const data = await readBody(request);
      const user = await updateUserStatus(userStatusMatch[1], String(data.status || ""));
      sendJson(response, 200, { success: true, user });
      return true;
    }

    if (pathname === "/api/admin/account" && request.method === "PATCH") {
      const admin = requireUser(request, response, "admin");
      if (!admin) return true;
      const data = await readBody(request);
      const email = String(data.email || "").trim().toLowerCase();
      const currentPassword = String(data.currentPassword || "");
      const newPassword = String(data.newPassword || "");
      if (!isValidEmail(email)) throw Object.assign(new Error("Enter a valid email address."), { statusCode: 400 });
      if (!currentPassword) throw Object.assign(new Error("Enter your current password to confirm this change."), { statusCode: 400 });
      if (newPassword && (newPassword.length < 8 || newPassword.length > 128)) {
        throw Object.assign(new Error("New password must be between 8 and 128 characters."), { statusCode: 400 });
      }
      const user = await updateAdminCredentials(admin.id, { email, currentPassword, newPassword });
      sendJson(response, 200, { success: true, user });
      return true;
    }

    return false;
  } catch (error) {
    const statusCode = error.statusCode || (error instanceof SyntaxError ? 400 : 500);
    console.error("API error:", error.message);
    sendJson(response, statusCode, {
      success: false,
      message: statusCode === 500 ? "Something went wrong. Please try again." : error.message,
    });
    return true;
  }
}

async function readBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > maxBodyBytes) {
      const error = new Error("Request body is too large");
      error.statusCode = 413;
      throw error;
    }
  }

  const contentType = request.headers["content-type"] || "";
  if (contentType.includes("application/json")) {
    return JSON.parse(body || "{}");
  }
  return Object.fromEntries(new URLSearchParams(body));
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function notifyAdminOfNewDesign(user, design) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const notificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!smtpHost || !smtpUser || !smtpPass || !notificationEmail) return false;

  try {
    const transport = nodemailer.createTransport({
      host: smtpHost,
      port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: smtpUser, pass: smtpPass },
    });
    const text = [
      "A customer saved a new AutronX panel design.",
      "",
      `Reference: ${design.reference}`,
      `Design: ${design.name}`,
      `Customer: ${user.name}`,
      `Email: ${user.email}`,
      `Company: ${user.company || "Not supplied"}`,
      `Phone: ${user.phone || "Not supplied"}`,
      ...(design.notes ? ["", "Order note:", design.notes] : []),
    ].join("\n");

    await transport.sendMail({
      from: process.env.MAIL_FROM || smtpUser,
      to: notificationEmail,
      replyTo: user.email,
      subject: `New AutronX panel: ${design.reference}`,
      text,
      attachments: [{
        filename: `${design.reference || "autronx-order"}.pdf`,
        content: createOrderPdf(user, design),
        contentType: "application/pdf",
      }],
    });
    return true;
  } catch (error) {
    console.error("Admin notification error:", error.message);
    return false;
  }
}

async function serveStatic(request, response, pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
  const firstSegment = relativePath.split(/[\\/]/, 1)[0];
  if (blockedTopLevelEntries.has(firstSegment) || firstSegment.startsWith(".")) {
    response.writeHead(404).end("Not found");
    return;
  }

  const filePath = resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(root + sep)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) throw new Error("Not a file");

    const extension = extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=3600",
      "Content-Length": fileStats.size,
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (url.pathname.startsWith("/api/")) {
    const handled = await handleApi(request, response, url.pathname);
    if (!handled) sendJson(response, 404, { success: false, message: "API route not found." });
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  await serveStatic(request, response, url.pathname);
});

await initializeAccountStore();

server.listen(port, host, () => {
  console.log(`AutronX is running at http://${host}:${port}`);
});
