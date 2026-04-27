# Pipe Damage Monitoring System - Backend

A Node.js/Express backend for a pipe damage reporting and monitoring system with MySQL database.

## Features

- **User Authentication**: Register and login for residents and admins
- **Report Management**: Create, read, update, and delete pipe damage reports
- **Notification System**: Automated notifications for report submissions and status updates
- **Role-Based Access**: Different access levels for residents and administrators
- **JWT Authentication**: Secure token-based authentication

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User name
- `email` - Unique email address
- `password` - Hashed password
- `address` - User address
- `role` - 'resident' or 'admin'
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Reports Table
- `id` - Primary key
- `description` - Report description
- `location` - Location of the pipe damage
- `status` - 'Pending', 'Ongoing', or 'Fixed'
- `submitted_by` - Foreign key to Users
- `photo_path` - Path to uploaded photo (optional)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Notifications Table
- `id` - Primary key
- `user_id` - Foreign key to Users
- `message` - Notification message
- `is_read` - Boolean flag
- `created_at` - Timestamp

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

4. **Configure .env file**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=pipe_damage_db
   DB_PORT=3306
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   NODE_ENV=development
   ```

5. **Initialize the database**
   ```bash
   npm run init-db
   ```
   This will:
   - Create the database
   - Create all necessary tables
   - Create a default admin user (email: admin@example.com, password: admin123)

6. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

## API Endpoints

### User Endpoints

- **POST** `/api/users/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "address": "123 Main St",
    "role": "resident"
  }
  ```

- **POST** `/api/users/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
  Returns JWT token

- **GET** `/api/users/:id` - Get user by ID (requires authentication)

### Report Endpoints

- **POST** `/api/reports` - Create new report (requires authentication)
  ```json
  {
    "description": "Large crack in pipe",
    "location": "Building A, Floor 2",
    "submittedBy": 1
  }
  ```

- **GET** `/api/reports` - Get all reports (optional filters: status, submittedBy)
  ```
  /api/reports?status=Pending
  /api/reports?submittedBy=1
  ```

- **GET** `/api/reports/:id` - Get report by ID

- **PATCH** `/api/reports/:id/status` - Update report status (admin only)
  ```json
  {
    "status": "Ongoing"
  }
  ```

- **DELETE** `/api/reports/:id` - Delete report (admin only)

### Notification Endpoints

- **GET** `/api/notifications/user/:userId` - Get notifications for user (requires authentication)
  ```
  /api/notifications/user/1?isRead=false
  ```

- **PATCH** `/api/notifications/:id/read` - Mark notification as read (requires authentication)

- **DELETE** `/api/notifications/:id` - Delete notification (requires authentication)

## Usage Examples

### Register a User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",  
    "email": "jane@example.com",
    "password": "securepass123",
    "address": "456 Oak Ave",
    "role": "resident"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "securepass123"
  }'
```

### Create Report
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Water leaking from pipe connection",
    "location": "Basement near furnace",
    "submittedBy": 2
  }'
```

### Get All Reports
```bash
curl http://localhost:5000/api/reports
```

### Update Report Status (Admin)
```bash
curl -X PATCH http://localhost:5000/api/reports/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{"status": "Ongoing"}'
```

## Security Notes

1. **Change default admin password**: After first login, update the admin password in the database
2. **Update JWT_SECRET**: Use a strong, unique secret key in production
3. **HTTPS**: Always use HTTPS in production
4. **Environment Variables**: Never commit .env file to version control
5. **Password Hashing**: All passwords are hashed using bcryptjs

## Running the Backend

**For development (with auto-reload):**
```bash
npm run dev
```

**For production:**
```bash
npm start
```

## Connecting to Frontend

Update your frontend API calls to point to the backend:
```javascript
const API_URL = 'http://localhost:5000/api';

// Example: Login
const response = await fetch(`${API_URL}/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check DB_HOST, DB_USER, and DB_PASSWORD in .env
- Verify database credentials are correct

### Port Already in Use
- Change PORT in .env file
- Or kill process using the port

### JWT Authentication Error
- Ensure token is sent in format: `Bearer <token>`
- Check if token has expired
- Verify JWT_SECRET matches server configuration

## Future Enhancements

- [ ] File upload for report photos
- [ ] Advanced filtering and search
- [ ] Report analytics and statistics
- [ ] Email notifications
- [ ] Rate limiting
- [ ] API documentation (Swagger/OpenAPI)

## License

ISC
