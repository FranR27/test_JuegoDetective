export function toSet(value) {
  if (value instanceof Set) return value;
  return new Set(value ?? []);
}
