# PathPilot V2 System Architecture

## 1. High-Level Architecture Topology

```mermaid
flowchart TD
    UserClient[Browser Client]
    VercelHost["Vercel SPA Hosting (React 19 + Vite 8)"]
    RenderHost["Render Backend Hosting (Node.js + Express 5)"]
    AtlasDB[(MongoDB Atlas Cloud Database)]
    SMTP[Nodemailer / SMTP Server]

    UserClient -- "HTTPS Single Page App" --> VercelHost
    UserClient -- "REST API JSON / JWT Authorization Header" --> RenderHost
    RenderHost -- "Mongoose v8 ODM Connections" --> AtlasDB
    RenderHost -- "SMTP Dispatch (OTP Emails)" --> SMTP
```

PathPilot V2 follows a decoupled Client-Server architecture:
* **Frontend**: Single Page Application (SPA) built with React 19, Vite 8, and Tailwind CSS v4, hosted on Vercel.
* **Backend**: Stateless RESTful API built with Express.js 5 and Node.js, hosted on Render.
* **Database**: Managed cloud document store using MongoDB Atlas accessed via Mongoose ODM v8.

---

## 2. Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    participant Student as Student Browser
    participant Client as AuthContext / Axios
    participant API as Express Auth Controller
    participant DB as MongoDB (User / Otp)
    participant SMTP as Nodemailer SMTP

    alt Registration & Login
        Student->>Client: Submit Login Credentials
        Client->>API: POST /api/auth/login { email, password }
        API->>DB: User.findOne({ email })
        DB-->>API: User Document with bcrypt hash
        API->>API: bcrypt.compare(password, hash)
        API->>API: jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' })
        API-->>Client: HTTP 200 OK { token, user }
        Client->>Client: Store token in localStorage
    else OTP Password Reset
        Student->>Client: Submit Forgot Password Form
        Client->>API: POST /api/auth/forgot-password { email }
        API->>DB: Otp.create({ email, otpHash, expiresAt })
        API->>SMTP: sendOtpEmail(email, otp)
        API-->>Client: HTTP 200 OK
        Student->>Client: Submit Reset Form with OTP
        Client->>API: POST /api/auth/reset-password { email, otp, newPassword }
        API->>DB: Otp.findOne({ email, isUsed: false })
        API->>API: bcrypt.compare(otp, otpHash)
        API->>DB: User.updateOne({ password: newHashedPassword })
        API-->>Client: HTTP 200 OK
    end
```

---

## 3. Lesson Progress & Curriculum Unlock Flow

```mermaid
sequenceDiagram
    autonumber
    participant Student as Student UI (ModuleDetails.jsx)
    participant Service as progressService.js
    participant Middleware as authenticateUser Middleware
    participant Controller as progressController.js
    participant DB as MongoDB Atlas

    Student->>Service: Click "Mark Progress"
    Service->>Middleware: POST /api/progress/lesson { moduleId, lessonId } + Bearer Token
    Middleware->>Middleware: jwt.verify(token, JWT_SECRET)
    Middleware->>Controller: req.user = decoded
    Controller->>DB: Module.findById(moduleId)
    DB-->>Controller: Module Document (with embedded lessons)
    Controller->>Controller: Verify lessonId exists in module.lessons subdocuments
    Controller->>DB: ModuleProgress.findOneAndUpdate(student, module)
    Controller->>Controller: Recalculate module progressPercentage & status
    Controller->>DB: ModuleProgress.save()
    Controller->>Controller: Post-completion certificate auto-check
    Controller-->>Service: HTTP 200 OK { message, progress }
    Service-->>Student: Update UI progress bar, checkmark, & advance to next lesson
```

---

## 4. Certificate Generation & Verification Flow

```mermaid
sequenceDiagram
    autonumber
    participant Student as Student / Public User
    participant Frontend as React App
    participant Controller as certificateController.js
    participant DB as MongoDB Atlas

    alt Claim Certificate
        Student->>Frontend: Click "Claim Certificate"
        Frontend->>Controller: POST /api/certificates/claim
        Controller->>DB: Check overall progress across all modules == 100%
        Controller->>DB: Certificate.findOne({ student, career })
        alt Not Issued Yet
            Controller->>Controller: Generate crypto certificateId (PP-CERT-2026-XXXX)
            Controller->>DB: Certificate.create(...)
        end
        Controller-->>Frontend: HTTP 200/201 OK { certificate }
    else Public Verification
        Public User->>Frontend: Visit /verify-certificate/PP-CERT-2026-XXXX
        Frontend->>Controller: GET /api/certificates/verify/PP-CERT-2026-XXXX (Public)
        Controller->>DB: Certificate.findOne({ certificateId })
        DB-->>Controller: Certificate + Student Name + Career Title
        Controller-->>Frontend: HTTP 200 OK { verified: true, certificate }
        Frontend-->>Public User: Display Verification Badge & Credential Details
    end
```

---

## 5. Admin Management Architecture

```mermaid
flowchart LR
    AdminUI[Admin Panel UI /admin/*]
    AdminGuard[AdminRoute Guard]
    AdminService[adminService.js]
    AuthMW[authenticateUser Middleware]
    RoleMW[authorizeRoles 'admin']
    AdminControllers[Admin Controllers]
    MongoDB[(MongoDB Atlas)]

    AdminUI --> AdminGuard
    AdminGuard --> AdminService
    AdminService -- "Axios /api/admin/*" --> AuthMW
    AuthMW --> RoleMW
    RoleMW --> AdminControllers
    AdminControllers -- "CRUD & Dependency Checks" --> MongoDB
```

---

## 6. Architectural Design Decisions

1. **Embedded Subdocuments for Lessons**: Lessons are embedded subdocuments inside `Module` schemas rather than separate collections. This guarantees single-query loading performance when fetching a module and co-locates content with the module entity.
2. **Relational References for Progress & Enrollments**: `ModuleProgress`, `CareerEnrollment`, and `Certificate` exist as separate top-level collections referencing `User` and `Module`/`Career` IDs. This prevents document size unbounded growth in `User` documents and ensures clean indexing.
3. **Stateless JWT Authorization**: API servers do not maintain session state in memory. All user role and identity claims are encoded inside signed JWT tokens, facilitating horizontal server scaling.
