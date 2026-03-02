# 🎓 StudentDBMS

A full-stack **Student Database Management System** built with the MERN stack (MongoDB, Express, React, Node.js) and Redis for caching. Manage student records with a clean, modern UI — add, view, search, edit, and delete students effortlessly.

## 🌐 Live Demo

| Service  | URL |
|----------|-----|
| Frontend | [student-dbms-sandy.vercel.app](https://student-dbms-sandy.vercel.app) |
| Backend  | [Render](https://student-dbms-backend.onrender.com) |

---

## ✨ Features

- ➕ **Add Students** — Register new students with name, ID, class, section, and phone
- 👥 **View Students** — Browse all student records in a responsive table
- 🔍 **Search** — Instantly search students by name or student ID
- ✏️ **Edit** — Update existing student records inline
- 🗑️ **Delete** — Remove student records with confirmation
- ⚡ **Redis Caching** — Fast reads with server-side cache invalidation on writes
- 🌐 **REST API** — Clean RESTful endpoints for all CRUD operations

---

## 🛠️ Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19, React Router v7, Vite, Axios |
| Backend   | Node.js, Express.js |
| Database  | MongoDB Atlas (Mongoose) |
| Cache     | Redis (ioredis) |
| Hosting   | Vercel (frontend) · Render (backend) |

---

## 📁 Project Structure

```
StudentDBMS/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── api/            # Axios API client
│   │   ├── components/     # Reusable UI components (StudentForm, etc.)
│   │   ├── pages/          # AddStudentPage, ViewStudentsPage
│   │   ├── App.jsx         # Root component with routing & sidebar
│   │   └── index.css       # Global styles
│   ├── vercel.json         # Vercel deployment config
│   └── package.json
│
└── backend/                # Express.js API server
    ├── config/             # DB & Redis connection setup
    ├── controllers/        # Business logic (studentController.js)
    ├── models/             # Mongoose schema (Student.js)
    ├── routes/             # API routes (studentRoutes.js)
    ├── server.js           # App entry point
    ├── .env.example        # Environment variable template
    └── package.json
```

---

## 🗃️ Student Schema

| Field       | Type   | Constraints                        |
|-------------|--------|------------------------------------|
| `name`      | String | Required                           |
| `studentId` | String | Required, Unique                   |
| `class`     | String | Required                           |
| `section`   | String | Required                           |
| `phone`     | String | Required, exactly 10 digits        |

---

## 🔌 API Endpoints

Base URL: `/api/students`

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/`              | Get all students         |
| GET    | `/search?q=...`  | Search students           |
| POST   | `/`              | Add a new student        |
| PUT    | `/:id`           | Update a student         |
| DELETE | `/:id`           | Delete a student         |
| GET    | `/api/health`    | Health check             |

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Redis server running locally

### 1. Clone the repository

```bash
git clone https://github.com/NaveenBairagi/StudentDBMS.git
cd StudentDBMS
```

### 2. Setup the Backend

```bash
cd backend
cp .env.example .env
# Edit .env and fill in your credentials
npm install
npm run dev
```

### 3. Setup the Frontend

```bash
cd frontend
# Create .env.local and set the backend URL
echo "VITE_API_URL=http://localhost:5000" > .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and backend at `http://localhost:5000`.

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379
```

### Frontend (`frontend/.env.local`)

```env
VITE_API_URL=http://localhost:5000
```

---

## 📦 Deployment

| Platform | Config |
|----------|--------|
| **Vercel** (Frontend) | Auto-detected Vite project. Set `VITE_API_URL` env var to the Render backend URL. |
| **Render** (Backend)  | Set `PORT`, `MONGODB_URI`, and `REDIS_URL` environment variables in the Render dashboard. |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
