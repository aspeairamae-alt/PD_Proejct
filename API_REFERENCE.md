# API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
Include JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## User Endpoints

### Register
Create a new user account.

**Request:**
```
POST /users/register
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "address": "123 Main Street",
  "role": "resident"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

**Status Codes:**
- `201` - User registered successfully
- `400` - Missing required fields or email already exists
- `500` - Server error

---

### Login
Authenticate user and receive JWT token.

**Request:**
```
POST /users/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main Street",
    "role": "resident"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

### Get User Profile
Retrieve user account information.

**Request:**
```
GET /users/:id
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path) - User ID

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main Street",
  "role": "resident",
  "created_at": "2026-04-13T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - User found
- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

---

## Report Endpoints

### Create Report
Submit a new pipe damage report.

**Request:**
```
POST /reports
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "description": "Large crack in water pipe, actively leaking",
  "location": "Building A, Floor 2, near kitchen",
  "submittedBy": 1
}
```

**Response:**
```json
{
  "id": 5,
  "message": "Report created successfully"
}
```

**Status Codes:**
- `201` - Report created successfully
- `400` - Missing required fields
- `401` - Unauthorized
- `500` - Server error

---

### Get All Reports
Retrieve list of all reports with optional filtering.

**Request:**
```
GET /reports?status=Pending&submittedBy=1
```

**Query Parameters:**
- `status` (optional) - Filter by status: `Pending`, `Ongoing`, or `Fixed`
- `submittedBy` (optional) - Filter by user ID

**Response:**
```json
[
  {
    "id": 1,
    "description": "Large crack in water pipe",
    "location": "Building A, Floor 2",
    "status": "Pending",
    "submitted_by": 1,
    "submitterName": "John Doe",
    "photo_path": null,
    "created_at": "2026-04-13T10:00:00.000Z",
    "updated_at": "2026-04-13T10:00:00.000Z"
  },
  {
    "id": 2,
    "description": "Corroded pipe section",
    "location": "Building B, Basement",
    "status": "Ongoing",
    "submitted_by": 2,
    "submitterName": "Jane Smith",
    "photo_path": null,
    "created_at": "2026-04-13T11:00:00.000Z",
    "updated_at": "2026-04-13T11:30:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Get Report by ID
Retrieve specific report details.

**Request:**
```
GET /reports/:id
```

**Parameters:**
- `id` (path) - Report ID

**Response:**
```json
{
  "id": 1,
  "description": "Large crack in water pipe",
  "location": "Building A, Floor 2",
  "status": "Pending",
  "submitted_by": 1,
  "submitterName": "John Doe",
  "photo_path": null,
  "created_at": "2026-04-13T10:00:00.000Z",
  "updated_at": "2026-04-13T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Report found
- `404` - Report not found
- `500` - Server error

---

### Update Report Status
Update the status of a report (Admin only).

**Request:**
```
PATCH /reports/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Parameters:**
- `id` (path) - Report ID

**Body:**
```json
{
  "status": "Ongoing"
}
```

**Status Values:**
- `Pending` - Initial state
- `Ongoing` - Currently being worked on
- `Fixed` - Issue resolved

**Response:**
```json
{
  "message": "Report status updated successfully"
}
```

**Status Codes:**
- `200` - Status updated
- `400` - Invalid status
- `401` - Unauthorized
- `403` - Admin access required
- `404` - Report not found
- `500` - Server error

---

### Delete Report
Delete a report (Admin only).

**Request:**
```
DELETE /reports/:id
Authorization: Bearer <admin-token>
```

**Parameters:**
- `id` (path) - Report ID

**Response:**
```json
{
  "message": "Report deleted successfully"
}
```

**Status Codes:**
- `200` - Report deleted
- `401` - Unauthorized
- `403` - Admin access required
- `404` - Report not found
- `500` - Server error

---

## Notification Endpoints

### Get Notifications
Retrieve user notifications.

**Request:**
```
GET /notifications/user/:userId?isRead=false
Authorization: Bearer <token>
```

**Parameters:**
- `userId` (path) - User ID
- `isRead` (query, optional) - Filter by read status: `true` or `false`

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "message": "New report submitted: \"Large crack in pipe\" at Building A, Floor 2",
    "is_read": false,
    "created_at": "2026-04-13T10:00:00.000Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "message": "Report #5 status updated to Ongoing",
    "is_read": true,
    "created_at": "2026-04-13T11:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### Mark Notification as Read
Mark a notification as read.

**Request:**
```
PATCH /notifications/:id/read
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path) - Notification ID

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - Notification not found
- `500` - Server error

---

### Delete Notification
Delete a notification.

**Request:**
```
DELETE /notifications/:id
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path) - Notification ID

**Response:**
```json
{
  "message": "Notification deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - Notification not found
- `500` - Server error

---

## Health Check

### Server Status
Check if the server is running.

**Request:**
```
GET /health
```

**Response:**
```json
{
  "status": "Server is running"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Description of the error"
}
```

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Missing required fields | Ensure all required fields are provided |
| 401 | Access token required | Include JWT token in Authorization header |
| 403 | Invalid or expired token | Log in again to get a new token |
| 403 | Admin access required | Only admins can perform this action |
| 404 | Resource not found | Check the ID parameter |
| 500 | Internal server error | Check server logs for details |

---

## Example Requests

### Complete Login Flow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "securepass123",
    "address": "456 Oak Lane"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securepass123"
  }'

# Response includes token...
# TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Submit Report
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description": "Water leaking from connection",
    "location": "Basement",
    "submittedBy": 1
  }'
```

### Admin Workflow

```bash
# 1. Admin Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# TOKEN="admin_token..."

# 2. Get Reports
curl http://localhost:5000/api/reports

# 3. Update Status
curl -X PATCH http://localhost:5000/api/reports/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "Ongoing"}'
```

---

## Rate Limiting

Currently not implemented. Consider adding for production.

## Pagination

Currently not implemented. All results are returned. Consider adding pagination for large datasets.

## Sorting

Results are sorted by `created_at` in descending order (newest first).
