# SETUP GUIDE - Pipe Damage Monitoring System

## What Was Created

A complete Node.js/Express backend with MySQL database for your React frontend.

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          (MySQL connection pool)
│   │   └── initDB.js            (Database initialization script)
│   ├── controllers/
│   │   ├── userController.js    (User auth & management)
│   │   ├── reportController.js  (Report CRUD operations)
│   │   └── notificationController.js  (Notification management)
│   ├── middleware/
│   │   └── auth.js              (JWT authentication & authorization)
│   ├── routes/
│   │   ├── userRoutes.js        (User endpoints)
│   │   ├── reportRoutes.js      (Report endpoints)
│   │   └── notificationRoutes.js (Notification endpoints)
│   └── server.js                (Express app setup)
├── package.json
├── .env                         (Configuration - ready to use)
├── .env.example                 (Template)
└── README.md                    (Full documentation)
```

### Database Tables
1. **users** - User accounts with roles (resident/admin)
2. **reports** - Pipe damage reports with status tracking
3. **notifications** - System notifications for users

## Quick Start (5 minutes)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Initialize Database
```bash
npm run init-db
```

This will:
- Create `pipe_damage_db` database
- Create all tables (users, reports, notifications)
- Create default admin user:
  - Email: `admin@example.com`
  - Password: `admin123`

### 3. Start Backend Server
```bash
npm run dev
```

Output:
```
✓ Server running on http://localhost:5000
✓ Health check: http://localhost:5000/api/health
```

### 4. Start Frontend (in another terminal)
```bash
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Database Initialization

The `npm run init-db` command creates:

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  role ENUM('resident', 'admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'resident',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### Reports Table
```sql
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  status ENUM('Pending', 'Ongoing', 'Fixed') NOT NULL DEFAULT 'Pending',
  submitted_by INT NOT NULL,
  photo_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE
)
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

## API Endpoints Available

### Authentication
- `POST /api/users/register` - Register new resident
- `POST /api/users/login` - Login and get JWT token
- `GET /api/users/:id` - Get user profile

### Reports
- `POST /api/reports` - Submit new report
- `GET /api/reports` - List all reports
- `GET /api/reports/:id` - Get specific report
- `PATCH /api/reports/:id/status` - Update status (admin only)
- `DELETE /api/reports/:id` - Delete report (admin only)

### Notifications
- `GET /api/notifications/user/:userId` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

## Configuration

Edit `.env` file to customize:

```env
DB_HOST=localhost          # MySQL host
DB_USER=root               # MySQL user
DB_PASSWORD=               # MySQL password
DB_NAME=pipe_damage_db     # Database name
DB_PORT=3306               # MySQL port
PORT=5000                  # Server port
JWT_SECRET=your_secret     # Change in production!
NODE_ENV=development       # or production
```

## Frontend Integration

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed instructions on:
- Connecting frontend to backend
- Updating React components
- Handling authentication
- Submitting and retrieving data

## Test Accounts

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### Create a Resident Account
- Register through `/register` route
- Role will automatically be set to 'resident'

## Testing Endpoints (curl)

### Register
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "address": "123 Main St"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Report
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "description": "Large pipe leak",
    "location": "Building A",
    "submittedBy": 1
  }'
```

## Features Implemented

✅ User registration and authentication
✅ JWT token-based security
✅ Role-based access control (Admin/Resident)
✅ Report submission and tracking
✅ Automatic notifications
✅ MySQL database integration
✅ Secure password hashing
✅ Error handling and validation
✅ CORS enabled for frontend communication

## Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
Solution: Ensure MySQL is running

**Windows:**
- Start MySQL from Services or use: `net start MySQL80`

**Mac/Linux:**
- Start MySQL: `mysql.server start` or use system services

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
Solution: Change PORT in .env or kill the process

### Database Not Created
```
npm run init-db
```
Run this to initialize the database

## Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET in .env
- [ ] Update DB_PASSWORD with strong credentials
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS instead of HTTP
- [ ] Enable database backups
- [ ] Implement rate limiting
- [ ] Add logging and monitoring
- [ ] Set up proper error handling
- [ ] Use environment-specific configurations
- [ ] Implement CORS whitelist

## File Locations

- **Backend Server**: `backend/src/server.js`
- **Database Config**: `backend/src/config/database.js`
- **API Controllers**: `backend/src/controllers/`
- **API Routes**: `backend/src/routes/`
- **Environment**: `backend/.env`
- **Documentation**: `backend/README.md`

## Next Steps

1. ✅ Backend setup complete
2. Update frontend components (see INTEGRATION_GUIDE.md)
3. Test API endpoints
4. Add input validation
5. Implement image upload
6. Add WebSocket for real-time notifications
7. Deploy to production

## Support

For detailed API documentation, see [backend/README.md](backend/README.md)
For frontend integration steps, see [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

---

Created: April 13, 2026
Backend Version: 1.0.0
