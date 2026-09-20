import { KeyboardNote } from './types';

export const KEYBOARD_NOTES: KeyboardNote[] = [
  { key: 'Z', label: 'Do', notation: 'C3', frequency: 130.81 },
  { key: 'X', label: 'Re', notation: 'D3', frequency: 146.83 },
  { key: 'C', label: 'Mi', notation: 'E3', frequency: 164.81 },
  { key: 'V', label: 'Fa', notation: 'F3', frequency: 174.61 },
  { key: 'B', label: 'Sol', notation: 'G3', frequency: 196.0 },
  { key: 'N', label: 'La', notation: 'A3', frequency: 220.0 },
  { key: 'M', label: 'Ti', notation: 'B3', frequency: 246.94 },
  { key: ',', label: 'Do', notation: 'C4', frequency: 261.63 },

  { key: 'A', label: 'Do', notation: 'C4', frequency: 261.63 },
  { key: 'S', label: 'Re', notation: 'D4', frequency: 293.66 },
  { key: 'D', label: 'Mi', notation: 'E4', frequency: 329.63 },
  { key: 'F', label: 'Fa', notation: 'F4', frequency: 349.23 },
  { key: 'G', label: 'Sol', notation: 'G4', frequency: 392.0 },
  { key: 'H', label: 'La', notation: 'A4', frequency: 440.0 },
  { key: 'J', label: 'Ti', notation: 'B4', frequency: 493.88 },
  { key: 'K', label: 'Do', notation: 'C5', frequency: 523.25 },

  { key: 'Q', label: 'Do', notation: 'C5', frequency: 523.25 },
  { key: 'W', label: 'Re', notation: 'D5', frequency: 587.33 },
  { key: 'E', label: 'Mi', notation: 'E5', frequency: 659.25 },
  { key: 'R', label: 'Fa', notation: 'F5', frequency: 698.46 },
  { key: 'T', label: 'Sol', notation: 'G5', frequency: 783.99 },
  { key: 'Y', label: 'La', notation: 'A5', frequency: 880.0 },
  { key: 'U', label: 'Ti', notation: 'B5', frequency: 987.77 },
  { key: 'I', label: 'Do', notation: 'C6', frequency: 1046.5 },
];

export const LOW_ROW_KEYS = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ','] as const;
export const MID_ROW_KEYS = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'] as const;
export const HIGH_ROW_KEYS = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I'] as const;

export const CHALLENGE_LENGTH = 16;
export const LEVEL_ONE_KEYS = 'ASDFGHGHJKKKKJHGGGGHAAAHHHGAAAASDFDSADSASA';
export const DEFAULT_VOLUME = 0.5;

export const createChallenge = (length = CHALLENGE_LENGTH): KeyboardNote[] =>
  Array.from({ length }, () => {
    const index = Math.floor(Math.random() * KEYBOARD_NOTES.length);
    return KEYBOARD_NOTES[index];
  });

export const createLevelOneChallenge = (): KeyboardNote[] =>
  LEVEL_ONE_KEYS.split('').map((key) => {
    const note = KEYBOARD_NOTES.find((item) => item.key === key);
    if (!note) {
      throw new Error(`Unsupported Level 1 key: ${key}`);
    }
    return note;
  });
