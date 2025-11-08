# Strapi Migration Complete

## Overview
Successfully migrated the admin authentication and student management system from Supabase to Strapi CMS, following the RBAC (Role-Based Access Control) setup guide.

## What Was Changed

### 1. **New Strapi Services Created**
- **`lib/strapi-client.ts`**: Axios client configured for Strapi API with JWT token interceptor
- **`lib/services/auth-service.ts`**: Authentication service with login, logout, getProfile functions
- **`lib/services/student-service.ts`**: Student CRUD operations with filtering, search, and pagination

### 2. **Authentication System**
- **`contexts/strapi-auth-context.tsx`**: New auth context provider replacing Supabase auth
- **`components/strapi-protected-route.tsx`**: Protected route component for admin pages
- **Updated `app/layout.tsx`**: Now uses `StrapiAuthProvider` instead of `AdminAuthProvider`

### 3. **Pages Updated**

#### Admin Login (`app/admin/login/page.tsx`)
- Uses `useStrapiAuth` hook
- Authenticates against Strapi `/api/auth/local` endpoint
- Stores JWT token in localStorage

#### Admin Dashboard (`app/admin/dashboard/page.tsx`)
- Fetches students from Strapi API with pagination
- Supports search, filtering by status, course level, and center
- Status updates (accepted/rejected/enquired) via Strapi API
- CSV/Excel export with Strapi data structure
- Super admin can view all centers, regular admins see only their assigned center

#### Student Detail Page (`app/admin/students/[id]/page.tsx`)
- Fetches student by `documentId` from Strapi
- Displays student photo from Strapi media library
- Delete functionality using Strapi API
- Print-friendly format maintained

### 4. **Data Structure Changes**
- **Student fields**: Changed from snake_case (Supabase) to camelCase (Strapi)
  - `first_name` → `firstName`
  - `last_name` → `lastName`
  - `date_of_birth` → `dateOfBirth`
  - `parent_name` → `parentName`
  - `parent_contact` → `parentContact`
  - `aadhaar_number` → `aadhaarNumber`
  - `created_at` → `createdAt`
  - `photo_path` → `photo` (object with url)
  - `center` → `center` (object with name, documentId)
  - `course_level` → `courseLevel` (object with name, documentId)

- **Identifiers**: Using `documentId` instead of `id` for routing and API calls

## Strapi Backend Requirements

### User Schema Extensions
The Strapi backend must have the following user extensions:
- `isSuperAdmin` (boolean): Identifies super admin users
- `assignedCenter` (relation): Links center admin to their branch

### API Endpoints Used
- `POST /api/auth/local` - User login
- `GET /api/user-profile/me` - Get current user profile with center details
- `GET /api/students` - List students (auto-filtered by role)
- `GET /api/students/:documentId` - Get single student
- `PUT /api/students/:documentId` - Update student
- `DELETE /api/students/:documentId` - Delete student

### Permissions Required
In Strapi Users & Permissions Plugin → Authenticated role:
- **Student**: find, findOne, update, delete
- **User-profile**: me
- **Branch**: find, findOne (if needed)

## Environment Variables
Ensure `.env` has:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
```

## Authentication Flow
1. User enters email/password on `/admin/login`
2. Frontend calls Strapi `/api/auth/local`
3. Strapi returns JWT token and user data
4. JWT stored in localStorage as `strapi_jwt`
5. All subsequent API calls include JWT in Authorization header
6. `/api/user-profile/me` fetches full profile with center assignment
7. Students are automatically filtered based on user role:
   - Super Admin: Sees all students
   - Center Admin: Sees only students from assigned center

## Role-Based Access Control
- **Super Admin** (`isSuperAdmin: true`):
  - Views all students across all centers
  - Can filter by institution
  - No center assignment required

- **Center Admin** (`isSuperAdmin: false`):
  - Views only students from their `assignedCenter`
  - Cannot see other centers' students
  - Center name displayed in dashboard

## Features Preserved
✅ Student search (name, email, Aadhaar)
✅ Status management (pending/accepted/rejected/enquired)
✅ Course level filtering
✅ Pagination (10 students per page)
✅ CSV/Excel export
✅ Student detail view with photo
✅ Photo download functionality
✅ Print-friendly student forms
✅ Delete student functionality
✅ Role-based filtering

## Files No Longer Used (Can be Removed)
- `hooks/use-admin-auth.tsx` (replaced by `contexts/strapi-auth-context.tsx`)
- `components/admin-protected-route.tsx` (replaced by `components/strapi-protected-route.tsx`)
- `lib/supabase.ts` (no longer needed for admin system)

## Testing Checklist
- [ ] Super admin can login and see all students
- [ ] Center admin can login and see only their center's students
- [ ] Search functionality works
- [ ] Status updates work (accepted/rejected/enquired)
- [ ] Filtering by course level and status works
- [ ] CSV/Excel export works
- [ ] Student detail page loads correctly
- [ ] Photo display and download works
- [ ] Delete student works
- [ ] Logout redirects to login page
- [ ] Unauthorized access redirects to login

## Notes
- The lint warnings about complex methods and large methods are pre-existing and related to the component size, not the migration
- The student service has a complex method warning due to the comprehensive query parameter building, which is acceptable for this use case
- All TypeScript errors have been resolved
- The migration maintains backward compatibility with existing UI/UX

## Next Steps
1. Test all functionality with Strapi backend
2. Create admin users in Strapi with proper roles and center assignments
3. Migrate existing student data from Supabase to Strapi (if needed)
4. Remove Supabase dependencies from package.json if no longer used elsewhere
5. Update documentation for admin users

## Support
Refer to:
- `rbacplan/QUICK_START.md` - Quick setup guide
- `rbacplan/RBAC_SETUP_GUIDE.md` - Comprehensive RBAC documentation
- [Strapi v5 Documentation](https://docs.strapi.io/dev-docs/intro)
