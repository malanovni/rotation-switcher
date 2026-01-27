
// Add SkillLevel type used by the SkillBadge component
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Group {
  id: string;
  members: number[];
}

export interface ShuffleRound {
  id: string;
  timestamp: Date;
  participantCount: number;
  groups: Group[];
}