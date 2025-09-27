import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Center {
  id: string
  name: string
  email: string
}

export function useCenters() {
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCenters() {
      try {
        const { data, error } = await supabase
          .from('centers')
          .select('id, name, email')
          .order('name')

        if (error) throw error

        setCenters(data || [])
      } catch (err) {
        console.error('Error fetching centers:', err)
        setError('Failed to load training centers')
        // Fallback to hardcoded centers if database fails
        setCenters([
          { id: 'thrissur', name: 'SLA-Thrissur Center', email: 'thrissur@sla.com' },
          { id: 'chalakudy', name: 'SLA-Chalakudy Center', email: 'chalakudy@sla.com' },
          { id: 'peravoor', name: 'SLA-Peravoor Center', email: 'peravoor@sla.com' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCenters()
  }, [])

  return { centers, loading, error }
}
