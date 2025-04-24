/**
 * Format a date for display
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (dateOnly.getTime() === today.getTime()) {
    // Today, show time only
    return formatTime(date);
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    // Yesterday, show "Yesterday" and time
    return `Yesterday, ${formatTime(date)}`;
  } else if (now.getFullYear() === date.getFullYear()) {
    // Same year, show month and day
    return `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}, ${formatTime(date)}`;
  } else {
    // Different year, show full date
    return date.toLocaleDateString(undefined, { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  }
}

/**
 * Format a time for display
 * @param date Date to format
 * @returns Formatted time string
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { 
    hour: "numeric", 
    minute: "2-digit",
    hour12: true 
  });
}
