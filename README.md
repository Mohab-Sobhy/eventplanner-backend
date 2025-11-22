# Event Planner Backend API

A RESTful API for event planning built with Express.js, PostgreSQL, and Clean Architecture principles.

## Features

- User Management (Register, Login)
- Event Management (Create, View, Delete, Invite)
- Response Management (Attendance Status)
- Advanced Search and Filtering

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Response Format**: JSend

## Project Structure

```
src/
├── application/
│   └── usecases/          # Business logic
├── domain/
│   └── entities/          # Domain entities
├── infrastructure/
│   ├── database/          # Database connection
│   └── repositories/      # Data access layer
├── presentation/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   └── routes/             # Route definitions
└── utils/                 # Utility functions
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Set up the database:
- Create a PostgreSQL database
- Run the provided SQL schema to create tables
- Insert initial data for roles and statuses:
  ```sql
  INSERT INTO roles (role) VALUES ('organizer'), ('attendee');
  INSERT INTO statuses (status) VALUES ('Going'), ('Maybe'), ('Not Going');
  ```

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Events

- `POST /api/events` - Create a new event (requires auth)
- `GET /api/events/organized` - Get all events organized by user (requires auth)
- `GET /api/events/invited` - Get all events user is invited to (requires auth)
- `DELETE /api/events/:eventId` - Delete an event (requires auth, organizer only)
- `POST /api/events/:eventId/invite` - Invite a user to an event (requires auth, organizer only)
- `GET /api/events/:eventId/attendees` - Get attendees for an event (requires auth, organizer only)
- `PUT /api/events/:eventId/attendance` - Update attendance status (requires auth)
- `GET /api/events/search` - Search events with filters (requires auth)

## Response Format

All responses follow the JSend format:

**Success:**
```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional message"
}
```

**Fail:**
```json
{
  "status": "fail",
  "data": { "field": "error message" }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Error message",
  "code": 500
}
```

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```




