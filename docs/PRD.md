# Product Requirement Document (PRD) - AuthHub Project
**Author**: 2nd Year Kalvium Student Project Portfolio
**Tech Stack**: MongoDB, Express, React, Node (MERN)

---

## 1. Project Overview & Objective
AuthHub is my personal project to build a secure, full-stack authentication system. The goal was to build a secure login and registration flow that has a modern dark-mode user interface. 

Instead of just doing a basic form validation, I built:
*   Standard signup and login endpoints.
*   Token session management (using short-lived Access tokens and long-lived Refresh tokens).
*   A secure password recovery email flow (by using the Brevo HTTP API rather than raw SMTP).
*   A clean glassmorphism dark-theme dashboard design that looks extremely modern.

---

## 2. Target Audience & Practical Use Case
Any developer building a web application needs user accounts. AuthHub is designed to be a template or reusable auth service that can be plugged into a portfolio website, an e-commerce project, or a blog.

---

## 3. Key Project Features (Functional Requirements)

### 3.1 Secure Sign Up (Registration)
*   **What it does**: Users can create an account using their name, email, and password.
*   **Rules (Validation)**:
    *   Name must be at least 5 characters long.
    *   Password must be at least 6 characters long.
    *   The email address must not already be in the database (unique validation).
*   **How it works**: The user's input is validated on the backend. If validation passes, the password is encrypted and stored in MongoDB.

### 3.2 Secure Login (Authentication)
*   **What it does**: Users enter their email and password to log into their dashboard.
*   **How it works**: The server compares the password using `bcrypt` and sends back a short-lived Access Token and a long-lived Refresh Token.

### 3.3 Token Refresh (Demonstrating Session Management)
*   **What it does**: Allows the user to stay logged in without typing their credentials repeatedly.
*   **How it works**: The frontend sends the Refresh Token to the backend to get a new Access Token automatically.

### 3.4 Password Reset Flow (Forgot/Reset Password)
*   **What it does**: Users who forgot their password can request a recovery link via email.
*   **How it works**:
    1.  User enters email.
    2.  Server creates a secure random token and saves its SHA-256 hash in MongoDB with an expiry date.
    3.  Server sends a recovery link (`/reset-password/<token>`) to the user's email.
    4.  User opens the link and submits a new password, updating the DB.

### 3.5 Role Management (Internal RBAC)
*   **What it does**: Sets user permissions based on their role (`user` vs `admin`).
*   **How it works**: Users default to the `user` role, but can be escalated to `admin` to access restricted resources.

---

## 4. Key Decisions & Workarounds (Lessons Learned)

### 🚨 Why I used the Brevo HTTPS API instead of Nodemailer SMTP:
During local testing, standard SMTP modules (like `nodemailer` with Gmail or Mailtrap) work perfectly. However, when I deployed the backend to **Render's Free Tier**, all password reset emails failed.
*   **The Issue**: Render blocks outbound SMTP ports (like 25, 465, and 587) to prevent spam.
*   **My Solution**: I migrated the email system to use the **Brevo API** via standard HTTPS POST calls (port 443). Since it's a web API, the request is never blocked by cloud hosts.

---

## 5. Non-Functional Goals (What makes the app reliable)
*   **Password Security**: Passwords are never saved in plain text. Even the database administrator cannot read them.
*   **API Structure**: The frontend and backend communicate using a clean, standardized JSON response contract (e.g. always returning a `success` boolean and a `message`).
*   **UX Styling**: Using custom dark slate colors and `backdrop-filter: blur` to design a polished visual layout.
