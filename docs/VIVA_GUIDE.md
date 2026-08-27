# PathPilot V2 — Internship Viva & Defense Guide

> Comprehensive technical preparation and revision guide for PathPilot V2 internship presentation and oral viva examination.

---

## 1. 30-Second Elevator Pitch

"PathPilot V2 is a full-stack MERN career learning platform designed to solve choice paralysis for job seekers. It organizes career tracks into sequential phases, topic modules, embedded lessons, and curated reference materials. Students track granular lesson progress in real time, unlock modules dynamically based on prerequisite rules, and earn cryptographically unique, publicly verifiable career completion certificates. It also includes an OTP password reset system and a comprehensive Admin Panel for complete curriculum authoring and user role management."

---

## 2. Problem Statement & Solution

* **Problem**: Unstructured online learning resources cause decision fatigue, lack prerequisite structure, offer binary progress indicators, and fail to provide verifiable credentials.
* **Solution**: PathPilot structures learning into sequential phase roadmaps, embedded subdocument lessons, real-time percentage progress recalculation, backend-enforced prerequisite unlocking, auto-issued certificates, and public credential verification.

---

## 3. Technology Stack & Justification

| Technology | Role | Technical Justification |
| :--- | :--- | :--- |
| **React 19** | Frontend SPA | Declarative UI, dynamic state updates, component reusability, and seamless routing. |
| **Vite 8** | Build Tool | Instant Server Start (HMR) and lightning-fast ES module bundling compared to legacy CRA. |
| **Tailwind CSS v4** | Styling | Utility-first styling engine with zero runtime overhead and dynamic color token support. |
| **Node.js + Express 5** | Backend API | Event-driven non-blocking I/O ideal for scalable JSON REST APIs with Express 5 middleware capabilities. |
| **MongoDB Atlas** | Database | Flexible JSON-like document store supporting embedded subdocuments (`lessons`) and schema indexing. |
| **Mongoose v8** | ODM | Schema validation, type enforcement, middleware hooks, and automatic subdocument ObjectId generation. |
| **JWT (`jsonwebtoken`)** | Auth | Stateless, bearer-token authorization that avoids server-side session memory storage. |
| **`bcrypt`** | Security | One-way password and OTP hashing with adaptive cost factor (10 salt rounds) against brute force attacks. |
| **Nodemailer** | Email Service | Asynchronous SMTP email dispatch for 6-digit password reset OTP delivery. |

---

## 4. Key Architectural Explanations

### Why Embed Lessons Inside `Module` Schema?
Lessons are co-located within the `Module` schema as embedded subdocuments (`lessons: [...]`). This guarantees single-query performance (`Module.findById(id)`) without needing SQL JOINs or expensive Mongoose `.populate()` calls when loading lesson content. Mongoose automatically generates a unique `_id` (`ObjectId`) for each embedded lesson subdocument.

### Why Maintain `ModuleProgress` as a Separate Collection?
Storing student progress in a dedicated collection (`student`, `module`, `career`, `progressPercentage`, `completedLessons`) prevents `User` documents from growing unboundedly as students complete hundreds of lessons. It enables clean composite indexing (`{ student: 1, module: 1 }`) and fast analytics aggregations.

### How Progress is Recalculated
1. Student clicks **"Mark Progress"** on a lesson.
2. Client issues `POST /api/progress/lesson { moduleId, lessonId }`.
3. Backend validates authentication token and active career enrollment.
4. Backend verifies `lessonId` exists in `targetModule.lessons` subdocuments.
5. Backend adds `{ lessonId, completedAt }` to `ModuleProgress.completedLessons` array.
6. Backend computes: `validCompletedCount` / `totalLessons` * 100 -> `progressPercentage` (0–100%).
7. Updates status (`not_started`, `in_progress`, `completed`) and triggers certificate auto-check.

### Prerequisite & Module Unlock Logic
- **Module Unlock**: A module is unlocked (`isUnlocked: true`) if its parent phase is unlocked AND every module ID in its `prerequisites` array has an associated `ModuleProgress` record with `progressPercentage >= 100` or `status === "completed"`.
- **Phase Unlock**: A phase is unlocked if it has no `prerequisitePhases` OR all prerequisite phases meet their `CurriculumRequirement` rules.

