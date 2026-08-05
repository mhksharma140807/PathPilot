# PathPilot Installation & Developer Setup Guide

> Comprehensive Setup, Configuration, and Troubleshooting Manual for PathPilot

---

## 1. System Requirements

Before installing PathPilot, ensure your system satisfies the following software prerequisites:

| Requirement | Supported Version | Verification Command | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.x` or `v20.x` | `node -v` | JavaScript runtime environment. |
| **npm** | `v9.x` or `v10.x` | `npm -v` | Node Package Manager bundled with Node.js. |
| **MongoDB** | `v6.0` or higher | `mongod --version` | Local MongoDB service or MongoDB Atlas cluster URI. |
| **Git** | `v2.x` or higher | `git --version` | Version control system. |
| **VS Code** | Latest Release | `code -v` | Recommended IDE with ESLint & Prettier extensions. |

---

## 2. Installation

### Step 1: Clone Repository

Open your terminal and clone the PathPilot repository to your local directory:

```bash
git clone https://github.com/mhksharma140807/PathPilot.git
cd PathPilot
```

---

### Step 2: Install Backend Server Dependencies

Navigate to the `server` directory and install all required Node modules:

```bash
cd server
npm install
```

---

### Step 3: Install Frontend Client Dependencies

Open a new terminal window or return to the project root, navigate to `client`, and install dependencies:

```bash
cd ../client
npm install
```

---

## 3. Environment Variables Configuration

The backend application relies on environment variables defined in a `.env` file located in the `server` directory.

### Create `.env` File

Create a file named `.env` inside `c:\projects\pathpilot\server\.env` with the following configuration keys:

```env
PORT=5000
MONGO_URI=<mongodb_connection_string>
JWT_SECRET=<jwt_secret_key>
```

### Key Descriptions

| Environment Variable | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Yes | `5000` | HTTP Port for Express REST API backend. |
| `MONGO_URI` | Yes | `<your_mongodb_connection_string>` | MongoDB connection string. |
| `JWT_SECRET` | Yes | *Required Secret Key* | Secret string used to sign and verify JSON Web Tokens. |

---

## 4. MongoDB Configuration

PathPilot requires access to a running MongoDB instance.

### Option A: Local MongoDB Community Edition
1. Ensure the MongoDB service is running locally on default port `27017`.
2. Windows Service verification:
   ```powershell
   Get-Service -Name MongoDB
   ```
3. If stopped, start the service:
   ```powershell
   Start-Service -Name MongoDB
   ```

### Option B: Seed Initial Career Data
Populate the database with initial career pathways and learning modules:

```bash
cd server
npm run seed:careers
```

---

## 5. Running the Application

### Running the Backend Server

Start the backend server in development mode (with automatic reloading via `nodemon`):

```bash
cd server
npm run dev
```

- Expected Output:
  ```text
  [nodemon] 3.1.14
  [nodemon] starting `node server.js`
  Server running on port 5000
  MongoDB Connected successfully.
  ```

---

### Running the Frontend Client

Start the Vite development server in a separate terminal:

```bash
cd client
npm run dev
```

- Expected Output:
  ```text
    VITE v8.1.1  ready in 250 ms

    ➜  Local:   http://localhost:5173/
    ➜  Network: use --host to expose
  ```

Open your browser and navigate to `http://localhost:5173`.

---

## 6. Project Structure Overview

```text
pathpilot/
├── client/                     # React 19 Frontend App
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   ├── context/            # Auth Context Provider
│   │   ├── pages/              # Application View Pages
│   │   ├── routes/             # Client Routing Table
│   │   └── services/           # Axios API Client
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js / Express API Backend
│   ├── config/                 # Database Configuration
│   ├── controllers/            # API Route Logic Handlers
│   ├── middleware/             # Authentication Middlewares
│   ├── models/                 # Mongoose Data Schemas
│   ├── routes/                 # Express Route Declarations
│   ├── seed/                   # Database Seed Scripts
│   ├── .env                    # Environment Variable Definitions
│   └── server.js               # Entry Point
│
├── docs/                       # Comprehensive Architecture & API Documentation
└── README.md                   # Repository Overview
```

---

## 7. Development Workflow & Commands

### Useful npm Commands

#### Server Directory (`server/`)
- `npm run dev`: Starts Express server with `nodemon` hot reloading.
- `npm start`: Starts production Node server.
- `npm run seed:careers`: Runs database seed script to populate sample careers.

#### Client Directory (`client/`)
- `npm run dev`: Starts Vite frontend development server at `http://localhost:5173`.
- `npm run build`: Compiles optimized production distribution build in `dist/`.
- `npm run lint`: Runs ESLint checks across React codebase.

---

### Git Workflow Commands

```bash
# Check repository status
git status

# Create a feature branch
git checkout -b feature/new-module

# Stage and commit changes
git add .
git commit -m "docs: complete setup guide"

# Push branch to remote
git push origin feature/new-module
```

---

## 8. Troubleshooting & Common Errors

### 1. MongoDB Connection Error

#### Error Message
`MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

#### Solution
- Check if your local MongoDB service is running.
- On Windows PowerShell:
  ```powershell
  net start MongoDB
  ```
- If using MongoDB Atlas, check your network access settings in Atlas and verify the `MONGO_URI` connection string in `server/.env`.

---

### MongoDB Atlas DNS Note

If MongoDB Atlas SRV lookup fails on some Windows/ISP networks with:

querySrv ECONNREFUSED

PathPilot includes a development-only DNS fallback using Google Public DNS (8.8.8.8 / 8.8.4.4). This runs only in development and is ignored in production.

### 2. Missing `.env` File Error

#### Error Message
`Error: secretOrPrivateKey must have a value` OR `undefined MONGO_URI`

#### Solution
- Ensure a `.env` file exists in the `server/` directory.
- Confirm `JWT_SECRET` and `MONGO_URI` are defined without spaces around `=` signs.

---

### 3. Port Already Used Error

#### Error Message
`Error: listen EADDRINUSE: address already in use :::5000`

#### Solution
- Another process is using port `5000`.
- Terminate the running Node process:
  - Windows:
    ```powershell
    Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
    ```
- Alternatively, edit `PORT=5001` in `server/.env`.

---

### 4. Invalid or Expired Token Error

#### Error Message
`401 Unauthorized: Access denied. Invalid token.`

#### Solution
- Clear your browser's local storage (`localStorage.clear()`).
- Log out and log back into the PathPilot application to acquire a freshly signed JWT token.
