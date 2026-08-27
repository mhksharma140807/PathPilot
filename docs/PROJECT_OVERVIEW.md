# PathPilot V2 Project Overview

## 1. Problem Statement & Executive Summary

In today's technology ecosystem, self-taught developers and early-career candidates face **choice paralysis** caused by unstructured tutorials, fragmented learning materials, and lack of clear prerequisite sequencing. Candidates frequently complete isolated coding exercises without understanding how topic areas connect into a production-grade career pathway.

**PathPilot V2** is a career learning and skill development platform built with the MERN stack (MongoDB, Express, React, Node.js). It provides curated career tracks (e.g. Full Stack Developer, Data Analyst, AI Engineer, UI/UX Designer, Android Developer, Cloud Engineer), organizes curricula into sequential phases, embeds lesson-level study materials, dynamically recalculates student progress, enforces prerequisite module unlocking, and generates verifiable digital career certificates upon 100% completion.

---

## 2. Target Audience

1. **Students & Early-Career Developers**: Seeking structured, milestone-driven learning paths to become job-ready in specific industry domains.
2. **Platform Administrators**: Content managers who author and sequence career tracks, phases, modules, embedded lessons, and curriculum requirement rules.
3. **Employers & Evaluators**: Public third parties verifying candidate completion certificates via the public verification portal.

---

## 3. Implemented Features (V2 Production State)

### Student Workflow
- **Public Career Catalog**: Browse career paths with skill tags, overview, and estimated duration.
- **Career Enrollment**: Enroll in active career paths (`POST /api/enrollments/enroll`).
- **Phase-Based Career Roadmap**: Navigate sequential phases and view prerequisite module unlocking status.
- **Lesson Content & Resource Viewer**: Read detailed lesson content, key takeaways, and access attached study resources (PDFs, docs, web links, starter code, and video tutorials).
- **Granular Progress Engine**: Click **"Mark Progress"** on individual lessons to record completion (`POST /api/progress/lesson`) and trigger real-time module percentage updates (0-100%).
- **Student Overview Dashboard**: View active track status, completed module summary, and overall progress percentage.
- **Verifiable Career Certificates**: Claim auto-generated career certificates upon 100% curriculum completion (`PP-CERT-2026-XXXX`).
- **Public Certificate Verification**: Employers can verify authenticity at `/verify-certificate/:certificateId`.
- **OTP Password Reset**: Reset password securely via 6-digit email OTP.

### Admin Workflow (`/admin/*`)
- **Admin Platform Analytics Dashboard**: Real-time stats on total users, active careers, total modules, progress records, and issued certificates.
- **User Account & Role Management**: Search users, toggle active status, reassign user roles (`student`, `admin`, `teacher`, `parent`), and safely delete accounts.
- **Career & Phase Management**: Complete CRUD operations for career tracks and phase structures.
- **Module & Lesson Authoring**: Author modules, sequence orders, attach learning objectives, write lesson content, key takeaways, and embed resources.
- **Curriculum Requirement Management**: Define required, optional, and choice-group completion rules per phase.

---

## 4. Feature Implementation Matrix

| Feature Area | Status | Notes |
| :--- | :---: | :--- |
| Student Catalog & Enrollment | **FULLY IMPLEMENTED** | Public exploration, track enrollment, active track switching |
| Phase Roadmap & Module Viewer | **FULLY IMPLEMENTED** | Phase milestones, module list, prerequisite unlocking |
| Lesson Content & Resources | **FULLY IMPLEMENTED** | Embedded lessons, key takeaways, resource badges |
| Granular Lesson Completion | **FULLY IMPLEMENTED** | `POST /api/progress/lesson` recalculates module & career % |
| Certificate System & Public Verification | **FULLY IMPLEMENTED** | Auto-issuance on 100% completion, unique ID, public verification |
| OTP Password Reset | **FULLY IMPLEMENTED** | 6-digit email OTP, bcrypt-hashed storage, 10-min TTL |
| Admin Panel & Management Tools | **FULLY IMPLEMENTED** | Admin dashboard, user management, career/phase/module CRUD |
| Teacher Portal | **SCAFFOLD ONLY** | Role enum `"teacher"` exists; UI routes/controllers not built |
| Parent Portal | **SCAFFOLD ONLY** | Role enum `"parent"` exists; UI routes/controllers not built |
