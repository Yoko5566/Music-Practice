export interface KeyboardNote {
  key: string;
  label: string;
  notation: string;
  frequency: number;
}

export type GameMode = 'free' | 'challenge';
export type ChallengeType = 'level1' | 'ode' | 'bach' | 'recording';
