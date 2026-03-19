# Software Requirements Specification (SRS)

Project: Vibe (Full-Stack Social Media App)

Version: 1.0

Date: 2026-02-26

Prepared for: Project evaluator

---

## 1. Introduction

### 1.1 Purpose

This document specifies the software requirements for the Vibe application, a full-stack social media platform that provides user authentication, social interactions, messaging, and profile management. The SRS is intended to be a complete and verifiable description of the system for evaluation, development, testing, and maintenance.

### 1.2 Scope

Vibe is a social media application that enables users to register, log in, manage profiles, follow others, view content feeds, and chat in real time. The system consists of:

- A web frontend (React + TypeScript + Vite)
- A backend API (Java 22, Spring Boot 4, Spring Security 6+, JWT HS256)
- A relational database (PostgreSQL, hosted via Supabase)

The system provides REST APIs for authentication, users, follows, and chat, plus WebSocket messaging for real-time chat. Other social features (posts, likes, comments, notifications) are part of the product scope and are represented in this SRS as required functionality, even if some endpoints are currently stubs or partially implemented.

### 1.3 Definitions, Acronyms, and Abbreviations

- API: Application Programming Interface
- JWT: JSON Web Token
- WS: WebSocket
- UI: User Interface
- SRS: Software Requirements Specification

### 1.4 References

- Spring Boot 4 reference documentation
- Spring Security 6+ reference documentation
- Maven reference documentation
- Vite, React, TypeScript documentation

### 1.5 Overview

Section 2 describes the product context. Section 3 lists functional requirements. Section 4 lists non-functional requirements. Sections 5 and 6 describe data, interfaces, and system models. Appendices include assumptions, constraints, and traceability.

---

## 2. Overall Description

### 2.1 Product Perspective

Vibe is a standalone web application with a client-server architecture.

- The frontend is a SPA (single-page application) built with React and TypeScript.
- The backend is a RESTful API with WebSocket messaging.
- The database persists user accounts, profiles, follows, chats, messages, posts, and other social data.

### 2.2 Product Functions (High-Level)

- User registration and login
- JWT-based authentication and authorization
- Profile viewing and editing
- Follow and unfollow users
- Feed browsing (news feed)
- Create and interact with content (posts, likes, comments, shares)
- Real-time chat and messaging
- Notification handling (future or partial)

### 2.3 User Classes and Characteristics

- Guest user: Unauthenticated visitor. Can access only public landing or login/register pages.
- Authenticated user: Main user group. Can view feeds, profiles, follow others, and chat.
- Admin (optional future): May manage content or moderate users.

### 2.4 Operating Environment

- Frontend: modern browsers (Chrome, Edge, Firefox, Safari)
- Backend: Java 22 runtime, Spring Boot 4
- Database: PostgreSQL (Supabase)
- Network: HTTPS for REST APIs, WebSocket over TLS for chat

### 2.5 Design and Implementation Constraints

- Must use Java 22, Spring Boot 4, Spring Security 6+
- JWT authentication with HS256
- PostgreSQL as the primary database
- React + TypeScript + Vite for frontend
- Clean layered architecture and DTO usage

### 2.6 User Documentation

- Basic onboarding within the UI (login/register)
- Inline UI cues and forms
- API documentation (future: OpenAPI)

### 2.7 Assumptions and Dependencies

- Supabase provides stable PostgreSQL hosting
- Users have internet access and a modern browser
- The application will be deployed with HTTPS and secure configuration

---

## 3. Functional Requirements

### 3.1 Authentication and Authorization

**FR-AUTH-001**: The system shall allow users to register via `/api/auth/register`.

**FR-AUTH-002**: The system shall allow users to log in via `/api/auth/login`.

**FR-AUTH-003**: The system shall return a JWT token on successful login or registration.

**FR-AUTH-004**: The system shall restrict access to protected endpoints to authenticated users only.

**FR-AUTH-005**: The system shall validate JWT tokens on each protected request.

### 3.2 User Profile Management

**FR-USER-001**: The system shall allow authenticated users to view their own profile at `/api/users/me`.

**FR-USER-002**: The system shall allow authenticated users to update their profile at `/api/users/me`.

**FR-USER-003**: The system shall provide profile data including id, username, email, bio, and profile image.

**FR-USER-004**: The system shall allow users to view other public profiles (planned).

**FR-USER-005**: The system shall provide a list of chat-available users at `/api/users/chat-available`.

### 3.3 Follow System

**FR-FOLLOW-001**: The system shall allow a user to follow another user via `/api/follows/{userId}`.

**FR-FOLLOW-002**: The system shall allow a user to unfollow another user via `/api/follows/{userId}`.

**FR-FOLLOW-003**: The system shall return follow info (followers, following, isFollowing) via `/api/follows/{userId}`.

