# VibeApp

A full-stack social app with authentication, feed/profile features, follow system, and real-time chat.

## Tech Stack

- Frontend: React 19, TypeScript, Vite, React Router, Axios, SockJS + STOMP
- Backend: Spring Boot 4, Spring Security (JWT), Spring Data JPA, WebSocket/STOMP
- Database: PostgreSQL

## Project Structure

```
VibeApp/
  Backend/     # Spring Boot API + WebSocket server
  Frontend/    # React + TypeScript client
  Database/    # Database-related assets (if added)
```

## Key Features

- JWT-based auth (register/login)
- Protected API routes
- User profile read/update
- Follow/unfollow users
- Conversation and messaging APIs
- Real-time private chat via STOMP over SockJS

## Prerequisites

- Java 21
- Node.js 20+ (or latest LTS)
- npm
- PostgreSQL instance

## Quick Start

### 1. Backend Setup

1. Open a terminal in `Backend`.
2. Configure database and JWT settings in `Backend/src/main/resources/application.yml`.
3. Run the backend:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend runs on `http://localhost:8080`.

### 2. Frontend Setup

1. Open a terminal in `Frontend`.
2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` (default Vite port).

## API and Socket Overview

Base REST URL used by frontend: `http://localhost:8080/api`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/users/{id}/follow`
- `DELETE /api/users/{id}/unfollow`
- `GET /api/users/chat-available`

### Chat

- `POST /api/chat/conversations?otherUserId={id}`
- `GET /api/chat/conversations`
- `GET /api/chat/conversations/{conversationId}/messages`
- `POST /api/chat/conversations/{conversationId}/messages`
- `POST /api/chat/conversations/{conversationId}/read`
- `GET /api/chat/unread-count`

### WebSocket/STOMP

- SockJS endpoint: `/ws`
- App destination prefix: `/app`
- User destination prefix: `/user`
- Send message destination: `/app/chat/{conversationId}`
- Private receive queue: `/user/queue/messages`

## Frontend Routes

- `/login`
- `/register`
- `/`
- `/profile/:id`
- `/chat`
- `/chat/:id`

## Build Commands

Backend package:

```bash
cd Backend
./mvnw clean package
```

Frontend production build:

```bash
cd Frontend
npm run build
```

## Security Notes

- Do not commit real database credentials or JWT secrets in source-controlled config files.
- Move secrets to environment variables or untracked local override files.
- If credentials were already committed, rotate them immediately.

## Suggested Next Improvements

- Add Docker Compose for PostgreSQL + backend + frontend.
- Add `.env.example` files for backend and frontend configuration.
- Add integration tests for auth and chat flows.
