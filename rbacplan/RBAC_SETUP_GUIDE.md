# Role-Based Access Control (RBAC) Setup Guide

## Overview

This guide explains the RBAC system implemented in your Strapi v5 CMS with two admin roles:
- **Super Admin**: Can view and manage all students across all centers
- **Center Admin**: Can only view and manage students from their assigned center

## Architecture Changes

### 1. Schema Updates

#### User Schema Extension
**File**: `src/extensions/users-permissions/content-types/user/schema.json`

Added two new fields:
- `isSuperAdmin` (boolean): Identifies if user is a super admin
- `assignedCenter` (relation): Links center admin to their branch

#### Branch Schema Update
**File**: `src/api/branch/content-types/branch/schema.json`

Added bidirectional relation:
- `branch_students`: One-to-many relation with students

### 2. Custom Controllers

#### Student Controller
**File**: `src/api/student/controllers/student.ts`

Implements two custom methods:

**`find()`**: Filters students based on user role
- Super Admin: Returns all students
- Center Admin: Returns only students from assigned center
- Unauthenticated: Returns 401 error

**`findOne()`**: Validates access to individual student
- Super Admin: Can access any student
- Center Admin: Can only access students from their center
- Returns 403 if center admin tries to access student from different center

### 3. Routes Configuration

**File**: `src/api/student/routes/student.ts`

- `find`: Requires authentication
- `findOne`: Requires authentication
- `create`: Public (for student registration)
- `update`: Requires authentication
- `delete`: Requires authentication

### 4. Custom API Endpoints

#### User Profile Endpoint
**File**: `src/api/user-profile/controllers/user-profile.ts`

**Endpoint**: `GET /api/user-profile/me`

Returns authenticated user's profile with:
- User details
- Assigned center (with images and gradient)
- Role information

## Setup Instructions

### Step 1: Rebuild Strapi

After making schema changes, rebuild Strapi to regenerate types:

```bash
npm run build
npm run develop
```

### Step 2: Create Admin Users

#### Create Super Admin

1. Go to Strapi Admin Panel → Settings → Users
2. Click "Add new user"
3. Fill in details:
   - Username: `superadmin`
   - Email: `superadmin@example.com`
   - Password: (set secure password)
   - Role: Authenticated
   - **isSuperAdmin**: ✅ Check this
   - **assignedCenter**: Leave empty
4. Save

#### Create Center Admin

1. Go to Strapi Admin Panel → Settings → Users
2. Click "Add new user"
3. Fill in details:
   - Username: `centeradmin1`
   - Email: `centeradmin1@example.com`
   - Password: (set secure password)
   - Role: Authenticated
   - **isSuperAdmin**: ❌ Uncheck this
   - **assignedCenter**: Select a branch
4. Save

### Step 3: Configure Permissions

1. Go to Settings → Users & Permissions Plugin → Roles → Authenticated
2. Enable permissions for:
   - **Student**: find, findOne (create is already public)
   - **User-profile**: me
   - **Branch**: find, findOne (if needed)

### Step 4: Test the System

#### Test Super Admin Access

```bash
# Login as super admin
POST /api/auth/local
{
  "identifier": "superadmin@example.com",
  "password": "your-password"
}

# Get all students (should return all)
GET /api/students
Authorization: Bearer <super-admin-jwt>
```

#### Test Center Admin Access

```bash
# Login as center admin
POST /api/auth/local
{
  "identifier": "centeradmin1@example.com",
  "password": "your-password"
}

# Get students (should return only students from assigned center)
GET /api/students
Authorization: Bearer <center-admin-jwt>
```

## Next.js Integration

### 1. Install Dependencies

```bash
npm install axios
# or
yarn add axios
```

### 2. Create API Client

**File**: `lib/strapi.ts`

```typescript
import axios from 'axios';

const strapiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api',
});

// Add auth token to requests
strapiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('strapi_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default strapiClient;
```

### 3. Authentication Service

**File**: `services/auth.ts`

```typescript
import strapiClient from '@/lib/strapi';

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  isSuperAdmin: boolean;
  assignedCenter?: {
    documentId: string;
    name: string;
    address: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await strapiClient.post('/auth/local', credentials);
    const { jwt, user } = response.data;
    
    // Store JWT
    localStorage.setItem('strapi_jwt', jwt);
    
    return { jwt, user };
  },

  async getProfile(): Promise<User> {
    const response = await strapiClient.get('/user-profile/me');
    return response.data.data;
  },

  logout() {
    localStorage.removeItem('strapi_jwt');
  },

  getToken() {
    return localStorage.getItem('strapi_jwt');
  },
};
```

### 4. Student Service

**File**: `services/students.ts`