**FR-FOLLOW-004**: The system shall prevent duplicate follow relationships.

### 3.4 Posts and Feed

**FR-POST-001**: The system shall allow users to create a post with text and optional media (planned).

**FR-POST-002**: The system shall provide a news feed with pagination (planned).

**FR-POST-003**: The system shall allow viewing posts by a specific user (planned).

**FR-POST-004**: The system shall provide counts for likes, comments, and shares (planned).

### 3.5 Likes and Reactions

**FR-LIKE-001**: The system shall allow users to like or unlike a post (planned).

**FR-LIKE-002**: The system shall return total likes and whether the current user has liked (planned).

### 3.6 Comments

**FR-COMMENT-001**: The system shall allow users to create comments on posts (planned).

**FR-COMMENT-002**: The system shall allow users to delete their comments (planned).

**FR-COMMENT-003**: The system shall return comments in paginated form (planned).

### 3.7 Chat and Messaging

**FR-CHAT-001**: The system shall allow users to create or open a conversation via `/api/chat/conversations`.

**FR-CHAT-002**: The system shall return paginated conversations via `/api/chat/conversations`.

**FR-CHAT-003**: The system shall return messages for a conversation via `/api/chat/conversations/{conversationId}/messages`.

**FR-CHAT-004**: The system shall allow sending messages via `/api/chat/conversations/{conversationId}/messages`.

**FR-CHAT-005**: The system shall allow marking messages as read via `/api/chat/conversations/{conversationId}/read`.

**FR-CHAT-006**: The system shall provide total unread count via `/api/chat/unread-count`.

**FR-CHAT-007**: The system shall support real-time messaging using WebSocket endpoint `/app/chat/{conversationId}`.

### 3.8 Notifications

**FR-NOTIF-001**: The system shall notify users about new messages (implemented via WebSocket).

**FR-NOTIF-002**: The system shall support notifications for follows, likes, and comments (planned).

---

## 4. Non-Functional Requirements

### 4.1 Performance

- **NFR-PERF-001**: The API shall respond to standard requests within 500 ms under normal load.
- **NFR-PERF-002**: Chat messages shall be delivered in real time (target under 1 second).
- **NFR-PERF-003**: Pagination shall be used for lists to reduce payload size.

### 4.2 Scalability

- **NFR-SCAL-001**: The system shall scale horizontally for API requests.
- **NFR-SCAL-002**: The database shall support indexing for query efficiency.

### 4.3 Security

- **NFR-SEC-001**: All authentication shall use JWT with HS256.
- **NFR-SEC-002**: Sensitive data shall not be exposed in API responses.
- **NFR-SEC-003**: Passwords shall be hashed and never stored in plain text.
- **NFR-SEC-004**: WebSocket connections shall be authenticated.

### 4.4 Reliability and Availability

- **NFR-REL-001**: The system shall be available 99% of the time (excluding maintenance).
- **NFR-REL-002**: The system shall not lose chat messages during delivery.

### 4.5 Maintainability

- **NFR-MAINT-001**: The backend shall use layered architecture (controller, service, repository).
- **NFR-MAINT-002**: DTOs shall be used for external responses.
- **NFR-MAINT-003**: Code shall include validation and structured error handling.

### 4.6 Usability

- **NFR-USAB-001**: The UI shall be responsive for mobile and desktop.
- **NFR-USAB-002**: Primary actions (login, follow, message) shall be accessible within 2 clicks.

---

## 5. System Features and Use Cases

### 5.1 User Registration and Login

**Description**: A new user creates an account and receives a JWT token for authenticated access.

**Actors**: Guest user

**Preconditions**: User is not authenticated

**Main Flow**:

1. User enters registration data
2. System validates input
3. System creates user account
4. System returns JWT token

**Alternate Flows**:

- Invalid email or password returns validation errors

**Postconditions**: User has an active account and session token

### 5.2 View and Update Profile

**Description**: User views and edits their profile data.

**Actors**: Authenticated user

**Preconditions**: User is authenticated

**Main Flow**:

1. User requests profile at `/api/users/me`
2. System returns profile details
3. User updates profile fields
4. System saves and returns updated profile

**Postconditions**: Profile data is updated

### 5.3 Follow / Unfollow

**Description**: User follows or unfollows another user.

**Actors**: Authenticated user

**Preconditions**: Target user exists

**Main Flow**:

1. User clicks Follow
2. System creates follow relationship
3. System updates follow counts

**Alternate Flow**:

- If already following, system returns an error or ignores duplicate

**Postconditions**: Follow relationship updated

### 5.4 View Feed

**Description**: User views a feed of posts.

**Actors**: Authenticated user

**Preconditions**: User is authenticated

