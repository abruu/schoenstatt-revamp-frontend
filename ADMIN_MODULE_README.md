# Institution Admin Module

A comprehensive admin module for managing student registrations with institution-specific access control.

## Features

### 🔐 Authentication & Authorization
- **Institution-specific admin accounts** with email/password authentication
- **Role-based access control** (admin vs super_admin)
- **Automatic filtering** - admins see only their center's students
- **Secure Row Level Security (RLS)** policies in Supabase

### 👥 Student Management
- **Complete CRUD operations** (Create, Read, Update, Delete)
- **Advanced search** by name, email, or Aadhaar number
- **Course level filtering** (Beginner, Intermediate, Advanced, Expert)
- **Pagination** for large datasets
- **Photo upload/download** functionality

### 📊 Dashboard Features
- **Student statistics** overview
- **Responsive data table** with sorting
- **Export to CSV** functionality
- **Print-friendly** student forms
- **Audit logging** for all changes

## Admin Accounts

| Email | Center | Role | Access |
|-------|--------|------|--------|
| thrissur@sla.com | Thrissur | admin | Thrissur students only |
| chalakudy@sla.com | Chalakudy | admin | Chalakudy students only |
| peravoor@sla.com | Peravoor | admin | Peravoor students only |
| superadmin@sla.com | All | super_admin | All centers |

## Setup Instructions

### 1. Database Setup
Run the SQL commands in `supabase-setup.sql` to create:
- `centers` table with institution data
- `registrations` table with student data
- `admin_users` table for admin management
- `audit_logs` table for change tracking
- RLS policies for secure access

### 2. Authentication Setup
In Supabase Auth dashboard:
1. Create admin user accounts with the emails above
2. Set secure passwords for each account
3. Ensure email confirmation is disabled for admin accounts

### 3. Storage Setup
1. Create a storage bucket named `photos`
2. Set bucket to private access
3. Configure storage policies for authenticated uploads

### 4. Environment Variables
Copy `env-template.txt` to `.env.local` and configure:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

### Admin Login
Navigate to `/admin/login` and sign in with institution credentials.

### Dashboard Navigation
- **Dashboard**: `/admin/dashboard` - Main student list view
- **Student Details**: `/admin/students/[id]` - View individual student
- **Edit Student**: `/admin/students/[id]/edit` - Modify student data
- **Add Student**: `/admin/students/new` - Register new student

### Key Actions
- **Search**: Use the search bar to find students by name, email, or Aadhaar
- **Filter**: Filter by course level using the dropdown
- **Export**: Download student data as CSV
- **Print**: Generate print-friendly student forms
- **Photo Management**: Upload, view, and download student photos

## Security Features

### Row Level Security (RLS)
- Admins can only access students from their assigned center
- Super admins have access to all centers
- All database operations are automatically filtered

### Audit Logging
- All student data changes are logged
- Tracks who made changes and when
- Stores both old and new data for comparison

### Photo Security
- Photos stored in private Supabase storage bucket
- Signed URLs with expiration for secure access
- Download functionality with proper authentication

## Database Schema

### Students Table (registrations)
```sql
- id: UUID (Primary Key)
- first_name: TEXT
- last_name: TEXT
- date_of_birth: DATE
- email: TEXT (Unique)
- phone: TEXT (Unique)
- address: TEXT
- parent_name: TEXT
- parent_contact: TEXT
- aadhaar_number: TEXT
- center: TEXT (Foreign Key to centers.id)
- course_level: TEXT
- photo_path: TEXT
- created_at: TIMESTAMPTZ
```

### Admin Users Table
```sql
- id: UUID (Primary Key)
- email: TEXT (Unique)
- center_id: TEXT (Foreign Key to centers.id)
- role: TEXT ('admin' | 'super_admin')
- created_at: TIMESTAMPTZ
```

## API Integration

The module integrates with existing registration API at `/api/registrations/route.ts` for public student registration while providing admin-specific management capabilities.

## Responsive Design

- **Mobile-friendly** interface
- **Print-optimized** layouts
- **Accessible** UI components
- **Modern design** with Tailwind CSS

## Future Enhancements

- **PDF export** functionality
- **Email notifications** for new registrations
- **Bulk operations** (import/export)
- **Advanced reporting** and analytics
- **Multi-language support**
