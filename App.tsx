import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Gauge, Music, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { DEFAULT_BPM, MAX_BPM, MIN_BPM, SONG_DATA } from './constants';
import { audioService } from './services/audioService';

const FLAT_NOTES = SONG_DATA.flatMap((line) => line.notes);

interface Ripple {
  x: number;
  y: number;
  id: number;
}

const getLineId = (noteIndex: number) => {
  let count = 0;

  for (const line of SONG_DATA) {
    if (noteIndex >= count && noteIndex < count + line.notes.length) {
      return line.id;
    }
    count += line.notes.length;
  }

  return SONG_DATA[SONG_DATA.length - 1].id;
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [volume, setVolume] = useState(0.5);
  const [isPulsing, setIsPulsing] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pulseTimerRef = useRef<number | null>(null);

  const isFinished = currentIndex >= FLAT_NOTES.length;
  const currentNote = FLAT_NOTES[currentIndex] ?? FLAT_NOTES[FLAT_NOTES.length - 1];
  const activeLineId = getLineId(currentIndex);
  const progress = Math.min(100, (currentIndex / FLAT_NOTES.length) * 100);

  const stopPlayback = useCallback(() => {
    setIsAutoPlaying(false);
    audioService.stopAll();
  }, []);

  const pulse = useCallback(() => {
    setIsPulsing(true);
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => setIsPulsing(false), 120);
  }, []);

  useEffect(() => {
    audioService.setMasterVolume(volume);
  }, [volume]);

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
      }
      audioService.stopAll();
    };
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    if (isFinished) {
      setIsAutoPlaying(false);
      return;
    }

    const note = FLAT_NOTES[currentIndex];
    const beatMs = 60_000 / bpm;
    const noteLengthSeconds = Math.max(0.12, (note.beats * beatMs * 0.85) / 1_000);

    audioService.playTone(note.pitch, noteLengthSeconds);
    pulse();

    const timer = window.setTimeout(() => {
      setCurrentIndex((previous) => Math.min(previous + 1, FLAT_NOTES.length));
    }, note.beats * beatMs);

    return () => window.clearTimeout(timer);
  }, [bpm, currentIndex, isAutoPlaying, isFinished, pulse]);

  const addRipple = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random();
    setRipples((previous) => [...previous.slice(-4), { x, y, id }]);
    window.setTimeout(
      () => setRipples((previous) => previous.filter((ripple) => ripple.id !== id)),
      600,
    );
  }, []);

  const triggerManualNote = useCallback(
    (x?: number, y?: number) => {
      if (isFinished) return;

      stopPlayback();
      const note = FLAT_NOTES[currentIndex];
      audioService.playTone(note.pitch, 0.4);
      pulse();

      if (x !== undefined && y !== undefined) {
        addRipple(x, y);
      }

      setCurrentIndex((previous) => Math.min(previous + 1, FLAT_NOTES.length));
    },
    [addRipple, currentIndex, isFinished, pulse, stopPlayback],
  );

  const resetSong = useCallback(() => {
    stopPlayback();
    setCurrentIndex(0);
  }, [stopPlayback]);

  const toggleAutoPlay = useCallback(() => {
    void audioService.resume();

    if (isAutoPlaying) {
      stopPlayback();
      return;
    }

    if (isFinished) {
      setCurrentIndex(0);
    }
    setIsAutoPlaying(true);
  }, [isAutoPlaying, isFinished, stopPlayback]);

  const stepBack = useCallback(() => {
    stopPlayback();
    setCurrentIndex((previous) => Math.max(0, previous - 1));
  }, [stopPlayback]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === 'INPUT') return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
      }

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        triggerManualNote(window.innerWidth / 2, window.innerHeight / 2);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        stepBack();
      } else if (event.key === ' ') {
        toggleAutoPlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepBack, toggleAutoPlay, triggerManualNote]);

  useEffect(() => {
    const activeElement = document.getElementById(`lyric-line-${activeLineId}`);
    activeElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeLineId]);

  const handlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    triggerManualNote(event.clientX, event.clientY);
  };

  return (
    <div
      className="relative flex h-full w-full touch-none select-none flex-col overflow-hidden bg-slate-950"
      onPointerDown={handlePointerDown}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.35),_transparent_55%)]" />

      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="pointer-events-none absolute z-0 h-5 w-5 rounded-full border-2 border-pink-400/60 bg-pink-500/10 animate-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      <header className="relative z-20 flex shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/75 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-2 shadow-lg shadow-pink-500/20">
            <Music className="text-white" size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-wide text-white">離開我的依賴</h1>
            <p className="text-xs text-slate-400">Tap Mode · Auto Mode</p>
          </div>
        </div>
        <div className="text-right font-mono text-sm text-slate-400">
          <span className="font-bold text-pink-400">{Math.min(currentIndex, FLAT_NOTES.length)}</span>
          <span> / {FLAT_NOTES.length}</span>
        </div>
      </header>

      <div className="relative z-10 h-1 shrink-0 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-4 py-5">
        {isFinished ? (
          <div className="pointer-events-auto space-y-5 text-center" onPointerDown={(event) => event.stopPropagation()}>
            <h2 className="text-4xl font-black text-green-400 drop-shadow-[0_0_18px_rgba(74,222,128,0.35)]">完成！</h2>
            <p className="text-slate-400">共完成 {FLAT_NOTES.length} 個音符</p>
            <button
              type="button"
              onClick={toggleAutoPlay}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-7 py-3 font-bold text-white shadow-xl shadow-pink-600/20 transition active:scale-95"
            >
              <Play size={20} fill="currentColor" />
              從頭播放
            </button>
          </div>
        ) : (
          <>
            <div
              key={currentIndex}
              className={`text-[7.5rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200 drop-shadow-[0_0_30px_rgba(236,72,153,0.45)] transition-transform duration-100 md:text-[10rem] ${isPulsing ? 'scale-110' : 'scale-100'}`}
            >
              {currentNote.lyric}
            </div>
            <div className="text-center">
              <div className="font-mono text-4xl font-bold tracking-wider text-pink-400">{currentNote.notation}</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {isAutoPlaying ? 'Auto Playing' : 'Tap Anywhere'}
              </div>
            </div>
          </>
        )}

        <section
          className="pointer-events-auto mt-1 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-3 shadow-2xl backdrop-blur-xl"
          onPointerDown={(event) => event.stopPropagation()}
          aria-label="播放控制"
        >
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetSong}
              className="rounded-full border border-slate-700 bg-slate-800 p-3 text-slate-300 transition hover:text-white active:scale-95"
              aria-label="重新開始"
            >
              <RotateCcw size={20} />
            </button>
            <button
              type="button"
              onClick={toggleAutoPlay}
              className="flex min-w-36 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg shadow-pink-600/20 transition active:scale-95"
            >
              {isAutoPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              {isAutoPlaying ? '暫停' : '自動播放'}
            </button>
            <button
              type="button"
              onClick={stepBack}
              className="rounded-full border border-slate-700 bg-slate-800 px-4 py-3 font-mono text-sm font-bold text-slate-300 transition hover:text-white active:scale-95"
              aria-label="上一個音符"
            >
              −1
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4 border-t border-white/10 pt-3">
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <Gauge size={16} className="shrink-0 text-pink-400" />
              <span className="w-12 font-mono text-white">{bpm} BPM</span>
              <input
                className="min-w-0 flex-1 accent-pink-500"
                type="range"
                min={MIN_BPM}
                max={MAX_BPM}
                value={bpm}
                onChange={(event) => {
                  stopPlayback();
                  setBpm(Number(event.target.value));
                }}
                aria-label="速度"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <Volume2 size={16} className="shrink-0 text-pink-400" />
              <span className="w-8 font-mono text-white">{Math.round(volume * 100)}%</span>
              <input
                className="min-w-0 flex-1 accent-pink-500"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                aria-label="音量"
              />
            </label>
          </div>
        </section>
      </main>

      <section
        ref={scrollRef}
        className="pointer-events-auto relative z-20 h-[28%] shrink-0 overflow-y-auto border-t border-white/10 bg-slate-950/55 px-4 py-5 backdrop-blur-xl"
        onPointerDown={(event) => event.stopPropagation()}
        aria-label="歌詞與簡譜進度"
      >
        <div className="mx-auto max-w-lg space-y-7 pb-10">
          {SONG_DATA.map((line) => {
            const isActiveLine = line.id === activeLineId;
            const previousNotesCount = SONG_DATA.slice(0, SONG_DATA.findIndex((item) => item.id === line.id)).reduce(
              (total, item) => total + item.notes.length,
              0,
            );

            return (
              <div
                id={`lyric-line-${line.id}`}
                key={line.id}
                className={`transition-all duration-500 ${isActiveLine ? 'opacity-100' : 'opacity-30'}`}
              >
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {line.notes.map((note, index) => {
                    const globalIndex = previousNotesCount + index;
                    const isPlayed = globalIndex < currentIndex;
                    const isCurrent = globalIndex === currentIndex;

                    return (
                      <div
                        key={`${line.id}-${index}`}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 ${isCurrent ? '-translate-y-1 scale-110' : ''}`}
                      >
                        <span className={`font-mono text-xs font-bold ${isPlayed ? 'text-pink-500' : isCurrent ? 'text-pink-300' : 'text-slate-600'}`}>
                          {note.notation}
                        </span>
                        <span
                          className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-1 text-lg font-bold transition-all duration-200 md:h-10 md:min-w-10 md:text-xl ${
                            isPlayed
                              ? 'border-pink-500 bg-pink-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                              : isCurrent
                                ? 'border-white bg-white text-pink-600 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                : 'border-slate-700 bg-slate-800 text-slate-500'
                          }`}
                        >
                          {note.lyric}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
