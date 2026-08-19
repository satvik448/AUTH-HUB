# AuthHub 🔐

AuthHub is an Enterprise Authentication System built using the **MERN (MongoDB, Express, React, Node.js) Stack**. It features a modern, clean, premium minimalist dark-mode UI with dynamic interactive layouts, robust backend controllers, secure password hashing, and token-based sessions.

---

## 🚀 Key Features

*   **Secure Authentication**: JWT-based authentication using dynamic access and refresh tokens.
*   **Password Security**: Industry-standard password hashing using `bcrypt` pre-save hooks.
*   **Password Recovery**: Email reset links powered by the **Brevo Transactional Email API** (HTTPS-based, no SMTP ports required) and custom cryptographically secure tokens.
*   **Premium Visual Design**: Cyber-obsidian dark theme built with `Plus Jakarta Sans` typography, high-precision glassmorphism elements, and glowing interactive hover effects.
*   **Consistent API Layer**: Implemented standardized `ApiResponse` contracts for clean, predictable integration between the React frontend and Express controllers.
*   **Modular Architecture**: Clean separation of routes, models, controllers, and services on the backend.

---

## 🛠️ Project Structure

```text
├── authhub-backend/           # Express Server & DB Connection
│   ├── controllers/           # Route logic (Login, Signup, Recovery)
│   ├── models/                # MongoDB user schemas and middleware
│   ├── routes/                # Endpoint routing path definitions
│   ├── services/              # Business logic & authentication algorithms
│   ├── utility/               # Helper modules (Brevo email sender)
│   └── server.js              # Server entry point
│
├── authhub-frontend/my-app/   # Vite + React Frontend Client
│   ├── src/
│   │   ├── pages/             # Auth pages (Login, Signup, Recover)
│   │   ├── App.jsx            # Routing and application entry
│   │   ├── App.css            # Premium layout and styling styles
│   │   └── config.js          # API environment configurations
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://...           # MongoDB database connection string
PORT=3000                             # Express server port
ACC_KEY=...                          # JWT access token secret key
SEC_KEY=...                          # JWT refresh token secret key
MAIL=...                              # Verified Brevo sender email address
BREVO_API_KEY=...                     # Brevo transactional email API key
FRONTEND_URL=...                      # Frontend origin used to build reset links (e.g. http://localhost:5173)
```

> **Note:** Password reset emails are sent via the [Brevo](https://www.brevo.com/) HTTP API rather than raw SMTP. This is intentional — Render's free tier blocks outbound SMTP ports (25/465/587), so `nodemailer`-style SMTP sending times out in production even though it works locally. Brevo sends over plain HTTPS, so it works on any host.
>
> To set this up:
> 1. Create a free account at [brevo.com](https://www.brevo.com/).
> 2. Verify a single sender email (use the same address as `MAIL`) under **Senders, Domains & Dedicated IPs**.
> 3. Generate an API key under your profile → **SMTP & API** → **API Keys**, and set it as `BREVO_API_KEY`.

---

## 💻 Local Setup & Execution

### 1. Clone & Set Up Environment
Configure the `.env` variables at the root of the project.

### 2. Run the Backend Server
```bash
cd authhub-backend
npm install
npm run dev
```
The backend server runs on `http://localhost:3000`.

### 3. Run the Frontend Client
```bash
cd authhub-frontend/my-app
npm install
npm run dev
```
The frontend client launches on `http://localhost:5173`.

---

## 🌐 Production Deployment

*   **Frontend**: Deployed on **Vercel** with the `VITE_API_URL` environment variable pointing at the live backend.
*   **Backend**: Deployed as a Web Service on **Render**. All environment variables (`MONGO_URI`, `ACC_KEY`, `SEC_KEY`, `MAIL`, `BREVO_API_KEY`, `FRONTEND_URL`) must be configured directly in the Render dashboard under **Environment** — `.env` files are gitignored and are not deployed automatically.

> ⚠️ Do **not** use `nodemailer`/SMTP for email on Render's free tier — outbound SMTP ports are blocked, which causes password-reset emails to fail with a connection timeout. Use the Brevo API integration described above instead.
