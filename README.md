# AutronX Panel Builder

AutronX's browser-based smart switch panel configurator, served by a lightweight Node.js runtime.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

For a production-style run:

```bash
npm start
```

## Accounts and saved designs

Customers can create an account, sign in, and save completed panel configurations with a visual preview. Their dedicated workspace is available at `http://127.0.0.1:3000/dashboard.html`. Account data is stored server-side in `data/accounts.json`; that runtime file is ignored by Git and is never exposed by the static server.

Each saved design includes **Download order PDF**, **Edit**, and **Duplicate** actions in the customer workspace. The generated PDF includes the saved panel preview, order reference, saved configuration, and account contact details, and is only available to the signed-in owner of that design.

While signed in, an unfinished panel is automatically saved as a private draft. Returning to the configurator resumes the panel selection, material, module, accessories, finish, frame, and quantity; customers can also resume or discard the draft from their account workspace. Super-admin reporting includes the number of active drafts and each user's draft status.

Customer self-registration creates a pending account. A super-admin can approve or decline the request from the protected admin workspace, or create an already-approved customer account directly. The same workspace provides a current-password-confirmed form for changing the administrator email and password.

The protected super-admin workspace is available at `http://127.0.0.1:3000/super-admin.html`. Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the server environment before deployment. For local development only, the fallback credentials are `admin@autronx.com` / `AutronX@123`.

Passwords are stored as salted scrypt hashes. Sessions use random tokens in HTTP-only, SameSite cookies and expire after seven days.

## Email configuration

Copy `.env.example` to `.env`, load those values in the deployment environment, and provide valid SMTP credentials. The server sends panel specifications through `POST /api/panel-design`. If SMTP is not configured, the builder keeps the design downloadable and reports that email delivery is unavailable.

## Checks

```bash
npm run check
npm audit --omit=dev
```

The original configurator product assets, module geometry, and product dimensions are retained.
