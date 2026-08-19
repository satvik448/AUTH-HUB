# Low-Level Design (LLD) - AuthHub Project
**Author**: 2nd Year Kalvium Student Project Portfolio
**Topic**: Code Structure, Schemas, Endpoints, and Middleware Specifications

---

## 1. Directory Structure

```text
├── authhub-backend/           # Backend (Node/Express Server)
│   ├── controllers/           # Endpoint handlers (calls service layer)
│   │   └── user.controllers.js
│   ├── middlewares/           # Request intercepts (Auth, Rbac)
│   │   ├── Auth.js
│   │   └── Rbac.js
│   ├── models/                # Mongoose Database Models
│   │   └── user.models.js
│   ├── routes/                # Express Route mapping
│   │   └── user.routes.js
│   ├── services/              # Auth, Login, Token generation functions
│   │   └── user.services.js
│   ├── utility/               # Helper modules (Brevo HTTPS mail client)
│   │   └── Email.js
│   └── server.js              # Server entry point
│
└── authhub-frontend/my-app/   # Frontend (React Client)
    ├── src/
    │   ├── pages/             # Auth Pages
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   └── Resetpassword.jsx
    │   ├── App.css            # Custom CSS styles (Dark mode slate theme)
    │   ├── App.jsx            # Routing and paths setup
    │   └── config.js          # API URL target setting
```

---

## 2. Database Models & Schema: Mongoose

File: [user.models.js](file:///c:/Users/kavya/OneDrive/Desktop/Useful/AuthHubFinal/authhub-enterprise-authentication-system/authhub-backend/models/user.models.js)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        lowercase: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});
```

### 2.1 Mongoose Schemas Lifecycle Triggers
1.  **Pre-validate Trigger**: Automatically converts roles to lowercase so that query matching is case-insensitive.
    ```javascript
    UserSchema.pre("validate", function() {
        if (this.role) {
            this.role = this.role.toLowerCase();
        }
    });
    ```
2.  **Pre-save Trigger**: Hashing is performed directly in the model folder using a pre-save hook.
    ```javascript
    UserSchema.pre("save", async function() {
        if (!this.isModified("password")) return;
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    });
    ```

---

## 3. Detailed Route Mappings & Payload Schemas

Base URL: `/api/v1/data`  
File: [user.routes.js](file:///c:/Users/kavya/OneDrive/Desktop/Useful/AuthHubFinal/authhub-enterprise-authentication-system/authhub-backend/routes/user.routes.js)

### 3.1 Sign Up (`POST /signup`)
*   **Request Schema**:
    ```json
    {
      "name": "Alex Mercer",
      "email": "alex@mercer.com",
      "password": "mysecretpassword"
    }
    ```
*   **Validator Constraints**:
    *   `name`: Checks for a minimum length of 5 characters.
    *   `password`: Checks for a minimum length of 6 characters.
    *   `email`: Runs custom query check `User.findOne({email})`. If email already exists, throws `"user already exists"` error.
*   **Response Payload**:
    ```json
    {
      "success": true,
      "user": {
        "_id": "60d5ec42a8b2732a1c8f42a1",
        "name": "Alex Mercer",
        "email": "alex@mercer.com",
        "role": "user"
      }
    }
    ```

### 3.2 Log In (`POST /login`)
*   **Request Schema**:
    ```json
    {
      "email": "alex@mercer.com",
      "password": "mysecretpassword"
    }
    ```
*   **Logic**:
    1.  Fetch user by email. If not found, throw error `"User not found"`.
    2.  Run `bcrypt.compare(password, user.password)`. If match fails, throw error `"Password didn't match"`.
    3.  Generate short-lived `AccessToken` and long-lived `RefreshToken` using JWT sign method.
*   **Response Payload**:
    ```json
    {
      "user": {
        "_id": "60d5ec42a8b2732a1c8f42a1",
        "name": "Alex Mercer",
        "email": "alex@mercer.com",
        "role": "user"
      },
      "AccessToken": "eyJhbGciOi...",
      "RefreshToken": "eyJhbGciOi..."
    }
    ```

### 3.3 Token Re-issuance (`POST /reset`)
*   **Headers**: `Authorization: Bearer <RefreshToken>`
*   **Logic**:
    1.  Parse header to fetch token.
    2.  Verify signature using key `"refsecretkey"`.
    3.  Generate new `newAccToken` (expiry 2 days) and return.
*   **Response Payload**:
    ```json
    {
      "newAccToken": "eyJhbGciOi..."
    }
    ```

### 3.4 Request Password Link (`POST /forget`)
*   **Request Schema**:
    ```json
    {
      "email": "alex@mercer.com"
    }
    ```
*   **Response Payload**:
    ```json
    {
      "message": "Reset link sent successfully"
    }
    ```

---

## 4. Key Middleware Code Logic

### 4.1 Token Security Middleware (`Auth.js`)
File: [Auth.js](file:///c:/Users/kavya/OneDrive/Desktop/Useful/AuthHubFinal/authhub-enterprise-authentication-system/authhub-backend/middlewares/Auth.js)

```javascript
const jwt = require('jsonwebtoken');

const Auth = async (req, resp, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return resp.json({ success: false, message: "token not found" });
            }
            const decoded = jwt.verify(token, process.env.ACC_KEY);
            req.user = decoded; // Sets user details (id, role) in request object
            return next();
        } else {
            return resp.json({ success: false, message: "some issue in your process" });
        }
    } catch (err) {
        return resp.json({ success: false, message: err.message });
    }
}
```

### 4.2 Role check Middleware (`Rbac.js`)
File: [Rbac.js](file:///c:/Users/kavya/OneDrive/Desktop/Useful/AuthHubFinal/authhub-enterprise-authentication-system/authhub-backend/middlewares/Rbac.js)

```javascript
const roleBased = async (req, resp, next) => {
    if (req.user && req.user.role == 'admin') {
        next();
    } else {
        return resp.json({
            success: false,
            message: "you arent authorized to access this page"
        });
    }
}
```
