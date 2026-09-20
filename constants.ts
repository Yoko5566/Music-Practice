import { KeyboardNote } from './types';

export const KEYBOARD_NOTES: KeyboardNote[] = [
  { key: 'A', label: 'Do', notation: 'C4', frequency: 261.63 },
  { key: 'S', label: 'Re', notation: 'D4', frequency: 293.66 },
  { key: 'D', label: 'Mi', notation: 'E4', frequency: 329.63 },
  { key: 'F', label: 'Fa', notation: 'F4', frequency: 349.23 },
  { key: 'G', label: 'Sol', notation: 'G4', frequency: 392.0 },
  { key: 'H', label: 'La', notation: 'A4', frequency: 440.0 },
  { key: 'J', label: 'Ti', notation: 'B4', frequency: 493.88 },
  { key: 'K', label: 'Do', notation: 'C5', frequency: 523.25 },
];

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
