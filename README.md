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
# The .env file is already configured for Neon PostgreSQL
# SSL is configured to accept self-signed certificates
```

3. Set up the database:
- The database schema is automatically created when the server starts
- Initial data for roles and statuses is inserted automatically

4. (Optional) Generate SSL certificates for HTTPS:
```bash
npm run generate-ssl
# Then update .env with the certificate paths
```

5. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

## SSL/TLS Configuration

### Database SSL (Already Configured)
The application is configured to connect to Neon PostgreSQL with SSL enabled and accepts self-signed certificates:
- `DB_SSL=true`
- `DB_SSL_REJECT_UNAUTHORIZED=false`

### HTTPS Server (Optional)
To enable HTTPS for the API server:

1. Generate self-signed certificates:
```bash
npm run generate-ssl
```

2. Update your `.env` file:
```env
SSL_CERT_PATH=./ssl/cert.pem
SSL_KEY_PATH=./ssl/private.key
HTTPS_PORT=8443
```

3. Restart the server - it will run both HTTP and HTTPS

### Troubleshooting SSL Issues

**"self-signed certificate" error:**
- **Database connection**: Ensure `DB_SSL_REJECT_UNAUTHORIZED=false` in your `.env`
- **API requests**: If using HTTPS, ensure your client accepts self-signed certificates
- **Database tools**: When connecting with external tools, configure them to accept self-signed certificates

**Database connection issues:**
- Verify your Neon database credentials in `.env`
- Check if your IP is allowlisted in Neon dashboard
- Ensure the database is not paused

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




