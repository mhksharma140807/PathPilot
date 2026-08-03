# PathPilot

> **Career Learning & Skill Development Ecosystem**

PathPilot is a web platform designed to guide students and early-career professionals through structured, industry-aligned career tracks. By breaking down career goals into digestible learning modules, interactive progress tracking, and personalized dashboards, PathPilot bridges the gap between skill acquisition and career readiness.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [Running Client](#running-client)
- [Running Server](#running-server)
- [Screenshots](#screenshots)
- [API Summary](#api-summary)
- [Future Scope](#future-scope)
- [Author](#author)

---

## Project Overview

In today's fast-evolving job market, learners often face choice paralysis due to unstructured learning resources. **PathPilot** simplifies career development by providing curated career paths (such as Frontend Developer, Backend Developer, or Data Scientist) with step-by-step learning modules. Learners can explore target roles, enroll in career paths, track module progress in real-time, and view comprehensive metrics through an intuitive student dashboard.

---

## Key Features

- **Career Exploration & Search**: Browse through structured career paths with details on skill requirements, difficulty, and industry demand.
- **Structured Learning Modules**: Access step-by-step topic modules complete with estimated completion times and learning outcomes.
- **Enrollment Management**: Enroll in multiple career paths and manage active tracks seamlessly.
- **Granular Progress Tracking**: Mark individual modules as complete and monitor real-time completion percentages.
- **Dynamic Student Dashboard**: Visualize overall progress, active enrollments, recent module activity, and quick stats in one central hub.
- **Secure Authentication**: User registration and login utilizing hashed passwords and JSON Web Tokens (JWT).
- **Responsive Modern UI**: Fast and intuitive visual interface optimized for desktop and mobile viewports.

---

## Tech Stack

### Frontend
- **Framework**: React 19 (Vite build tool)
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Architecture**: Controller-Service-Route Pattern

### Database
- **Database Engine**: MongoDB
- **ODM**: Mongoose v8

### Authentication
- **Token Mechanism**: JSON Web Tokens (`jsonwebtoken`)
- **Password Encryption**: bcrypt (`bcrypt`)

---

## Folder Structure

```text
pathpilot/
├── client/                     # React Frontend Application
│   ├── public/                 # Static Assets
│   └── src/
│       ├── components/         # Reusable UI Components (Navbar, ModuleCard, etc.)
│       ├── context/            # React Context (AuthContext)
│       ├── pages/              # Page Views (Dashboard, Careers, Modules, Profile, Login, Register)
│       ├── routes/             # App Router and Protected Route Wrappers
│       ├── services/           # Axios API Client Configurations
│       ├── app.css             # Main Styling Configuration
│       ├── main.jsx            # Entry point for React
│       └── App.jsx             # Root Component Setup
│   ├── index.html              # Single Page App Host HTML
│   ├── package.json            # Client Dependencies & Scripts
│   └── vite.config.js          # Vite Build Configuration
│
├── server/                     # Node.js / Express Backend API
│   ├── config/                 # DB Connection & Server Configurations
│   ├── controllers/            # Request Handlers & Business Logic
│   ├── middleware/             # Auth JWT Verification & Error Middleware
│   ├── models/                 # Mongoose Database Schemas (User, Career, Module, Enrollment, Progress)
│   ├── routes/                 # API Endpoint Definitions
│   ├── seed/                   # Database Seeding Scripts
│   ├── services/               # Core Business Logic Layer
│   ├── utils/                  # Helper Utilities & Constants
│   ├── .env                    # Backend Environment Variables
│   ├── app.js                  # Express Application Setup
│   ├── server.js               # HTTP Server Initialization
│   └── package.json            # Server Dependencies & Scripts
│
├── docs/                       # Project Documentation
│   ├── PROJECT_OVERVIEW.md     # Detailed Architectural & Product Documentation
│   ├── 00-Project-Management.md
│   ├── 01-Development-Guide.md
│   ├── 02-Commands.md
│   └── 03-Decisions.md
└── README.md                   # Repository Overview & Quickstart Guide
```

---

## Installation Guide

Follow these steps to set up PathPilot locally on your machine.

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: Local instance running on port 27017 or a MongoDB Atlas connection string

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mhksharma140807/PathPilot.git
   cd pathpilot
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

---

## Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | HTTP Port for the backend server | `5000` |
| `MONGO_URI` | Connection URI for MongoDB database | `<your_mongodb_connection_string>` |
| `JWT_SECRET` | Secret key used to sign and verify JWT authentication tokens | `<your_jwt_secret_key>` |

---

## Running Client

To start the Vite frontend development server:

```bash
cd client
npm run dev
```

The application client will be accessible at `http://localhost:5173`.

---

## Running Server

To seed the initial career data (optional but recommended for first launch):

```bash
cd server
npm run seed:careers
```

To start the backend Express server in development mode (with hot reloading via nodemon):

```bash
cd server
npm run dev
```

The API server will listen on `http://localhost:5000`.

---

## Screenshots section (placeholder)

> *Screenshots demonstrating the PathPilot UI will be populated here.*

| Dashboard View | Career Tracks | Module Progress |
| :---: | :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/600x350?text=PathPilot+Dashboard) | ![Careers Placeholder](https://via.placeholder.com/600x350?text=Career+Tracks+View) | ![Modules Placeholder](https://via.placeholder.com/600x350?text=Learning+Modules) |

---

## API Summary

The backend exposes a RESTful API structured around the following resource routes:

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new student account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current authenticated user profile |

### Careers (`/api/careers`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/careers` | Public | Retrieve all available career tracks |
| `GET` | `/api/careers/:id` | Public | Get detailed information for a single career track |

### Learning Modules (`/api/modules`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/modules/career/:careerId` | Public | Get all learning modules belonging to a specific career track |
| `GET` | `/api/modules/:id` | Public | Get details of an individual learning module |

### Enrollments (`/api/enrollments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/enrollments/enroll` | Protected | Enroll authenticated student into a career track |
| `GET` | `/api/enrollments/my-enrollments` | Protected | Get list of all enrolled career tracks for current user |

### Progress Tracking (`/api/progress`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/progress/toggle` | Protected | Mark a module as completed or pending |
| `GET` | `/api/progress/:careerId` | Protected | Fetch user completion status for modules in a career track |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/overview` | Protected | Get aggregated student dashboard stats, active paths, and overall progress |

---

## Future Scope

- **AI-Powered Career Recommendations**: Machine learning models to recommend career paths based on user skills and target interests.
- **Interactive Quizzes & Skill Assessments**: End-of-module knowledge checks to validate learning before completion.
- **Peer & Mentor Networking**: Discussion forums, code review boards, and mentorship connections.
- **Certificate Generation**: Automated downloadable certificates upon completing 100% of a career path.
- **Gamification & Badges**: Achievement badges, daily learning streaks, and leaderboards to drive student engagement.

---

## Author

**Mahak Sharma**
- **Role**: Full Stack Developer & Architect
- **Repository**: [PathPilot GitHub](https://github.com/mhksharma140807/PathPilot)
- **Contributors**: Team PathPilot