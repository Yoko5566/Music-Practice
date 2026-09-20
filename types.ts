export interface NoteData {
  lyric: string;
  notation: string; // The numbered notation (e.g., "5", "1'")
  pitch: number;    // Frequency in Hz
  isHigh: boolean;  // If it's a high octave note
  beats: number;   // Rhythmic length used by autoplay
}

export interface LyricLine {
  id: number;
  notes: NoteData[];
}
