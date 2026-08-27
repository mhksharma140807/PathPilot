# PathPilot V2 Setup & Installation Guide

## 1. System Requirements & Prerequisites

- **Node.js**: `v18.x` or higher (`v24.x` tested)
- **npm**: `v9.x` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas connection string
- **Git**: For repository cloning

---

## 2. Environment Variables Configuration

Create a `.env` file in the `server/` directory using the actual variable names from the codebase:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pathpilot
JWT_SECRET=pathpilot_super_secret_2026_key
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="PathPilot Support" <your_email@gmail.com>
```

### Environment Variables Glossary
| Variable | Required | Description | Example / Default |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | Port for Express backend server | `5000` |
| `MONGODB_URI` | **Required** | MongoDB connection URI string | `mongodb://localhost:27017/pathpilot` |
| `JWT_SECRET` | **Required** | Secret key for signing JWT tokens | `pathpilot_super_secret_2026_key` |
| `FRONTEND_URL` | Optional | Client URL for CORS policy | `http://localhost:5173` |
| `EMAIL_HOST` | Optional | SMTP host for sending OTP emails | `smtp.gmail.com` |
| `EMAIL_PORT` | Optional | SMTP port | `587` |
| `EMAIL_USER` | Optional | SMTP authentication email address | `support@example.com` |
| `EMAIL_PASS` | Optional | SMTP app password | `app_password` |
| `EMAIL_FROM` | Optional | Sender header string | `"PathPilot Support" <support@example.com>` |

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 3. Step-by-Step Local Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mhksharma140807/PathPilot.git
   cd pathpilot
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

4. **Seed Database Careers & Backfill Module Lessons**:
   ```bash
   cd ../server
   # Seed career tracks, phases, modules & default embedded lessons
   npm run seed:careers

   # Run backfill script (ensures all modules contain embedded lesson subdocuments)
   node scripts/backfillModuleLessons.js

   # Optional: Seed initial admin user account
   node scripts/seedAdminUser.js
   ```

5. **Start Development Servers**:
   ```bash
   # Start backend server (Port 5000)
   cd server
   npm run dev

   # In a new terminal tab, start frontend client (Port 5173)
   cd client
   npm run dev
   ```

---

## 4. Production Deployment Configurations

- **Frontend Deployment (Vercel)**:
  - Framework Preset: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variable: `VITE_API_URL=https://pathpilot-backend-3byw.onrender.com/api`
  - Rewrites (`vercel.json`): Single Page Application fallback `{ "source": "/(.*)", "destination": "/index.html" }`

- **Backend Deployment (Render)**:
  - Environment: Node.js Service
  - Build Command: `npm install`
  - Start Command: `node server.js`
  - Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, SMTP settings.
