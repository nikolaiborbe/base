export interface RiderSkills {
  climbing: number;
  sprinting: number;
  timeTrial: number;
  oneDay: number;
  endurance: number;
  descending: number;
  recovery: number;
}

export type SkillKey = keyof RiderSkills;

export type Specialty = "gc" | "sprinter" | "classics" | "tt" | "allrounder" | "domestique";

export interface Rider {
  id: string;
  name: string;
  team: string;
  nationality: string;
  nationalityName: string;
  age: number;
  weight: number;
  height: number;
  specialty: Specialty;
  grandTourWins: number;
  monumentWins: number;
  skills: RiderSkills;
}

export const SKILL_LABELS: Record<SkillKey, string> = {
  climbing: "Climbing",
  sprinting: "Sprinting",
  timeTrial: "Time Trial",
  oneDay: "One-Day Races",
  endurance: "Endurance",
  descending: "Descending",
  recovery: "Recovery",
};

export const SKILL_COLORS: Record<SkillKey, string> = {
  climbing: "#ef4444",
  sprinting: "#22c55e",
  timeTrial: "#3b82f6",
  oneDay: "#f59e0b",
  endurance: "#8b5cf6",
  descending: "#ec4899",
  recovery: "#06b6d4",
};

export const SPECIALTY_LABELS: Record<Specialty, string> = {
  gc: "GC",
  sprinter: "Sprinter",
  classics: "Classics",
  tt: "Time Trial",
  allrounder: "All-Rounder",
  domestique: "Domestique",
};
