# PathPilot REST API Documentation

> Complete API Specification for PathPilot Version 2

---

## Overview

The PathPilot API is built as a RESTful web service responding with JSON payloads.

- **Base URL**: `http://localhost:5000/api` (Local) / `https://pathpilot-backend-3byw.onrender.com/api` (Production)
- **Default Content-Type**: `application/json`
- **Authentication**: Bearer Token in `Authorization` header (`Authorization: Bearer <JWT_TOKEN>`)

---

## 1. Authentication APIs (`/api/auth`)

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "name": "Mahak Sharma",
    "email": "mahak@example.com",
    "password": "Password123",
    "role": "student",
    "phone": "+1234567890"
  }
  ```
- **Response Example (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "66b1a1f0e21a4c001f9d4e11",
      "name": "Mahak Sharma",
      "email": "mahak@example.com",
      "role": "student"
    }
  }
  ```

### Login User
- **Endpoint**: `POST /api/auth/login`
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "email": "mahak@example.com",
    "password": "Password123"
  }
  ```
- **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "66b1a1f0e21a4c001f9d4e11",
      "name": "Mahak Sharma",
      "email": "mahak@example.com",
      "role": "student"
    }
  }
  ```

### Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Authentication Required**: Yes (`Bearer <JWT_TOKEN>`)
- **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "66b1a1f0e21a4c001f9d4e11",
      "name": "Mahak Sharma",
      "email": "mahak@example.com",
      "role": "student",
      "phone": "+1234567890",
      "isActive": true
    }
  }
  ```

### Forgot Password (Request OTP)
- **Endpoint**: `POST /api/auth/forgot-password`
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "email": "mahak@example.com"
  }
  ```
- **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "If an account exists with this email, an OTP has been sent."
  }
  ```

### Reset Password (Verify OTP)
- **Endpoint**: `POST /api/auth/reset-password`
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "email": "mahak@example.com",
    "otp": "123456",
    "newPassword": "NewPassword123"
  }
  ```
- **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Password reset successful. Please login with your new password."
  }
  ```

---

## 2. Public Catalog APIs

### Get All Active Careers
- **Endpoint**: `GET /api/careers`
- **Authentication Required**: No
- **Response Example (200 OK)**:
  ```json
  {
    "count": 6,
    "careers": [
      {
        "_id": "6a745a6bd8883d58759b2adb",
        "title": "Full Stack Developer",
        "slug": "full-stack-developer",
        "description": "Learn to build complete web applications...",
        "skills": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        "estimatedDuration": "5-6 months"
      }
    ]
  }
  ```

### Get Single Career by Slug
- **Endpoint**: `GET /api/careers/:slug`
- **Authentication Required**: No

### Get Phases by Career
- **Endpoint**: `GET /api/phases/career/:careerId`
- **Authentication Required**: No

### Get Modules by Career
- **Endpoint**: `GET /api/modules/career/:careerId`
- **Authentication Required**: No

### Get Modules by Phase
- **Endpoint**: `GET /api/modules/phase/:phaseId`
- **Authentication Required**: No

### Get Module Details
- **Endpoint**: `GET /api/modules/:id`
- **Authentication Required**: No
- **Response Example (200 OK)**:
  ```json
  {
    "module": {
      "_id": "6a745a6bd8883d58759b2ae3",
      "title": "Web Development Fundamentals",
      "description": "Build a strong foundation in HTML, CSS and JavaScript.",
      "order": 1,
      "lessons": [
        {
          "_id": "6a901a09be13c9fe0972022b",
          "title": "1. Core Overview of Web Development Fundamentals",
          "duration": "15 mins",
          "content": "Welcome to this module...",
          "keyTakeaway": "Understanding fundamental principles...",
          "resources": []
        }
      ]
    }
  }
  ```

---

## 3. Student Progress & Enrollment APIs

### Enroll in Career Path
- **Endpoint**: `POST /api/enrollments/enroll`
- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {
    "careerId": "6a745a6bd8883d58759b2adb"
  }
  ```

### Get My Progress Summary
- **Endpoint**: `GET /api/progress/me`
- **Authentication Required**: Yes

### Mark Progress (Lesson Completion)
- **Endpoint**: `POST /api/progress/lesson`
- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {
    "moduleId": "6a745a6bd8883d58759b2ae3",
    "lessonId": "6a901a09be13c9fe0972022b"
  }
  ```
- **Response Example (200 OK)**:
  ```json
  {
    "message": "Lesson marked complete",
    "progress": {
      "_id": "6a901a2dfc4c91d444e527e6",
      "student": "6a901a2dfc4c91d444e527cb",
      "career": "6a745a6bd8883d58759b2adb",
      "module": "6a745a6bd8883d58759b2ae3",
      "status": "in_progress",
      "progressPercentage": 33,
      "completedLessons": [
        {
          "lessonId": "6a901a09be13c9fe0972022b",
          "completedAt": "2026-08-27T11:06:21.743Z"
        }
      ]
    }
  }
  ```

### Get Aggregated Curriculum State
- **Endpoint**: `GET /api/progress/curriculum`
- **Authentication Required**: Yes
- **Description**: Returns complete phase structure with backend-evaluated module unlock states, progress percentages, and prerequisite status.

---

## 4. Certificate APIs

### Claim Certificate
- **Endpoint**: `POST /api/certificates/claim`
- **Authentication Required**: Yes
- **Description**: Claims certificate upon reaching 100% overall progress.

### Get My Certificates
- **Endpoint**: `GET /api/certificates/my-certificates`
- **Authentication Required**: Yes

### Public Certificate Verification
- **Endpoint**: `GET /api/certificates/verify/:certificateId`
- **Authentication Required**: No (**Public**)
- **Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "verified": true,
    "message": "Certificate verified successfully",
    "certificate": {
      "certificateId": "PP-CERT-2026-A1B2C3D4",
      "studentName": "Mahak Sharma",
      "careerTitle": "Full Stack Developer",
      "issuedAt": "2026-08-27T12:00:00.000Z",
      "verificationStatus": "VALID"
    }
  }
  ```

---

## 5. Admin Management APIs (`/api/admin/*`)

- **Authorization Requirement**: Header `Authorization: Bearer <JWT_TOKEN>` where user role is `admin`.

| Endpoint | Method | Purpose |
| :--- | :---: | :--- |
| `/api/admin/dashboard` | `GET` | System-wide dashboard statistics |
| `/api/admin/careers` | `GET`/`POST` | List or create career tracks |
| `/api/admin/careers/:id` | `PUT`/`PATCH`/`DELETE` | Update, toggle status, or delete career track |
| `/api/admin/phases` | `GET`/`POST` | List or create phases |
| `/api/admin/phases/:id` | `PUT`/`PATCH`/`DELETE` | Update, toggle status, or delete phase |
| `/api/admin/modules` | `GET`/`POST` | List or create modules with embedded lessons & resources |
| `/api/admin/modules/:id` | `GET`/`PUT`/`PATCH`/`DELETE` | Get, update, toggle status, or delete module |
| `/api/admin/curriculum-requirements` | `GET`/`POST` | List or create phase requirement rules |
| `/api/admin/curriculum-requirements/:id` | `PUT`/`DELETE` | Update or delete requirement rule |
| `/api/admin/users` | `GET` | Search & list registered users |
| `/api/admin/users/:id/status` | `PATCH` | Toggle user active/deactivated status |
| `/api/admin/users/:id/role` | `PATCH` | Update user role (`student`, `admin`, `teacher`, `parent`) |
| `/api/admin/users/:id` | `DELETE` | Delete user account with dependency checks |
