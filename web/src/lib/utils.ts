export function formatDistance(d: number | null) {
  if (d === null) return 'Unknown';
  if (d < 1000) return `${d.toFixed(0)} m`;
  return `${(d / 1000).toFixed(0)} km`;
}

export function formatRelativeTime(timestamp: string) {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffInSeconds = (now - then) / 1000;

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return formatUnit(minutes, 'minute');
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return formatUnit(hours, 'hour');
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return formatUnit(days, 'day');
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return formatUnit(weeks, 'week');
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return formatUnit(months, 'month');
  }

  const years = Math.floor(days / 365);
  return formatUnit(years, 'year');
}

function formatUnit(value: number, unit: string) {
  return value === 1 ? `1 ${unit} ago` : `${value} ${unit}s ago`;
}
