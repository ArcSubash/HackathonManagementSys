# Hackathon Management System — Implementation Plan

A full-stack Java + React application where organizers create hackathons, participants register and form teams, judges evaluate projects, and admins manage the entire event.

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), Tailwind CSS v3, Axios, React Router v6 |
| Backend | Java 21, Spring Boot 3.x, Spring Data MongoDB, Maven |
| Database | MongoDB |
| Architecture | REST API, MVC / Layered |

---

## Project Structure

```
Hackathon Management System/
├── backend/                          # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/hackathon/
│       ├── HackathonApplication.java
│       ├── config/                   # Security, CORS, MongoDB configs
│       ├── controller/              # REST controllers
│       ├── service/                 # Service interfaces
│       │   └── impl/               # Service implementations
│       ├── repository/             # MongoRepository interfaces
│       ├── model/                  # @Document entities
│       ├── dto/                    # Request/Response DTOs
│       │   ├── request/
│       │   └── response/
│       ├── exception/              # Global exception handler + custom exceptions
│       ├── security/               # JWT filter, provider, utils
│       └── util/                   # Helper classes
│
├── frontend/                        # React + Vite application
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/                    # Axios instance + API service files
│       ├── components/             # Shared/reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── Modal.jsx
│       │   ├── Card.jsx
│       │   ├── Table.jsx
│       │   └── FormInput.jsx
│       ├── context/                # AuthContext (React Context API)
│       ├── hooks/                  # Custom hooks
│       ├── layouts/                # DashboardLayout, AuthLayout
│       ├── pages/                  # Route-level page components
│       │   ├── auth/
│       │   ├── admin/
│       │   ├── participant/
│       │   └── judge/
│       ├── router/                 # Route config + ProtectedRoute
│       ├── utils/                  # Helpers (date formatting, etc.)
│       └── styles/                 # Global CSS / Tailwind directives
│
└── README.md
```

---

## Database Collections

| Collection | Key Fields |
|-----------|-----------|
| `users` | name, email, password (hashed), role (ADMIN / PARTICIPANT / JUDGE) |
| `hackathons` | title, description, theme, startDate, endDate, registrationDeadline, status |
| `teams` | teamName, leaderId, memberIds[], hackathonId |
| `projects` | title, description, githubLink, demoVideo, teamId, hackathonId, submittedAt |
| `scores` | projectId, judgeId, innovation, technical, presentation, problemSolving, totalScore, comments |

> **Design decision**: The `judges` collection from the spec is merged into the `users` collection (role = JUDGE) plus a `assignedHackathons[]` field. This avoids redundant data.

---

## Module Build Order

The project will be built **module by module**. After each module I will wait for your confirmation before proceeding.

---

### Module 1 — Project Scaffolding & Authentication

**Backend**
- Initialize Spring Boot project with Maven (`pom.xml` with all dependencies)
- MongoDB configuration (`application.properties`)
- `User` model with roles enum (ADMIN, PARTICIPANT, JUDGE)
- `UserRepository`
- `AuthController` — `/api/auth/register`, `/api/auth/login`
- `AuthService` + `AuthServiceImpl` — registration (password hashing with BCrypt), login (JWT generation)
- JWT utility class (generate, validate, extract claims)
- `JwtAuthenticationFilter` (OncePerRequestFilter)
- `SecurityConfig` (Spring Security filter chain, CORS config)
- Global exception handler (`@ControllerAdvice`)
- Request/Response DTOs (`LoginRequest`, `RegisterRequest`, `AuthResponse`)
- Bean Validation on DTOs

**Frontend**
- Scaffold React + Vite project
- Install & configure Tailwind CSS v3
- Set up Axios instance with base URL & interceptors (auto-attach JWT)
- Auth Context (login, logout, current user state)
- Pages: **Login**, **Register**
- Protected Route component
- Basic `Navbar` component
- Router setup with public/protected routes

**Verification**: Register a user → Login → Receive JWT → Access protected endpoint

---

### Module 2 — Hackathon Module (Admin CRUD + Participant Browse)

**Backend**
- `Hackathon` model (with status enum: UPCOMING, ACTIVE, COMPLETED)
- `HackathonRepository`
- `HackathonController` — full CRUD (`/api/hackathons`)
- `HackathonService` + impl
- DTOs for create/update/response
- Role-based access: only ADMIN can create/edit/delete

**Frontend**
- **Admin pages**: Create Hackathon form, Hackathon List (table with edit/delete), Edit Hackathon form
- **Participant pages**: Browse Hackathons (card grid), Hackathon Detail page
- Reusable `Card`, `Table`, `Modal` (confirm delete), `FormInput` components
- Admin `Sidebar` navigation
- `DashboardLayout` with sidebar + content area