```typescript
import strapiClient from '@/lib/strapi';

export interface Student {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  parentName: string;
  parentContact: string;
  aadhaarNumber: string;
  photo?: any;
  center?: {
    documentId: string;
    name: string;
  };
  courseLevel?: {
    documentId: string;
    name: string;
  };
}

export const studentService = {
  async getAll(params?: any) {
    const response = await strapiClient.get('/students', { params });
    return response.data;
  },

  async getOne(documentId: string) {
    const response = await strapiClient.get(`/students/${documentId}`);
    return response.data.data;
  },

  async create(data: Partial<Student>) {
    const response = await strapiClient.post('/students', { data });
    return response.data.data;
  },

  async update(documentId: string, data: Partial<Student>) {
    const response = await strapiClient.put(`/students/${documentId}`, { data });
    return response.data.data;
  },

  async delete(documentId: string) {
    await strapiClient.delete(`/students/${documentId}`);
  },
};
```

### 5. React Context for Auth

**File**: `contexts/AuthContext.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = authService.getToken();
    if (token) {
      authService.getProfile()
        .then(setUser)
        .catch(() => authService.logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (identifier: string, password: string) => {
    const { user } = await authService.login({ identifier, password });
    const profile = await authService.getProfile();
    setUser(profile);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isSuperAdmin = user?.isSuperAdmin || false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 6. Example Login Page

**File**: `app/login/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(identifier, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
```

### 7. Example Students List Page

**File**: `app/dashboard/students/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { studentService, Student } from '@/services/students';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isSuperAdmin } = useAuth();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await studentService.getAll({
        populate: ['center', 'courseLevel', 'photo'],
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="text-sm text-gray-600">
          {isSuperAdmin ? (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">
              Super Admin - All Centers
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
              Center Admin - {user?.assignedCenter?.name}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {students.map((student) => (
          <div key={student.documentId} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-4">
              {student.photo && (
                <img
                  src={student.photo.url}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-gray-600">{student.email}</p>
                <p className="text-sm text-gray-500">
                  Center: {student.center?.name || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{student.phone}</p>
                <p className="text-sm text-gray-500">
                  {student.courseLevel?.name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No students found
        </div>
      )}
    </div>
  );
}
```

## API Endpoints Reference

### Authentication

```
POST /api/auth/local
Body: { "identifier": "email", "password": "password" }
Response: { "jwt": "token", "user": {...} }
```

### User Profile

```
GET /api/user-profile/me
Headers: Authorization: Bearer <jwt>
Response: { "data": { "id", "username", "email", "isSuperAdmin", "assignedCenter": {...} } }
```

### Students

```
# Get all students (filtered by role)
GET /api/students
Headers: Authorization: Bearer <jwt>
Response: { "data": [...], "meta": {...} }

# Get single student
GET /api/students/:documentId
Headers: Authorization: Bearer <jwt>
Response: { "data": {...} }

# Create student (public)
POST /api/students
Body: { "data": {...} }
Response: { "data": {...} }

# Update student
PUT /api/students/:documentId
Headers: Authorization: Bearer <jwt>
Body: { "data": {...} }
Response: { "data": {...} }

# Delete student
DELETE /api/students/:documentId
Headers: Authorization: Bearer <jwt>
```

## Security Considerations

1. **JWT Storage**: Store JWT securely (httpOnly cookies recommended for production)
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Configure appropriate JWT expiration in Strapi settings
4. **CORS**: Configure CORS properly in `config/middlewares.ts`
5. **Rate Limiting**: Implement rate limiting for authentication endpoints

## Troubleshooting

### TypeScript Errors

The TypeScript errors you see are expected after schema changes. They will resolve after:
1. Running `npm run build`
2. Restarting the development server

### Students Not Filtering

If center admins see all students:
1. Verify `isSuperAdmin` field is set correctly
2. Verify `assignedCenter` is populated
3. Check browser console for errors
4. Verify JWT token is being sent in requests

### Permission Denied

If getting 403 errors:
1. Check Users & Permissions Plugin settings
2. Verify Authenticated role has correct permissions
3. Ensure JWT token is valid and not expired

## Next Steps

1. **Add Update/Delete Controls**: Implement center-based filtering for update and delete operations
2. **Admin Panel Customization**: Customize Strapi admin panel to show/hide fields based on role
3. **Audit Logging**: Add logging for all student data access
4. **Email Notifications**: Send notifications when center admins are assigned
5. **Bulk Operations**: Add bulk import/export for students

## Support

For issues or questions, refer to:
- [Strapi v5 Documentation](https://docs.strapi.io/dev-docs/intro)
- [Strapi Discord Community](https://discord.strapi.io)
