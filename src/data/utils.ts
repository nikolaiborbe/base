import type { Rider, RiderSkills } from "./types";

export function computeOverall(skills: RiderSkills): number {
  const values = Object.values(skills);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / values.length);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = ((hash % 360) + 360) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

export function sortByOverall(riders: Rider[]): Rider[] {
  return [...riders].sort(
    (a, b) => computeOverall(b.skills) - computeOverall(a.skills)
  );
}
