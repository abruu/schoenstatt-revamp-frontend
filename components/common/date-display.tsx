'use client';

import { Calendar } from 'lucide-react';
import { formatDate, formatShortDate, formatRelativeTime } from '@/lib/utils/date-formatter';

interface DateDisplayProps {
  date: string | Date | undefined;
  format?: 'full' | 'short' | 'relative';
  showIcon?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

/**
 * A reusable component for displaying formatted dates
 */
export function DateDisplay({
  date,
  format = 'full',
  showIcon = true,
  className = 'flex items-center gap-1 text-xs text-gray-400',
  iconClassName = 'h-3 w-3',
  textClassName = '',
}: DateDisplayProps) {
  if (!date) return null;
  
  let formattedDate: string;
  
  switch (format) {
    case 'short':
      formattedDate = formatShortDate(date);
      break;
    case 'relative':
      formattedDate = formatRelativeTime(date);
      break;
    case 'full':
    default:
      formattedDate = formatDate(date);
      break;
  }
  
  return (
    <div className={className}>
      {showIcon && <Calendar className={iconClassName} />}
      <span className={textClassName}>{formattedDate}</span>
    </div>
  );
}
