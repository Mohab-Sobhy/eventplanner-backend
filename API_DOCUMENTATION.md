# Event Planner API Documentation

All responses follow the JSend format. Authentication is required for all endpoints except `/api/users/register` and `/api/users/login`.

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## User Management APIs

### 1. Register User

**Endpoint:** `POST /api/users/register`

**Description:** Creates a new user account with email and password. Returns user information and JWT token.

**Input:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",        // Optional
  "lastName": "Doe"           // Optional
}
```

**Required Fields:**
- `email` (string): Valid email address
- `password` (string): User password

**Optional Fields:**
- `firstName` (string): User's first name
- `lastName` (string): User's last name

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Error Responses:**

- **400 Bad Request** - Missing required fields:
```json
{
  "status": "fail",
  "data": {
    "email": "Email and password are required"
  }
}
```

- **409 Conflict** - Email already exists:
```json
{
  "status": "fail",
  "data": {
    "email": "User with this email already exists"
  }
}
```

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### 2. Login User

**Endpoint:** `POST /api/users/login`

**Description:** Authenticates a user with email and password. Returns user information and JWT token.

**Input:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Required Fields:**
- `email` (string): User's email address
- `password` (string): User's password

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Responses:**

- **400 Bad Request** - Missing required fields:
```json
{
  "status": "fail",
  "data": {
    "email": "Email and password are required"
  }
}
```

- **401 Unauthorized** - Invalid credentials:
```json
{
  "status": "fail",
  "data": {
    "credentials": "Invalid credentials"
  }
}
```

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Event Management APIs

### 3. Create Event

**Endpoint:** `POST /api/events`

**Description:** Creates a new event. The creator is automatically marked as "organizer" in the event_attendance table.

**Authentication:** Required

**Input:**
```json
{
  "title": "Summer BBQ Party",
  "eventDate": "2024-07-15",
  "eventTime": "18:00:00",
  "location": "Central Park",        // Optional
  "description": "Annual summer gathering"  // Optional
}
```

**Required Fields:**
- `title` (string): Event title
- `eventDate` (string): Event date in YYYY-MM-DD format
- `eventTime` (string): Event time in HH:MM:SS format

**Optional Fields:**
- `location` (string): Event location
- `description` (string): Event description

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Summer BBQ Party",
    "event_date": "2024-07-15",
    "event_time": "18:00:00",
    "location": "Central Park",
    "description": "Annual summer gathering"
  },
  "message": "Event created successfully"
}
```

**Error Responses:**

- **400 Bad Request** - Missing required fields:
```json
{
  "status": "fail",
  "data": {
    "validation": "Title, date, and time are required"
  }
}
```

- **401 Unauthorized** - Missing or invalid token:
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### 4. Get Organized Events

**Endpoint:** `GET /api/events/organized`

**Description:** Retrieves all events where the authenticated user is the organizer (creator).

**Authentication:** Required

**Input:** None (uses authenticated user from JWT token)

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Summer BBQ Party",
      "event_date": "2024-07-15",
      "event_time": "18:00:00",
      "location": "Central Park",
      "description": "Annual summer gathering",
      "role": "organizer"
    },
    {
      "id": 2,
      "title": "Team Meeting",
      "event_date": "2024-08-01",
      "event_time": "14:00:00",
      "location": "Office",
      "description": "Monthly team sync",
      "role": "organizer"
    }
  ]
}
```

**Error Responses:**

- **401 Unauthorized** - Missing or invalid token:
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### 5. Get Invited Events

**Endpoint:** `GET /api/events/invited`

**Description:** Retrieves all events where the authenticated user is invited as an attendee (not organizer).

**Authentication:** Required

**Input:** None (uses authenticated user from JWT token)

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 3,
      "title": "Birthday Party",
      "event_date": "2024-06-20",
      "event_time": "19:00:00",
      "location": "Restaurant",
      "description": "John's birthday celebration",
      "role": "attendee",
      "status": "GOING"
    },
    {
      "id": 4,
      "title": "Conference",
      "event_date": "2024-09-10",
      "event_time": "09:00:00",
      "location": "Convention Center",
      "description": "Tech conference",
      "role": "attendee",
      "status": "MAYBE"
    }
  ]
}
```

**Error Responses:**

- **401 Unauthorized** - Missing or invalid token:
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### 6. Delete Event

**Endpoint:** `DELETE /api/events/:eventId`

**Description:** Deletes an event. Only the organizer (creator) can delete their events. This will cascade delete all related event_attendance records.

**Authentication:** Required

**Path Parameters:**
- `eventId` (integer): ID of the event to delete

**Input:** None

**Success Response (200):**
```json
{
  "status": "success",
  "data": null,
  "message": "Event deleted successfully"
}
```

**Error Responses:**

- **401 Unauthorized** - Missing or invalid token:
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

- **403 Forbidden** - User is not the organizer:
```json
{
  "status": "fail",
  "data": {
    "permission": "Only organizer can delete event"
  }
}
```

- **404 Not Found** - Event doesn't exist:
```json
{
  "status": "fail",
  "data": {
    "event": "Event not found"
  }
}
```

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### 7. Invite User to Event

**Endpoint:** `POST /api/events/:eventId/invite`

**Description:** Invites a user to an event as an attendee. Only the organizer can invite users. The invited user will be marked as "attendee" in the event_attendance table.

**Authentication:** Required

**Path Parameters:**
- `eventId` (integer): ID of the event

**Input:**
```json
{
  "userId": 5
}
```

**Required Fields:**
- `userId` (integer): ID of the user to invite

**Success Response (200):**
```json
{
  "status": "success",
  "data": null,
  "message": "User invited successfully"
}
```

**Error Responses:**

