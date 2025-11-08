# Quick Start Guide - RBAC System

## What Was Implemented

✅ **Two Admin Roles**:
- Super Admin: Sees all students from all centers
- Center Admin: Sees only students from their assigned center

✅ **Schema Changes**:
- Extended User model with `isSuperAdmin` and `assignedCenter` fields
- Added bidirectional relation between Branch and Student

✅ **Custom Controllers**:
- Student `find()` and `findOne()` with automatic filtering
- User profile endpoint for frontend

✅ **Authentication**:
- All student endpoints require authentication (except create)
- JWT-based authentication

## Quick Setup (5 Minutes)

### 1. Rebuild Strapi

```bash
cd d:\workspace\SLA_FINAL_PRODUCT\sla_cms
npm run build
npm run develop
```

### 2. Create Users in Admin Panel

**Super Admin**:
- Go to Settings → Users → Add new user
- Set `isSuperAdmin` = ✅
- Leave `assignedCenter` empty

**Center Admin**:
- Go to Settings → Users → Add new user
- Set `isSuperAdmin` = ❌
- Select an `assignedCenter`

### 3. Set Permissions

- Settings → Users & Permissions → Authenticated
- Enable: Student (find, findOne), User-profile (me)

### 4. Test API

```bash
# Login
curl -X POST http://localhost:1337/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{"identifier":"your-email","password":"your-password"}'

# Get students (automatically filtered by role)
curl http://localhost:1337/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Key Files Modified/Created

```
src/
├── extensions/
│   └── users-permissions/
│       └── content-types/
│           └── user/
│               └── schema.json          # Extended user schema
├── api/
│   ├── branch/
│   │   └── content-types/
│   │       └── branch/
│   │           └── schema.json          # Added student relation
│   ├── student/
│   │   ├── controllers/
│   │   │   └── student.ts               # Custom find/findOne
│   │   └── routes/
│   │       └── student.ts               # Auth requirements
│   └── user-profile/
│       ├── controllers/
│       │   └── user-profile.ts          # Profile endpoint
│       └── routes/
│           └── user-profile.ts          # Profile routes
└── policies/
    └── is-center-admin.ts               # Custom policy
```

## How It Works

### For Super Admin
```
Login → Get JWT → Call /api/students → Returns ALL students
```

### For Center Admin
```
Login → Get JWT → Call /api/students → Returns ONLY students from assigned center
```

### Automatic Filtering
The controller checks:
1. Is user authenticated? → If no, return 401
2. Is user super admin? → If yes, return all students
3. Does user have assigned center? → If yes, filter by that center
4. Otherwise → Return empty list

## Next.js Integration (Minimal)

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api',
});

// Login
export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/local', {
    identifier: email,
    password,
  });
  localStorage.setItem('token', data.jwt);
  return data;
}

// Get students (auto-filtered)
export async function getStudents() {
  const token = localStorage.getItem('token');
  const { data } = await api.get('/students', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// Get user profile
export async function getProfile() {
  const token = localStorage.getItem('token');
  const { data } = await api.get('/user-profile/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
```

## Common Issues

**TypeScript Errors**: Run `npm run build` to regenerate types

**Students Not Filtering**: Check user has `assignedCenter` set

**401 Unauthorized**: Verify JWT token is being sent in headers

**403 Forbidden**: Check permissions in Users & Permissions plugin

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/local` | POST | No | Login |
| `/api/user-profile/me` | GET | Yes | Get current user |
| `/api/students` | GET | Yes | Get students (filtered) |
| `/api/students/:id` | GET | Yes | Get one student (filtered) |
| `/api/students` | POST | No | Create student |
| `/api/students/:id` | PUT | Yes | Update student |
| `/api/students/:id` | DELETE | Yes | Delete student |

## Environment Variables

Add to your Next.js `.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
```

## Testing Checklist

- [ ] Super admin can see all students
- [ ] Center admin sees only their center's students
- [ ] Center admin cannot access other center's students
- [ ] Unauthenticated users get 401
- [ ] Student creation works without auth
- [ ] JWT token expires appropriately

## Full Documentation

See `RBAC_SETUP_GUIDE.md` for complete documentation including:
- Detailed architecture
- Full Next.js integration examples
- Security considerations
- Troubleshooting guide
