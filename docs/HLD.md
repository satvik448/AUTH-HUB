# High-Level Design (HLD) - AuthHub Project
**Author**: 2nd Year Kalvium Student Project Portfolio
**Topic**: High-Level System Architecture and Design Flows

---

## 1. Overall System Architecture
AuthHub uses a decoupled MERN stack architecture. The frontend React client is deployed on Vercel, and the backend Express server runs on Render, connecting to MongoDB Atlas.

Here is how the components interact:

```mermaid
graph TD
    subgraph Frontend [React SPA Client - Vercel]
        UI["React Pages (Signup, Login, etc.)"]
        State["State / Token Storage"]
        UI <--> State
    end

    subgraph Backend [Node.js + Express API - Render]
        Routes["Routes (/api/v1/data)"]
        Middleware["Auth & RBAC Middleware"]
        Controller["User Controller"]
        Service["User Service"]
        
        Routes --> Middleware
        Middleware --> Controller
        Controller --> Service
    end

    subgraph DB & External Services
        Atlas[("MongoDB Atlas Database")]
        Brevo["Brevo Email REST API"]
    end

    UI <-->|HTTP Requests / JSON Data| Routes
    Service <-->|Mongoose queries| Atlas
    Service -->|HTTPS POST| Brevo
```

---

## 2. Component Design & Roles

### 2.1 React Frontend SPA
*   **Built using**: Vite + React, React Router.
*   **Role**: Displays the pages, validates input forms (e.g. checking formatting before calling the backend), manages token status, and guides the user.

### 2.2 Express Backend Router & Controllers
*   **Built using**: Node.js, Express, `express-validator`.
*   **Role**: Exposes endpoints, coordinates business logic between routing rules and schemas, and handles response mapping.

### 2.3 User Service Layer
*   **Built using**: Node.js modules.
*   **Role**: Contains the actual algorithmic steps (e.g. verifying password hashes via `bcrypt.compare`, calling JWT signing libraries, and wrapping the email API helper).

### 2.4 Database (MongoDB Atlas)
*   **Built using**: MongoDB + Mongoose.
*   **Role**: Houses user collections, executes pre-save database triggers, and checks schemas.

---

## 3. Data Flow Sequences

### 3.1 Session Token Exchange (Login Flow)
This diagram shows how JWT credentials flow from the client to the server:

```mermaid
sequenceDiagram
    autonumber
    actor User as React Client (Frontend)
    participant Route as Backend Route
    participant Svc as User Service
    participant DB as MongoDB

    User->>Route: POST /login { email, password }
    Route->>Svc: Login(email, password)
    Svc->>DB: Find user by email
    DB-->>Svc: Return user record (contains hashed password)
    Svc->>Svc: Compare password with bcrypt.compare()
    alt Password is correct
        Svc->>Svc: Sign Access Token (short life)
        Svc->>Svc: Sign Refresh Token (long life)
        Svc-->>Route: Return User & Tokens
        Route-->>User: JSON Response with Access & Refresh Tokens
    else Password matches failed
        Svc-->>Route: Return error
        Route-->>User: JSON Response { success: false, message: "Password didn't match" }
    end
```

### 3.2 Security-Backed Password Recovery (Forgot/Reset Flow)
This diagram shows how the password reset token is saved and validated:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant API as Express Router
    participant Svc as User Service
    participant DB as MongoDB
    participant Brevo as Brevo Email API

    User->>API: POST /forget { email }
    API->>Svc: Forgot(email, origin)
    Svc->>DB: Find user by email
    DB-->>Svc: User found
    Svc->>Svc: Generate raw random token (crypto.randomBytes)
    Svc->>Svc: Hash raw token using SHA-256
    Svc->>DB: Save hashed token & expiry time (1 hour)
    Svc->>Brevo: Send POST request with reset link containing RAW token
    Brevo-->>User: Send reset link email
    Note over User, Brevo: User clicks link and opens reset page
    User->>API: POST /reset/{rawToken} { newPassword }
    API->>Svc: Reset(req)
    Svc->>Svc: Hash rawToken using SHA-256
    Svc->>DB: Find user with matching hashed token & resetPasswordExpire > now
    DB-->>Svc: User found
    Svc->>DB: Update password = newPassword, clear token fields
    DB-->>Svc: Save User (runs bcrypt pre-save hash)
    Svc-->>API: Password updated
    API-->>User: HTTP 200 { success: true, message: "Password reset successfully" }
```