- **400 Bad Request** - Missing userId:
```json
{
  "status": "fail",
  "data": {
    "userId": "User ID is required"
  }
}
```

- **401 Unauthorized** - Missing or invalid token:
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

- **403 Forbidden** - User is not the organizer:
```json
{
  "status": "fail",
  "data": {
    "permission": "Only organizer can invite users"
  }
}
```

- **404 Not Found** - Event or user doesn't exist:
```json
{
  "status": "fail",
  "data": {
    "resource": "Event not found"
  }
}
```

- **409 Conflict** - User already invited:
```json
{
  "status": "fail",
  "data": {
    "invitation": "User is already invited to this event"
  }
}
```

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Response Management APIs

### 8. Update Attendance Status

**Endpoint:** `PUT /api/events/:eventId/attendance`

**Description:** Updates the attendance status for the authenticated user for a specific event. Valid statuses are: "Going", "Maybe", "Not Going".

**Authentication:** Required

**Path Parameters:**
- `eventId` (integer): ID of the event

**Input:**
```json
{
  "status": "Going"
}
```

**Required Fields:**
- `status` (string): One of "Going", "Maybe", "Not Going"

**Success Response (200):**
```json
{
  "status": "success",
  "data": null,
  "message": "Attendance status updated successfully"
}
```

**Error Responses:**

- **400 Bad Request** - Missing or invalid status:
```json
{
  "status": "fail",
  "data": {
    "status": "Status is required"
  }
}
```

or

```json
{
  "status": "fail",
  "data": {
    "status": "Status must be one of: Going, Maybe, Not Going"
  }
}
```

- **401 Unauthorized** - Missing or invalid token:
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

- **404 Not Found** - Event doesn't exist:
```json
{
  "status": "fail",
  "data": {
    "event": "Event not found"
  }
}
```

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### 9. Get Event Attendees

**Endpoint:** `GET /api/events/:eventId/attendees`

**Description:** Retrieves the list of all attendees (including organizer) for a specific event with their attendance statuses. Only the organizer can view this list.

**Authentication:** Required

**Path Parameters:**
- `eventId` (integer): ID of the event

**Input:** None

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "email": "organizer@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "organizer",
      "status": null,
      "invited_at": "2024-06-01T10:00:00.000Z"
    },
    {
      "id": 5,
      "email": "attendee@example.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "role": "attendee",
      "status": "GOING",
      "invited_at": "2024-06-02T14:30:00.000Z"
    },
    {
      "id": 7,
      "email": "another@example.com",
      "first_name": "Bob",
      "last_name": "Johnson",
      "role": "attendee",
      "status": "MAYBE",
      "invited_at": "2024-06-02T15:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

- **401 Unauthorized** - Missing or invalid token:
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

- **403 Forbidden** - User is not the organizer:
```json
{
  "status": "fail",
  "data": {
    "permission": "Only organizer can view attendees"
  }
}
```

- **404 Not Found** - Event doesn't exist:
```json
{
  "status": "fail",
  "data": {
    "event": "Event not found"
  }
}
```

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Search and Filtering API

### 10. Search Events

**Endpoint:** `GET /api/events/search`

**Description:** Advanced search API to filter events based on keywords (searches in event names, descriptions, and locations), dates, and user roles. Returns events that match the authenticated user's participation.

**Authentication:** Required

**Query Parameters:**
- `keywords` (string, optional): Search keywords to match against event title, description, or location (case-insensitive partial match)
- `startDate` (string, optional): Filter events from this date onwards (YYYY-MM-DD format)
- `endDate` (string, optional): Filter events up to this date (YYYY-MM-DD format)
- `role` (string, optional): Filter by user's role in the event ("organizer" or "attendee")

**Input:** None (all parameters are query strings)

**Example Request:**
```
GET /api/events/search?keywords=party&startDate=2024-07-01&endDate=2024-08-31&role=attendee
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Summer BBQ Party",
      "event_date": "2024-07-15",
      "event_time": "18:00:00",
      "location": "Central Park",
      "description": "Annual summer gathering",
      "role": "attendee",
      "status": "GOING"
    },
    {
      "id": 3,
      "title": "Birthday Party",
      "event_date": "2024-07-20",
      "event_time": "19:00:00",
      "location": "Restaurant",
      "description": "John's birthday celebration",
      "role": "attendee",
      "status": "MAYBE"
    }
  ]
}
```

**Error Responses:**

- **401 Unauthorized** - Missing or invalid token:
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

- **500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

**Search Examples:**

1. Search by keywords only:
   ```
   GET /api/events/search?keywords=meeting
   ```

2. Search by date range:
   ```
   GET /api/events/search?startDate=2024-07-01&endDate=2024-08-31
   ```

3. Search by role:
   ```
   GET /api/events/search?role=organizer
   ```

4. Combined search:
   ```
   GET /api/events/search?keywords=party&startDate=2024-07-01&role=attendee
   ```

---

## Health Check

### 11. Health Check

**Endpoint:** `GET /health`

**Description:** Simple health check endpoint to verify the API is running.

**Authentication:** Not required

**Input:** None

**Success Response (200):**
```json
{
  "status": "ok",
  "message": "Event Planner API is running"
}
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Authentication required"
}
```
or
```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

### 404 Not Found (Route)
```json
{
  "status": "error",
  "message": "Route not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Notes

1. All dates should be in `YYYY-MM-DD` format
2. All times should be in `HH:MM:SS` format (24-hour)
3. JWT tokens are valid for 7 days by default (configurable via `JWT_EXPIRES_IN`)
4. All authenticated endpoints require the `Authorization: Bearer <token>` header
5. User IDs and Event IDs are integers
6. The organizer role is automatically assigned when creating an event
7. Only organizers can delete events, invite users, and view attendees list
8. Search is case-insensitive and uses partial matching (LIKE with %)



