# PathPilot - Development Guide

This document explains every package and technology used in the project.

---

# Frontend Packages

## 1. React Router DOM

Install:

```bash
npm install react-router-dom
```

Purpose:

- Navigation between pages
- Client-side routing

Examples:

- Home
- Login
- Dashboard
- Career Path
- Profile

Without it:

The application would reload the page every time the user navigates.

---

## 2. Axios

Install:

```bash
npm install axios
```

Purpose:

Communicates with the backend API.

Examples:

- Login request
- Register request
- Load careers
- Save progress

Without it:

The frontend cannot communicate with the Express backend.

---

## 3. Tailwind CSS

Install:

```bash
npm install tailwindcss @tailwindcss/vite
```

Purpose:

UI styling.

Benefits:

- Responsive design
- Faster development
- Professional UI
- Industry standard

---

# Backend Packages

## Express

Purpose:

Backend server.

---

## Mongoose

Purpose:

Connect React application with MongoDB.

---

## bcrypt

Purpose:

Encrypt passwords.

Never store passwords as plain text.

---

## JSON Web Token (JWT)

Purpose:

Authentication.

Keeps users logged in securely.

---

## dotenv

Purpose:

Stores secret values.

Examples:

- MongoDB URI
- JWT Secret

Never upload .env to GitHub.

---

## CORS

Purpose:

Allows frontend and backend to communicate.

---

## Nodemon

Purpose:

Automatically restarts the backend server whenever files change.

---

# Development Philosophy

Every package should answer one question:

"Why is this package installed?"

If no clear reason exists,
do not install it.