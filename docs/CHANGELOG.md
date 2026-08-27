# PathPilot Version Changelog

All notable changes to the PathPilot platform are documented in this file.

---

## [2.0.0] - 2026-08-27

### Release Summary
Major architectural upgrade delivering **PathPilot Version 2**, adding phase-based career roadmaps, granular lesson completion, certificate auto-issuance with public verification, OTP password reset, and a comprehensive Admin Management Panel.

---

### Added

#### Granular Progress Engine
- Implemented lesson completion endpoint `POST /api/progress/lesson`.
- Embedded lesson subdocuments (`Module.lessons`) with unique Mongoose-generated `_id` values.
- Dynamic recalculation of module percentage (`0%` to `100%`) based on valid completed lesson counts.
- Idempotent lesson progress recording ensuring no duplicate completed entries.

#### Phase-Based Curriculum & Unlock System
- Added `Phase` and `CurriculumRequirement` models.
- Backend-driven module unlock state calculator (`GET /api/progress/curriculum`).
- Prerequisite module unlocking rules enforcing completion of dependent modules.

#### Certificate System & Public Verification
- Automatic certificate issuance check upon achieving 100% career track completion.
- Crypto-random immutable Certificate ID generation (`PP-CERT-2026-XXXX`).
- Public verification endpoint (`GET /api/certificates/verify/:certificateId`) and public view page (`/verify-certificate/:certificateId`).

#### Admin Management Panel (`/admin/*`)
- Admin Analytics Dashboard (`GET /api/admin/dashboard`) tracking system metrics.
- User management interface (`/admin/users`) supporting search, status toggle, role reassignment, and safe account deletion.
- Full CRUD suites for Careers (`/admin/careers`), Phases (`/admin/phases`), Modules & Lessons authoring (`/admin/modules`), and Curriculum Requirements (`/admin/requirements`).
- Dependency-safe deletion enforcement preventing removal of modules with active progress records or prerequisite dependencies.

#### Security & Authentication
- OTP Password Reset system (`POST /api/auth/forgot-password` & `POST /api/auth/reset-password`) using bcrypt-hashed short-lived OTP records.
- Role-based authorization middleware (`authorizeRoles("admin")`) protecting backend administrative routes.

#### Seeding & Database Maintenance
- Added `server/scripts/backfillModuleLessons.js` for populating standard lessons across database modules.
- Added `server/scripts/backfillCareerPhases.js` and `server/scripts/migrateModuleIndex.js`.

---

## [1.0.0] - 2026-08-03

### Release Summary
Initial stable release of **PathPilot Version 1**, delivering core full-stack career track listing, user registration/login, and basic module view.
