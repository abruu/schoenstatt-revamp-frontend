import { 
  Building, 
  Award, 
  Users, 
  BookOpen, 
  MapPin, 
  Calendar,
  LucideIcon 
} from "lucide-react"

// Icon mapping to resolve string names to actual components
export const iconMap: Record<string, LucideIcon> = {
  Building,
  Award,
  Users,
  BookOpen,
  MapPin,
  Calendar,
}

// Helper function to get icon component from string name
export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Building // fallback to Building icon
}