**Main Flow**:

1. User opens Feed page
2. System returns a list of posts
3. User can like, comment, or share posts

### 5.5 Chat and Messaging

**Description**: User starts a conversation and sends messages.

**Actors**: Authenticated user

**Preconditions**: Both users exist

**Main Flow**:

1. User selects a chat user
2. System creates or retrieves conversation
3. User sends message
4. System persists message and delivers via WebSocket

**Postconditions**: Conversation is updated and stored

---

## 6. External Interface Requirements

### 6.1 User Interfaces

- Login screen with email and password
- Register screen
- Feed page with post cards
- Profile page with stats and follow button
- Chat page with conversations list and messages

### 6.2 REST API Interfaces (Key Endpoints)

**Authentication**

- `POST /api/auth/register`
- `POST /api/auth/login`

**User**

- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/chat-available`

**Follow**

- `POST /api/follows/{userId}`
- `DELETE /api/follows/{userId}`
- `GET /api/follows/{userId}`

**Chat**

- `POST /api/chat/conversations?otherUserId={id}`
- `GET /api/chat/conversations`
- `GET /api/chat/conversations/{conversationId}/messages`
- `POST /api/chat/conversations/{conversationId}/messages`
- `POST /api/chat/conversations/{conversationId}/read`
- `GET /api/chat/unread-count`

### 6.3 WebSocket Interfaces

- Destination: `/app/chat/{conversationId}`
- Queue: `/user/queue/messages`

### 6.4 Database Interfaces

- PostgreSQL database with tables for users, follows, posts, comments, likes, conversations, messages

---

## 7. Data Requirements

### 7.1 Core Entities

- **User**: id, username, email, passwordHash, bio, profileImage, createdAt
- **Follow**: id, followerId, followingId, createdAt
- **Post**: id, authorId, content, mediaUrls, createdAt
- **Comment**: id, postId, userId, content, createdAt
- **Like**: id, postId, userId, createdAt
- **Conversation**: id, participantA, participantB, lastMessageSentAt
- **Message**: id, conversationId, senderId, receiverId, content, createdAt, readAt

### 7.2 Data Integrity Rules

- A user cannot follow themselves
- A user cannot follow the same user multiple times
- Messages must belong to valid conversations
- Comments and likes must reference existing posts

### 7.3 Data Retention

- User accounts persist until deleted
- Messages persist until deleted or archived
- Posts and comments persist until deleted by user or admin

---

## 8. System Models

### 8.1 Logical Architecture

- Presentation Layer: React SPA
- Application Layer: Spring Boot REST API and WebSocket
- Persistence Layer: PostgreSQL with JPA/Hibernate

### 8.2 Sequence Example (Send Message)

1. User sends message from UI
2. Frontend calls `/api/chat/conversations/{id}/messages`
3. Backend saves message in DB
4. Backend pushes message to WebSocket queue
5. Receiver UI displays message instantly

### 8.3 State Model (Follow Relationship)

- Not following -> Following
- Following -> Not following

---

## 9. Quality Attributes

- **Security**: JWT, input validation, role-based access control
- **Performance**: pagination, efficient indexing, caching for user profiles
- **Reliability**: message delivery guarantees and retry for WebSocket
- **Usability**: responsive UI, clear feedback on actions

---

## 10. Verification and Validation

- Unit tests for services and controllers
- Integration tests for auth, follow, and chat APIs
- UI tests for login, feed, profile, and chat flows
- Manual verification of WebSocket real-time delivery

---

## 11. Traceability Matrix (Sample)

| Requirement ID | Feature      | Test Type     |
| -------------- | ------------ | ------------- |
| FR-AUTH-001    | Register     | Integration   |
| FR-AUTH-002    | Login        | Integration   |
| FR-USER-001    | Profile read | Integration   |
| FR-FOLLOW-001  | Follow       | Integration   |
| FR-CHAT-004    | Send message | Integration   |
| NFR-SEC-001    | JWT security | Security test |

---

## 12. Future Enhancements

- Full post, like, and comment workflows
- Rich notifications and push alerts
- Media uploads with CDN support
- Analytics dashboard for engagement

---

## 13. Appendix A: Assumptions

- The application will be deployed with HTTPS and valid TLS certificates
- The environment supports Java 22 and PostgreSQL 14+
- The chat system uses WebSocket for low latency delivery

---

## 14. Appendix B: Open Issues

- Post, comment, and like controllers are pending full implementation
- Notification subsystem is defined but not fully implemented
- Public user profile endpoint specification needs finalization

---

## 15. Appendix C: Glossary

- **Vibe**: The brand term used for likes and engagement metrics
- **Echo**: A share or repost action
- **Aura**: Thematic user profile classification in the UI
