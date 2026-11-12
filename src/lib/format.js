const TIME_ZONE = 'America/Argentina/Buenos_Aires';

const dateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: TIME_ZONE,
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const longDayFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

export function formatDateTime(iso) {
  if (!iso) return '';
  return dateTimeFormatter.format(new Date(iso)).replace(/,/g, '');
}

export function formatDate(iso) {
  if (!iso) return '';
  return dateFormatter.format(new Date(iso)).replace(/\./g, '');
}

export function formatShortDate(iso) {
  if (!iso) return '';
  return shortDateFormatter.format(new Date(iso));
}

export function formatTime(iso) {
  if (!iso) return '';
  return timeFormatter.format(new Date(iso));
}

export function formatLongDay(iso) {
  if (!iso) return '';
  return longDayFormatter.format(new Date(iso));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function initials(name) {
  return String(name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function sameDay(a, b) {
  return formatShortDate(a) === formatShortDate(b);
}
