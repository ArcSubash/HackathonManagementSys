# Hackathon Management System

A full-stack web application for managing hackathons — built with **Spring Boot** (Java 21) and **React** (Vite).

## Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | React 18, Vite, Tailwind CSS v3, Axios        |
| Backend    | Java 21, Spring Boot 3.3, Spring Data MongoDB |
| Database   | MongoDB                                       |
| Auth       | JWT (JSON Web Tokens)                         |

## Project Structure

```
├── backend/          # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/hackathon/
│       ├── config/       # Security & CORS configuration
│       ├── controller/   # REST controllers
│       ├── dto/          # Request/Response DTOs
│       ├── exception/    # Global exception handling
│       ├── model/        # MongoDB document entities
│       ├── repository/   # Spring Data repositories
│       ├── security/     # JWT auth filter & utilities
│       └── service/      # Business logic layer
│
├── frontend/         # React + Vite application
│   └── src/
│       ├── api/          # Axios instance & API services
│       ├── components/   # Reusable UI components
│       ├── context/      # React Context (Auth)
│       ├── layouts/      # Page layouts
│       ├── pages/        # Route-level pages
│       └── router/       # React Router config
```

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- MongoDB (running on `localhost:27017`)

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will start on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server will start on `http://localhost:5173`.

## User Roles

| Role        | Description                              |
| ----------- | ---------------------------------------- |
| ADMIN       | Create/manage hackathons, assign judges  |
| PARTICIPANT | Register, form teams, submit projects    |
| JUDGE       | Evaluate and score submitted projects    |
