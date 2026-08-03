# PathPilot Version Changelog

All notable changes to the PathPilot platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-03

### Release Summary
Initial stable release of **PathPilot Version 1**, delivering a full-stack career learning and skill development platform.

---

### Added

#### Authentication System
- User registration (`POST /api/auth/register`) supporting student, teacher, parent, and admin roles.
- User login (`POST /api/auth/login`) with secure password verification via `bcrypt`.
- JWT token generation and verification middleware (`authMiddleware`).
- Current user profile endpoint (`GET /api/auth/me`).
- React `AuthContext` provider for managing client-side authentication state and local storage persistence.

#### Landing Page & Public Catalog
- Responsive landing page showcasing platform value propositions and featured career paths.
- Career catalog view (`/careers`) fetching active career tracks.
- Detailed career track view (`/careers/:slug`) with skill tags, overview, and duration.

#### Student Dashboard
- Student overview endpoint (`GET /api/dashboard/overview`) aggregating active career enrollments, total modules, completed count, and overall percentage.
- Real-time visual progress bars and summary cards for active career tracks.

#### Career Roadmap & Module Management
- Career enrollment functionality (`POST /api/enrollments/enroll`).
- Interactive learning module viewer (`/modules/:careerId`) listing topic modules in order.
- Detailed module view (`/modules/:id`) with objective lists and expandable lesson contents.

#### Granular Progress Tracking
- Module completion progress toggle (`PUT /api/progress/module`).
- Real-time UI updating for module completion status (`completed`, `in_progress`, `not_started`).

#### User Profile
- User profile page (`/profile`) displaying registered user details, contact info, and role metadata.

---

### Changed
- Standardized REST API JSON response structures across all controller endpoints.
- Updated database indexes on `ModuleProgress` to enforce unique student-module constraint `{ student: 1, module: 1 }`.
- Upgraded client build setup to Vite 8 with Tailwind CSS v4 styling rules.

---

### Improved

#### Responsive UI & Styling
- Implemented full 8-point grid layout system with custom color tokens in `:root` CSS.
- Enhanced card layout responsiveness across mobile, tablet, and desktop viewports.

#### Professional Navigation
- Added global responsive navigation bar with active route highlighting, brand logo, and authentication context controls.
- Added protected route guard wrappers (`ProtectedRoute.jsx`) preventing unauthenticated access to student dashboard and profile pages.

#### Error Handling & Validation
- Added error response handling for missing form fields, duplicate emails (409 Conflict), and invalid JWT tokens (401 Unauthorized).
- Implemented user-friendly error banners and validation messages on login and registration pages.

#### Loading States
- Added pulse skeleton loading states and spinner animations for async API data fetching across dashboard and module views.

---

### Documentation
- Published repository **README.md** with quickstart guide and API summary.
- Created detailed **docs/PROJECT_OVERVIEW.md** outlining problem statement, solution, objectives, and deliverables.
- Created **docs/ARCHITECTURE.md** featuring sequence diagrams, high-level architecture maps, and scaling notes.
- Created **docs/DATABASE_SCHEMA.md** with ER diagrams and schema data dictionaries.
- Created **docs/API_DOCUMENTATION.md** providing REST API endpoint specifications.
- Created **docs/SETUP_GUIDE.md** with setup procedures and troubleshooting steps.
- Created **docs/UI_GUIDELINES.md** documenting design tokens and component guidelines.