**Verification**: Admin creates hackathon → Participant sees it in browse → Admin edits/deletes

---

### Module 3 — Team Module

**Backend**
- `Team` model
- `TeamRepository`
- `TeamController` — create, join, leave, list members (`/api/teams`)
- `TeamService` + impl
- Business rules: max 1 team per hackathon per participant, leader cannot leave (must disband), registration deadline check

**Frontend**
- Create Team page (select hackathon)
- Join Team (search by team name / code)
- My Team view (members list with leave option)
- Admin: View all teams for a hackathon

**Verification**: Participant creates team → Another joins → View members → Leave team

---

### Module 4 — Project Submission Module

**Backend**
- `Project` model (title, description, githubLink, demoVideo, teamId, hackathonId, submittedAt)
- `ProjectRepository`
- `ProjectController` — submit, edit, view (`/api/projects`)
- `ProjectService` + impl
- Validation: only team leader can submit, only before deadline, one project per team

**Frontend**
- Submit Project form (with GitHub link, demo video fields)
- Edit Submission page
- View Submission page
- Admin: View all submitted projects per hackathon

**Verification**: Team leader submits project → Edits before deadline → Admin sees submission

---

### Module 5 — Judge & Evaluation Module

**Backend**
- Add `assignedHackathons[]` field to User model (for judges)
- `Score` model
- `ScoreRepository`
- `JudgeController` — assign judge to hackathon, get assigned projects (`/api/judges`)
- `EvaluationController` — submit score, view scores (`/api/evaluations`)
- `EvaluationService` + impl
- Validation: judge can only score assigned projects, score each criterion 1-10

**Frontend**
- Admin: Assign Judges page (select judge → select hackathon)
- Judge Dashboard: View assigned hackathons & projects
- Score Project form (Innovation, Technical, Presentation, Problem Solving + Comments)
- View submitted evaluations

**Verification**: Admin assigns judge → Judge sees projects → Scores → Scores saved

---

### Module 6 — Leaderboard & Results Module

**Backend**
- `LeaderboardController` — `/api/leaderboard/{hackathonId}`
- `LeaderboardService` — aggregate scores per project, rank by totalScore
- `ResultController` — announce winners (`/api/results`)
- Admin endpoint to publish/announce winners

**Frontend**
- Leaderboard page (ranked table with team name, project, total score)
- Results page for participants (view winners + their own ranking)
- Admin: "Announce Winners" action button

**Verification**: After scoring → Leaderboard auto-ranks → Admin announces → Participants see results

---

### Module 7 — Dashboards & Polish

**Backend**
- Admin stats endpoint (`/api/admin/stats`) — total hackathons, participants, teams, projects, judges
- Participant profile update endpoint

**Frontend**
- **Admin Dashboard**: Stats cards (total hackathons, participants, teams, submissions), recent activity
- **Participant Dashboard**: Registered hackathons, team info, submission status
- **Judge Dashboard**: Assigned hackathons, pending evaluations count
- Profile edit page
- Responsive polish & animations (Tailwind transitions, hover effects)
- Loading spinners, toast notifications, empty states
- Final UI polish across all pages

**Verification**: All dashboards render correct stats → Responsive on mobile → Full user flow end-to-end

---

## Open Questions

> [!IMPORTANT]
> **Tailwind CSS version**: You specified Tailwind CSS. Which version do you prefer — **Tailwind CSS v3** (stable, class-based) or **Tailwind CSS v4** (newer, CSS-first config)? I'll default to **v3** unless you say otherwise.

> [!IMPORTANT]  
> **Authentication approach**: The plan uses **JWT (JSON Web Token)** for stateless authentication. Is that acceptable, or do you prefer session-based auth?

> [!NOTE]
> **MongoDB setup**: The backend will connect to MongoDB at `localhost:27017` by default. Make sure you have MongoDB Community Server or MongoDB Atlas running before testing.

---

## Verification Plan

### Per-Module Testing
- After each module, I will verify by running the Spring Boot app and React dev server
- Test REST APIs using the frontend forms or curl commands
- Ensure role-based access control works correctly

### Final End-to-End Flow
1. Admin logs in → Creates hackathon → Assigns judges
2. Participant registers → Browses hackathons → Registers → Creates team → Submits project
3. Judge logs in → Views assigned projects → Scores them
4. Leaderboard auto-generates → Admin announces winners
5. All dashboards display correct statistics

---

**Ready to start with Module 1 (Project Scaffolding & Authentication) upon your approval.**
