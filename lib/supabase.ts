import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Center {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Student {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  email: string
  phone: string
  address: string
  parent_name: string
  parent_contact: string
  aadhaar_number: string
  center: string
  course_level: string
  photo_path: string
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  center_id: string
  role: 'admin' | 'super_admin'
  created_at: string
}

export interface AuditLog {
  id: string
  table_name: string
  record_id: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  old_data: any
  new_data: any
  admin_email: string
  created_at: string
}

// Helper function to get current admin user
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', user.email)
    .single()

  return adminUser
}

// Helper function to log audit actions
export async function logAuditAction(
  tableName: string,
  recordId: string,
  action: 'INSERT' | 'UPDATE' | 'DELETE',
  oldData?: any,
  newData?: any
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return

  await supabase.from('audit_logs').insert({
    table_name: tableName,
    record_id: recordId,
    action,
    old_data: oldData,
    new_data: newData,
    admin_email: user.email
  })
}
