# PathPilot: Detailed Project Overview

> **Career Learning & Skill Development Ecosystem**

---

## 1. Problem Statement

In today's digital economy, self-directed learners and students face significant hurdles when navigating career transitions and skill development:

- **Information Overload & Fragmented Resources**: Learning content is scattered across hundreds of platforms without clear progression paths.
- **Lack of Structured Roadmap**: Learners struggle to identify which skills are essential versus optional for specific tech roles.
- **Difficulty Tracking Progress**: Without unified dashboards, tracking module completions across diverse career topics becomes tedious and discouraging.
- **Unclear Career Outcomes**: Traditional courses often fail to map individual learning modules directly to target industry roles.

---

## 2. Solution

**PathPilot** addresses these challenges by offering a structured, end-to-end career learning ecosystem:

- **Curated Career Paths**: Dedicated roadmaps for roles like Frontend Developer, Backend Developer, and Data Scientist.
- **Step-by-Step Learning Modules**: Modularized curriculum focusing on key skill clusters with completion metrics.
- **Interactive Enrollment & Progress Tracking**: One-click enrollment with stateful progress toggles to measure completion in real time.
- **Unified Student Dashboard**: A centralized portal displaying active enrollments, completed modules, learning velocity, and quick actions.

---

## 3. Objectives

- Provide intuitive, step-by-step career path exploration for tech disciplines.
- Bridge abstract career goals with actionable, modular learning objectives.
- Empower students to track their personal learning progress with instant UI feedback.
- Deliver a resilient, modern full-stack web application built on Node.js, Express, MongoDB, and React.

---

## 4. Target Users

| Target Audience | Primary Use Case | Key Value Proposition |
| :--- | :--- | :--- |
| **Computer Science & IT Students** | Supplementing academic curriculum with industry-aligned skill roadmaps. | Clear view of market-relevant skill requirements. |
| **Self-Taught Developers** | Structuring independent learning without buying redundant courses. | Step-by-step module breakdown and progress visualization. |
| **Career Switchers** | Moving into tech roles from non-traditional backgrounds. | Transparent difficulty indicators and structured progression. |

---

## 5. Student Journey

The standard workflow for a student using PathPilot consists of five core stages:

```text
[ 1. Discovery ]       --->  [ 2. Authentication ] --->  [ 3. Path Selection ]
Explore available            Register account &          Enroll in targeted
career tracks & skills.      receive secure JWT token.   career track.
                                                                  |
                                                                  v
[ 5. Dashboard Insights ] <-- [ 4. Active Learning ] <------------+
Monitor overall progress &    Complete modules & mark
completion analytics.        progress status.
```

1. **Discovery**: User explores public career tracks and reviews module outlines.
2. **Authentication**: User creates an account or logs into PathPilot.
3. **Path Selection**: Student selects and enrolls in one or more desired career paths.
4. **Active Learning**: Student progresses through topic modules, toggling completion checkboxes as topics are mastered.
5. **Dashboard Insights**: Student views real-time progress percentages and completion metrics on their personalized dashboard.

---

## 6. Main Features

- **User Authentication**: Secure user registration and login with encrypted passwords (`bcrypt`) and JWT authentication tokens.
- **Career Catalog**: Explore curated career pathways complete with description, difficulty tier, and module breakdowns.
- **Module Reader & Progress Toggler**: Interactive view for viewing learning materials and toggling completion states.
- **Enrollment Center**: Manage active career tracks and track historical enrollments.
- **Analytics Dashboard**: Aggregated summary statistics showing total enrollments, completed modules, overall progress percentages, and recent activity.

---

## 7. Career Learning Workflow

```text
+-----------------------------------------------------------------------+
|                           PathPilot Platform                          |
+-----------------------------------------------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
  +------------------+                            +------------------+
  |  Career Pathway  |                            |  User Dashboard  |
  +------------------+                            +------------------+
            |                                               |
            | (Contains N Modules)                          | (Aggregates)
            v                                               v
  +------------------+                            +------------------+
  | Learning Module  | -- (User Marks Complete) -> | Progress Metrics |
  +------------------+                            +------------------+
```

---

## 8. System Modules

PathPilot Version 1 consists of six integrated sub-systems:

### 1. Authentication Module
- User registration (`POST /api/auth/register`)
- User login (`POST /api/auth/login`)
- Profile retrieval (`GET /api/auth/me`)

### 2. Career Exploration Module
- Career listing (`GET /api/careers`)
- Single career detail (`GET /api/careers/:id`)

### 3. Module Management Module
- Career-specific module fetch (`GET /api/modules/career/:careerId`)
- Single module detail (`GET /api/modules/:id`)

### 4. Enrollment Module
- Track enrollment creation (`POST /api/enrollments/enroll`)
- User active enrollments (`GET /api/enrollments/my-enrollments`)

### 5. Progress Tracking Module
- State toggle (`POST /api/progress/toggle`)
- Track progress summary (`GET /api/progress/:careerId`)

### 6. Dashboard Analytics Module
- Aggregated student metrics (`GET /api/dashboard/overview`)

---

## 9. Project Scope

### In-Scope (Version 1)
- Full RESTful API with Node.js, Express, and MongoDB.
- Single-page Application UI built with React 19 and Vite.
- Responsive modern styling using Tailwind CSS.
- Token-based JWT authentication pipeline.
- Career browsing, path enrollment, module progress toggling, and dashboard analytics.

### Out-of-Scope (Deferred to V2+)
- Live video stream hosting.
- Real-time peer chatting.
- Payment gateway integration.
- Automated code execution/ide environments within browser.

---

## 10. Version 1 Deliverables

| Deliverable | Component | Description | Status |
| :--- | :--- | :--- | :--- |
| **REST API Server** | Backend | Node.js + Express backend serving JSON APIs. | Complete |
| **MongoDB Schemas** | Database | User, Career, Module, Enrollment, and Progress schemas. | Complete |
| **Authentication Flow** | Auth | Login, Register, JWT verification, and Protected Routes. | Complete |
| **React Single Page App** | Frontend | Interactive UI with Dashboard, Career, Module, and Profile views. | Complete |
| **Career Seeder** | Script | CLI script to seed MongoDB with initial career and module data. | Complete |
| **Documentation Suite** | Docs | Repository README.md and detailed PROJECT_OVERVIEW.md. | Complete |

---

## 11. Version 2 Roadmap Summary

| Feature | Target Quarter | Planned Description |
| :--- | :--- | :--- |
| **AI Recommendation Engine** | Q1 V2 | Recommends career paths based on user skills assessment. |
| **Skill Quizzes & Knowledge Checks** | Q2 V2 | End-of-module quizzes with automated scoring. |
| **Gamification & Badges** | Q2 V2 | Learning streaks, experience points (XP), and shareable badges. |
| **Downloadable Certificates** | Q3 V2 | PDF certificate generation upon 100% path completion. |
| **Community & Peer Discussion** | Q4 V2 | Discussion boards and Q&A forums under each module. |
