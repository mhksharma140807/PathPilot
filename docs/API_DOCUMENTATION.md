# PathPilot REST API Documentation

> Complete API Specification for PathPilot Version 1

---

## Overview

The PathPilot API is built as a RESTful web service responding with JSON payloads.

- **Base URL**: `http://localhost:5000/api`
- **Default Content-Type**: `application/json`
- **Authentication**: Bearer Token in `Authorization` header (`Authorization: Bearer <JWT_TOKEN>`)

---

## 1. Authentication APIs

### Register User

- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user account (Student, Teacher, Parent, or Admin) and returns an authentication JWT token.
- **Authentication Required**: No
- **Headers**:
  ```http
  Content-Type: application/json
  ```

#### Request Body
```json
{
  "name": "Mahak Sharma",
  "email": "mahak@example.com",
  "password": "Password123",
  "role": "student",
  "phone": "+1234567890"
}
```

#### Response Examples

##### Success (201 Created)
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

##### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Please fill all required fields"
}
```

##### Error Response (409 Conflict)
```json
{
  "success": false,
  "message": "User already exists"
}
```

#### Status Codes
- `201 Created`: User successfully registered.
- `400 Bad Request`: Required fields missing or invalid data.
- `409 Conflict`: User with provided email already registered.
- `500 Internal Server Error`: Server failure.

---

### Login User

- **Endpoint**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticates user credentials and issues a JWT authorization token.
- **Authentication Required**: No
- **Headers**:
  ```http
  Content-Type: application/json
  ```

#### Request Body
```json
{
  "email": "mahak@example.com",
  "password": "Password123"
}
```

#### Response Examples

##### Success (200 OK)
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

##### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### Status Codes
- `200 OK`: Authentication successful.
- `400 Bad Request`: Email or password missing.
- `401 Unauthorized`: Invalid password.
- `404 Not Found`: User email not registered.
- `500 Internal Server Error`: Unexpected server error.

---

### Get Current User

- **Endpoint**: `/api/auth/me`
- **Method**: `GET`
- **Description**: Retrieves the profile details of the currently authenticated user based on the JWT token.
- **Authentication Required**: Yes
- **Headers**:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```

#### Request Body
*None*

#### Response Examples

##### Success (200 OK)
```json
{
  "success": true,
  "user": {
    "_id": "66b1a1f0e21a4c001f9d4e11",
    "name": "Mahak Sharma",
    "email": "mahak@example.com",
    "role": "student",
    "phone": "+1234567890",
    "profileImage": "",
    "isVerified": false,
    "isActive": true,
    "createdAt": "2026-08-03T12:00:00.000Z",
    "updatedAt": "2026-08-03T12:00:00.000Z"
  }
}
```

##### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

#### Status Codes
- `200 OK`: User profile retrieved successfully.
- `401 Unauthorized`: Token missing, expired, or invalid.
- `404 Not Found`: Account no longer exists in database.
- `500 Internal Server Error`: Database connection error.

---

## 2. Dashboard APIs

### Get Student Dashboard Overview

