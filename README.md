# BugScope 🔍

Error logging and monitoring API built with Node.js, Express, and MongoDB.

## Live Demo
🚀 **https://bugscope.onrender.com**
📖 **https://bugscope.onrender.com/api-docs**

## Features
- Log errors from any application via REST API
- Duplicate error detection using SHA-256
- Error metrics and statistics endpoint
- API Key authentication
- Interactive Swagger docs at `/api-docs`
- Frontend Dashboard at `/`
- Dockerized with Docker Compose
- CI pipeline with GitHub Actions (Jest)

## Tech Stack
Node.js · Express · MongoDB · Docker · Jest · Swagger

## Quick Start
```bash
docker compose up --build
```

- Dashboard: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /logs | Create a new error log |
| GET | /logs | Get all error logs |
| GET | /metrics | Get error statistics |

All endpoints require `x-api-key` header.

## Running Tests
```bash
npm test
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB connection string |
| PORT | Server port (default: 3000) |
| API_KEY | Secret API key |