### Certificate Generation & Public Verification
1. Upon reaching 100% overall progress across active modules in a career track, `issueOrClaimCertificate` generates an immutable `certificateId` (`PP-CERT-2026-XXXX`) using cryptographic random bytes.
2. Employer or evaluator visits `/verify-certificate/PP-CERT-2026-XXXX`.
3. Client issues `GET /api/certificates/verify/PP-CERT-2026-XXXX` (Public Endpoint).
4. Server queries database and returns verification status `VALID`, student name, career track title, and issue date.

---

## 5. Major Technical Challenge & Solution (Case Study)

### The Disabled "Mark Progress" Button Issue
* **Problem**: The "Mark Progress" button on the student lesson page was permanently disabled and unclickable.
* **Root Cause**: Database modules had empty `lessons: []` arrays. `ModuleDetails.jsx` fell back to `getDefaultLessons()`, which created fallback objects lacking `_id` fields. The button condition `disabled={updating || isCurrentLessonDone || !currentLesson?._id}` evaluated `!currentLesson?._id` as `true`.
* **Fix**:
  1. Updated `careerSeed.js` to embed standard lessons for seeded modules.
  2. Created idempotent script `server/scripts/backfillModuleLessons.js` to populate standard lessons with Mongoose-assigned subdocument `_id` ObjectIds across all database modules.
  3. Updated `ModuleDetails.jsx` to safely resolve lesson IDs (`currentLesson?._id || currentLesson?.id`) and check `!currentLessonIdStr` for enablement.
  4. Verified lesson completion endpoint `POST /api/progress/lesson` returns HTTP 200 OK and recalculates progress percentage cleanly.

---

## 6. Frequently Asked Viva Questions & Answers

### Q1: Why did you choose MongoDB over a SQL database?
**Answer**: MongoDB's document model naturally matches JSON objects in JavaScript. It allows embedding lessons and resources directly inside modules as subdocuments, avoiding complex JOIN queries while preserving schema flexibility for evolving educational content.

### Q2: How do you handle Authentication and Authorization?
**Answer**: Authentication is handled via JWT bearer tokens. Upon login, the server issues a signed JWT token containing the user's ID and role (`student` or `admin`). The client stores the token in `localStorage` and appends it to the `Authorization` header. Backend middleware (`authenticateUser`) verifies token validity, while `authorizeRoles("admin")` restricts administrative routes.

### Q3: Why is the OTP stored as a bcrypt hash instead of plain text?
**Answer**: Storing raw OTPs in plain text exposes user accounts to database leak compromises. By hashing the OTP with `bcrypt` before database insertion, an attacker inspecting the database cannot read or misuse active verification codes.

### Q4: How is certificate forgery prevented?
**Answer**: Certificates contain cryptographically generated immutable identifiers (`PP-CERT-2026-XXXX`). Certificates cannot be created arbitrarily on the frontend; they are issued by the backend only after verifying 100% completion across all required modules. Public verification hits a public backend endpoint (`GET /api/certificates/verify/:certificateId`) that validates authenticity directly against MongoDB records.

### Q5: What happens if a user submits an invalid JWT or an expired token?
**Answer**: Express `authenticateUser` middleware catches `jwt.JsonWebTokenError` and `jwt.TokenExpiredError`, returning HTTP `401 Unauthorized` with `{ success: false, message: "Invalid or expired token." }`. The client Axios interceptor catches 401 responses, clears local storage, and redirects the user to `/login`.

### Q6: How do Admin deletion operations protect student data?
**Answer**: Admin controllers (`adminCareerController.js`, `adminModuleController.js`, `adminUserController.js`) query database dependencies (student progress records, active enrollments, and prerequisite references) before executing deletions. If active dependencies exist, the deletion is rejected with HTTP `409 Conflict`, prompting the admin to deactivate the entity instead.

### Q7: Why Vercel for Frontend and Render for Backend?
**Answer**: Vercel provides optimized global CDN edge hosting for static single-page React applications with instant preview deployments. Render provides dedicated containerized hosting for long-running Node.js/Express web services with environment variable management.

### Q8: What features would you implement in PathPilot V3?
**Answer**: In V3, I would implement machine learning career path recommendations, adaptive end-of-module quizzes, full dedicated portals for the scaffolded `teacher` and `parent` roles, and real-time WebSocket notifications.
