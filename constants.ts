import { LyricLine, NoteData } from './types';

export const DEFAULT_BPM = 126;
export const MIN_BPM = 80;
export const MAX_BPM = 160;

const PITCH = {
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
};

const note = (
  lyric: string,
  notation: string,
  pitch: number,
  beats = 1,
): NoteData => ({
  lyric,
  notation,
  pitch,
  beats,
  isHigh: notation.endsWith("'"),
});

// This arrangement follows the numbered notation supplied with the original app.
// Longer final notes add phrasing without claiming to reproduce an official score.
export const SONG_DATA: LyricLine[] = [
  {
    id: 1,
    notes: [
      note('我', '5', PITCH.G4),
      note('來', "1'", PITCH.C5),
      note('不', "5'", PITCH.G5),
      note('及', "5'", PITCH.G5),
      note('道', "3'", PITCH.E5),
      note('聲', "2'", PITCH.D5),
      note('不', "1'", PITCH.C5),
      note('安', "2'", PITCH.D5, 2),
    ],
  },
  {
    id: 2,
    notes: [
      note('有', "3'", PITCH.E5),
      note('一', "2'", PITCH.D5),
      note('點', "1'", PITCH.C5),
      note('混', "2'", PITCH.D5),
      note('亂', "3'", PITCH.E5),
      note('有', "2'", PITCH.D5),
      note('點', "1'", PITCH.C5),
      note('緩', '7', PITCH.B4),
      note('慢', "1'", PITCH.C5, 2),
    ],
  },
  {
    id: 3,
    notes: [
      note('才', '6', PITCH.A4),
      note('發', "1'", PITCH.C5),
      note('現', "5'", PITCH.G5),
      note('承', "5'", PITCH.G5),
      note('諾', "3'", PITCH.E5),
      note('是', "2'", PITCH.D5),
      note('謊', "1'", PITCH.C5),
      note('話', "2'", PITCH.D5, 2),
    ],
  },
  {
    id: 4,
    notes: [
      note('你', '5', PITCH.G4),
      note('倒', '6', PITCH.A4),
      note('下', "1'", PITCH.C5),
      note('了', "3'", PITCH.E5),
      note('我', "3'", PITCH.E5),
      note('只', "2'", PITCH.D5),
      note('能', "3'", PITCH.E5),
      note('旁', "5'", PITCH.G5),
      note('觀', "3'", PITCH.E5, 2),
    ],
  },
  {
    id: 5,
    notes: [
      note('我', "3'", PITCH.E5),
      note('越', "2'", PITCH.D5),
      note('來', "3'", PITCH.E5),
      note('越', "1'", PITCH.C5),
      note('愛', '6', PITCH.A4, 2),
      note('愛', "3'", PITCH.E5),
      note('不', "1'", PITCH.C5),
      note('愛', '6', PITCH.A4, 2),
    ],
  },
  {
    id: 6,
    notes: [
      note('都', "3'", PITCH.E5),
      note('成', "1'", PITCH.C5),
      note('為', "2'", PITCH.D5),
      note('我', "2'", PITCH.D5),
      note('們', '5', PITCH.G4),
      note('的', '5', PITCH.G4),
      note('負', "4'", PITCH.F5),
      note('擔', "3'", PITCH.E5, 2),
    ],
  },
  {
    id: 7,
    notes: [
      note('我', '3', PITCH.E4),
      note('想', '6', PITCH.A4),
      note('要', "5'", PITCH.G5),
      note('痛', "5'", PITCH.G5),
      note('快', "3'", PITCH.E5),
      note('的', "2'", PITCH.D5),
      note('離', "1'", PITCH.C5),
      note('開', "2'", PITCH.D5),
      note('我', "3'", PITCH.E5),
      note('的', '5', PITCH.G4),
      note('依', "2'", PITCH.D5),
      note('賴', "1'", PITCH.C5, 3),
    ],
  },
];
