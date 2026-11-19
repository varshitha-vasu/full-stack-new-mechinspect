# AutoInspect – Full-Stack Inspection Dashboard

A starter full-stack automotive/manufacturing quality inspection application.

## Technology
- React + Vite frontend
- Express + Node.js backend
- MongoDB with Mongoose
- Recharts for dashboard visualizations
- Docker Compose for local containerized development
- Jenkins pipeline for build and container smoke tests

## Project structure
- `frontend/` – React dashboard
- `backend/` – REST API and MongoDB models

## Run locally

### With Docker (recommended)

Install Docker Desktop, then run from the project root:

```bash
docker compose up --build
```

Open http://localhost:5173. Docker Compose starts MongoDB, the API, and the
frontend; the frontend's Nginx server forwards `/api` requests to the API.

### Without Docker

Install Node.js LTS and MongoDB Community Server.

#### 1. Start MongoDB
Ensure MongoDB is running locally on port 27017.

#### 2. Start backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```
Backend: http://localhost:5000

#### 3. Start frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

The frontend displays sample records if the API or database is unavailable.

## Jenkins

The `Jenkinsfile` builds both Node.js projects and runs a Docker Compose smoke
test. The Jenkins agent must have Node.js, npm, Docker Compose, and `curl.exe`.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/inspections` | List inspections |
| GET | `/api/inspections/:id` | Get one inspection |
| POST | `/api/inspections` | Create inspection |
| PUT | `/api/inspections/:id` | Update inspection |
| DELETE | `/api/inspections/:id` | Delete inspection |
| GET | `/api/dashboard/stats` | Dashboard statistics |

## Note
The frontend currently starts with sample demonstration records so you can explore the interface before the database is connected. New records are saved to MongoDB when the API is running; otherwise, the UI uses demo-mode state.