- **Endpoint**: `/api/dashboard/overview`
- **Method**: `GET`
- **Description**: Compiles student analytics including active career track enrollment, module lists, completion summary, and percentage progress.
- **Authentication Required**: Yes
- **Headers**:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```

#### Request Body
*None*

#### Response Examples

##### Success (200 OK - Active Enrollment)
```json
{
  "hasEnrollment": true,
  "career": {
    "_id": "66b1a231e21a4c001f9d4e22",
    "title": "Frontend Developer",
    "slug": "frontend-developer",
    "description": "Master modern web development using HTML, CSS, JavaScript, and React."
  },
  "summary": {
    "totalModules": 4,
    "completedModules": 2,
    "overallProgress": 50
  },
  "modules": [
    {
      "moduleId": "66b1a255e21a4c001f9d4e30",
      "title": "HTML5 & Semantic Web",
      "description": "Learn semantic elements and accessibility.",
      "order": 1,
      "estimatedHours": 5,
      "status": "completed",
      "progressPercentage": 100
    },
    {
      "moduleId": "66b1a255e21a4c001f9d4e31",
      "title": "CSS3 & Modern Layouts",
      "description": "Master Flexbox and CSS Grid.",
      "order": 2,
      "estimatedHours": 8,
      "status": "completed",
      "progressPercentage": 100
    }
  ]
}
```

##### Success (200 OK - No Active Enrollment)
```json
{
  "hasEnrollment": false,
  "career": null,
  "summary": {
    "totalModules": 0,
    "completedModules": 0,
    "overallProgress": 0
  },
  "modules": []
}
```

#### Status Codes
- `200 OK`: Dashboard aggregated data returned.
- `401 Unauthorized`: Missing or invalid JWT token.
- `500 Internal Server Error`: Aggregation error.

---

## 3. Career APIs

### Get All Active Careers

- **Endpoint**: `/api/careers`
- **Method**: `GET`
- **Description**: Fetches all public active career tracks.
- **Authentication Required**: No

#### Response Example (200 OK)
```json
{
  "count": 2,
  "careers": [
    {
      "_id": "66b1a231e21a4c001f9d4e22",
      "title": "Frontend Developer",
      "slug": "frontend-developer",
      "description": "Master modern web development using HTML, CSS, JavaScript, and React.",
      "skills": ["HTML5", "CSS3", "JavaScript", "React"],
      "estimatedDuration": "8 Weeks"
    }
  ]
}
```

#### Status Codes
- `200 OK`: Careers fetched.
- `500 Internal Server Error`: Failed to query careers.

---

### Get Single Career by Slug

- **Endpoint**: `/api/careers/:slug`
- **Method**: `GET`
- **Description**: Fetches details for a single career track using its URL slug.
- **Authentication Required**: No

#### Response Example (200 OK)
```json
{
  "career": {
    "_id": "66b1a231e21a4c001f9d4e22",
    "title": "Frontend Developer",
    "slug": "frontend-developer",
    "description": "Master modern web development using HTML, CSS, JavaScript, and React.",
    "overview": "Comprehensive pathway into modern frontend engineering.",
    "skills": ["HTML5", "CSS3", "JavaScript", "React"],
    "estimatedDuration": "8 Weeks"
  }
}
```

#### Status Codes
- `200 OK`: Career record found.
- `404 Not Found`: No career matching provided slug.
- `500 Internal Server Error`: Query failed.

---

## 4. Module APIs

### Get Modules by Career ID

- **Endpoint**: `/api/modules/career/:careerId`
- **Method**: `GET`
- **Description**: Fetches all active learning modules for a target career track.
- **Authentication Required**: No

#### Response Example (200 OK)
```json
{
  "count": 1,
  "modules": [
    {
      "_id": "66b1a255e21a4c001f9d4e30",
      "career": "66b1a231e21a4c001f9d4e22",
      "title": "HTML5 & Semantic Web",
      "description": "Learn modern HTML layout elements.",
      "order": 1,
      "estimatedHours": 5,
      "objectives": ["Semantic tags", "Accessibility Basics"]
    }
  ]
}
```

#### Status Codes
- `200 OK`: Modules retrieved.
- `500 Internal Server Error`: Query error.

---

### Get Module Details

- **Endpoint**: `/api/modules/:id`
- **Method**: `GET`
- **Description**: Fetches detailed information and lesson content for a specific module ID.
- **Authentication Required**: No

#### Response Example (200 OK)
```json
{
  "module": {
    "_id": "66b1a255e21a4c001f9d4e30",
    "title": "HTML5 & Semantic Web",
    "description": "Learn modern HTML layout elements.",
    "order": 1,
    "estimatedHours": 5,
    "objectives": ["Semantic tags", "Accessibility"],
    "lessons": [
      {
        "title": "Introduction to Semantic HTML",
        "duration": "15 mins",
        "content": "Semantic HTML tags give meaning to structure...",
        "keyTakeaway": "Use header, nav, main, section, and footer."
      }
    ]
  }
}
```

#### Status Codes
- `200 OK`: Module details retrieved.
- `404 Not Found`: Module ID invalid or missing.

---

## 5. Enrollment APIs

### Enroll in Career Path

- **Endpoint**: `/api/enrollments/enroll`
- **Method**: `POST`
- **Description**: Enrolls the authenticated student in a selected career track.
- **Authentication Required**: Yes
- **Headers**:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```

#### Request Body
```json
{
  "careerId": "66b1a231e21a4c001f9d4e22"
}
```

#### Response Example (201 Created)
```json
{
  "message": "Enrolled successfully",
  "enrollment": {
    "_id": "66b1a388e21a4c001f9d4e44",
    "student": "66b1a1f0e21a4c001f9d4e11",
    "career": "66b1a231e21a4c001f9d4e22",
    "status": "active",
    "enrolledAt": "2026-08-03T12:30:00.000Z"
  }
}
```

#### Status Codes
- `201 Created`: Enrolled successfully.
- `400 Bad Request`: Missing career ID.
- `401 Unauthorized`: Token missing or expired.
- `404 Not Found`: Career ID invalid.

---

## 6. Progress APIs

### Update Module Progress

- **Endpoint**: `/api/progress/module`
- **Method**: `PUT`
- **Description**: Updates progress percentage or completion status for a module.
- **Authentication Required**: Yes
- **Headers**:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```

#### Request Body
```json
{
  "moduleId": "66b1a255e21a4c001f9d4e30",
  "status": "completed",
  "progressPercentage": 100
}
```

#### Response Example (200 OK)
```json
{
  "message": "Module progress updated successfully",
  "progress": {
    "_id": "66b1a410e21a4c001f9d4e55",
    "student": "66b1a1f0e21a4c001f9d4e11",
    "career": "66b1a231e21a4c001f9d4e22",
    "module": "66b1a255e21a4c001f9d4e30",
    "status": "completed",
    "progressPercentage": 100,
    "completedAt": "2026-08-03T13:00:00.000Z"
  }
}
```

#### Status Codes
- `200 OK`: Progress updated.
- `401 Unauthorized`: Unauthenticated.
- `404 Not Found`: Module or active enrollment missing.

---

## Summary Matrix

| Category | Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | No | Register new user account |
| **Auth** | `POST` | `/api/auth/login` | No | Login and obtain JWT token |
| **Auth** | `GET` | `/api/auth/me` | Yes | Get authenticated user profile |
| **Dashboard** | `GET` | `/api/dashboard/overview` | Yes | Get student progress and dashboard stats |
| **Career** | `GET` | `/api/careers` | No | List all active career paths |
| **Career** | `GET` | `/api/careers/:slug` | No | Get career path details by slug |
| **Module** | `GET` | `/api/modules/career/:careerId` | No | Get modules for a career track |
| **Module** | `GET` | `/api/modules/:id` | No | Get module details and lessons |
| **Enrollment**| `POST` | `/api/enrollments/enroll` | Yes | Enroll in a career track |
| **Progress** | `PUT` | `/api/progress/module` | Yes | Update status/percentage for a module |
