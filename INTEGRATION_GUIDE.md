# Frontend-Backend Integration Guide

This guide shows how to update your React frontend to communicate with the Node.js backend.

## Step 1: Set Backend API URL

Create a new file [src/config/api.ts](src/config/api.ts) in your frontend:

```typescript
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // User endpoints
  REGISTER: `${API_URL}/users/register`,
  LOGIN: `${API_URL}/users/login`,
  GET_USER: `${API_URL}/users`,
  
  // Report endpoints
  CREATE_REPORT: `${API_URL}/reports`,
  GET_REPORTS: `${API_URL}/reports`,
  GET_REPORT: `${API_URL}/reports`,
  UPDATE_REPORT_STATUS: `${API_URL}/reports`,
  
  // Notification endpoints
  GET_NOTIFICATIONS: `${API_URL}/notifications/user`,
  MARK_NOTIFICATION_READ: `${API_URL}/notifications`,
};
```

## Step 2: Update UserContext

Modify [src/context/UserContext.tsx](src/context/UserContext.tsx):

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface User {
  id: number;
  name: string;
  email: string;
  address?: string;
  role: 'resident' | 'admin';
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const login = async (email: string, password: string) => {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  const register = async (data: any) => {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
```

## Step 3: Update ReportsContext

Modify [src/context/ReportsContext.tsx](src/context/ReportsContext.tsx):

```typescript
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

export interface Report {
  id: number;
  description: string;
  location: string;
  status: 'Pending' | 'Ongoing' | 'Fixed';
  submittedBy: number;
  submitterName?: string;
  created_at?: string;
}

interface Notification {
  id: number;
  message: string;
}

interface ReportsContextType {
  reports: Report[];
  notifications: Notification[];
  addReport: (report: Omit<Report, 'id'>) => Promise<void>;
  updateReportStatus: (id: number, status: Report['status']) => Promise<void>;
  fetchReports: () => Promise<void>;
  fetchNotifications: (userId: number) => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getToken = () => localStorage.getItem('token');

  const fetchReports = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_REPORTS);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchNotifications = async (userId: number) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_ENDPOINTS.GET_NOTIFICATIONS}/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const addReport = async (report: Omit<Report, 'id'>) => {
    try {
      const token = getToken();
      const response = await fetch(API_ENDPOINTS.CREATE_REPORT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      await fetchReports();
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  };

  const updateReportStatus = async (id: number, status: Report['status']) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_ENDPOINTS.UPDATE_REPORT_STATUS}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update report');
      }

      await fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        notifications,
        addReport,
        updateReportStatus,
        fetchReports,
        fetchNotifications,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
```

## Step 4: Update Login Component

Update [src/app/components/Login.tsx](src/app/components/Login.tsx) to use the backend:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/resident/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Resident Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003366] text-white py-2 rounded hover:bg-[#004488]"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>Don't have an account? <a href="/register" className="text-blue-600">Register</a></p>
          <p><a href="/admin-login" className="text-blue-600">Admin Login</a></p>
        </div>
      </div>
    </div>
  );
}
```

## Step 5: Setup Environment Variables

Create [.env.local](../frontend/.env.local) in the frontend:

```
VITE_API_URL=http://localhost:5000/api
```

## Running Both Services

**Terminal 1 - Start Backend:**
```bash
cd backend
npm install
npm run init-db
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:5000`.

## Testing the Integration

1. Open http://localhost:5173
2. Register a new account
3. Login with your credentials
4. Submit a report
5. Check backend database for stored data
6. Use admin account (admin@example.com / admin123) to update report status

## Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Ensure backend has CORS enabled |
| Connection refused | Check if backend is running on port 5000 |
| Auth token missing | Verify token is stored in localStorage |
| Wrong credentials | Check database for correct admin credentials |

## Next Steps

- Add form validation on frontend
- Implement password hashing on registration
- Add image upload functionality
- Implement real-time notifications using WebSockets
- Add loading states and error boundaries
