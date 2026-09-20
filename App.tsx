import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gamepad2, RotateCcw, Volume2 } from 'lucide-react';
import { CHALLENGE_LENGTH, createChallenge, createLevelOneChallenge, DEFAULT_VOLUME, HIGH_ROW_KEYS, KEYBOARD_NOTES, LOW_ROW_KEYS, MID_ROW_KEYS } from './constants';
import { audioService } from './services/audioService';
import { ChallengeType, GameMode, KeyboardNote } from './types';

const keyMap = new Map(KEYBOARD_NOTES.map((note) => [note.key, note]));
const lowRowNotes = LOW_ROW_KEYS.map((key) => keyMap.get(key)).filter(
  (note): note is KeyboardNote => Boolean(note),
);
const midRowNotes = MID_ROW_KEYS.map((key) => keyMap.get(key)).filter(
  (note): note is KeyboardNote => Boolean(note),
);
const highRowNotes = HIGH_ROW_KEYS.map((key) => keyMap.get(key)).filter(
  (note): note is KeyboardNote => Boolean(note),
);

export default function App() {
  const [mode, setMode] = useState<GameMode>('free');
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const volumePopoverRef = useRef<HTMLDivElement | null>(null);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(() => new Set());
  const [challengeType, setChallengeType] = useState<ChallengeType>('level1');
  const [sequence, setSequence] = useState<KeyboardNote[]>(() => createLevelOneChallenge());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctHits, setCorrectHits] = useState(0);

  const isComplete = mode === 'challenge' && currentIndex >= sequence.length;
  const currentTarget = sequence[currentIndex] ?? null;
  const accuracy = attempts === 0 ? 100 : Math.round((correctHits / attempts) * 100);

  const nextPreview = useMemo(
    () => sequence.slice(currentIndex, currentIndex + 8),
    [sequence, currentIndex],
  );

  useEffect(() => {
    audioService.setMasterVolume(volume);
    return () => audioService.stopAll();
  }, [volume]);

  useEffect(() => {
    if (!isVolumeOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && !volumePopoverRef.current?.contains(target)) {
        setIsVolumeOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [isVolumeOpen]);

  const pressNote = useCallback(
    (note: KeyboardNote) => {
      void audioService.resume();
      audioService.startTone(note.key, note.frequency);
      setActiveKeys((current) => {
        if (current.has(note.key)) return current;
        const next = new Set(current);
        next.add(note.key);
        return next;
      });

      if (mode !== 'challenge' || isComplete || !currentTarget) return;

      setAttempts((value) => value + 1);

      if (note.key === currentTarget.key) {
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        setCorrectHits((value) => value + 1);
        setScore((value) => value + 100 + Math.min(nextCombo * 10, 200));
        setCurrentIndex((value) => value + 1);
      } else {
        setCombo(0);
        setScore((value) => Math.max(0, value - 25));
      }
    },
    [combo, currentTarget, isComplete, mode],
  );

  const releaseNote = useCallback((key: string) => {
    audioService.stopTone(key);
    setActiveKeys((current) => {
      if (!current.has(key)) return current;
      const next = new Set(current);
      next.delete(key);
      return next;
    });
  }, []);

  const resetChallenge = useCallback(
    (type: ChallengeType = challengeType) => {
      setSequence(type === 'level1' ? createLevelOneChallenge() : createChallenge(CHALLENGE_LENGTH));
      setCurrentIndex(0);
      setScore(0);
      setCombo(0);
      setAttempts(0);
      setCorrectHits(0);
    },
    [challengeType],
  );

  const selectChallenge = useCallback(
    (type: ChallengeType) => {
      setChallengeType(type);
      resetChallenge(type);
    },
    [resetChallenge],
  );

  const switchMode = useCallback(
    (nextMode: GameMode) => {
      setMode(nextMode);
      audioService.stopAll();
      setActiveKeys(new Set());
      if (nextMode === 'challenge') resetChallenge();
    },
    [resetChallenge],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;

      const key = event.key.toUpperCase();
      const note = keyMap.get(key);
      if (!note || event.repeat) return;

      event.preventDefault();
      pressNote(note);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (!keyMap.has(key)) return;

      event.preventDefault();
      releaseNote(key);
    };

    const releaseAll = () => {
      audioService.stopAll();
      setActiveKeys(new Set());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', releaseAll);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseAll);
    };
  }, [pressNote, releaseNote]);

  return (
    <div className="relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_52%)]" />

      <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/15 p-2 text-blue-300">
            <Gamepad2 size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide">Keyboard Music Game</h1>
            <p className="text-xs text-slate-400">Low C3–C4 · Mid C4–C5 · High C5–C6</p>
          </div>
        </div>

        <div className="hidden text-right text-xs text-slate-400 sm:block">
          <div>HTML / Web Audio</div>
          <div className="font-mono text-blue-300">3 octaves · C3–C6</div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6">
        <section className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
          <div className="flex rounded-xl border border-white/10 bg-slate-900/80 p-1">
            <button
              type="button"
              onClick={() => switchMode('free')}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                mode === 'free' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Free Play
            </button>
            <button
              type="button"
              onClick={() => switchMode('challenge')}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                mode === 'challenge' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Challenge
            </button>
          </div>

          <div ref={volumePopoverRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsVolumeOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-blue-300 transition hover:text-white active:scale-95"
              aria-label="Adjust volume"
              aria-expanded={isVolumeOpen}
              aria-haspopup="dialog"
            >
              <Volume2 size={20} />
            </button>

            {isVolumeOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">Volume</span>
                  <span className="font-mono text-sm text-blue-300">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  className="w-full accent-blue-500"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  aria-label="Master volume"
                />
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto mt-4 flex min-h-0 w-full max-w-5xl flex-1 flex-col justify-center">
          {mode === 'challenge' && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => selectChallenge('level1')}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                  challengeType === 'level1'
                    ? 'border-blue-300 bg-blue-500 text-white'
                    : 'border-white/10 bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                Level 1 · 42 Keys
              </button>
              <button
                type="button"
                onClick={() => selectChallenge('random')}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                  challengeType === 'random'
                    ? 'border-blue-300 bg-blue-500 text-white'
                    : 'border-white/10 bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                Random · 16 Keys
              </button>
            </div>
          )}

          {mode === 'free' ? (
            <div className="mb-5 text-center">
              <div className="text-4xl font-black md:text-6xl">Free Play</div>
              <p className="mt-2 text-sm text-slate-400">Three octaves · hold multiple keys together to play chords.</p>
            </div>
          ) : isComplete ? (
            <div className="mb-5 text-center">
              <div className="text-4xl font-black text-emerald-300 md:text-6xl">Challenge Clear</div>
              <p className="mt-3 text-slate-300">
                Score <span className="font-mono font-bold text-white">{score}</span>
                {' · '}
                Accuracy <span className="font-mono font-bold text-white">{accuracy}%</span>
              </p>
              <button
                type="button"
                onClick={() => resetChallenge()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-bold text-white transition active:scale-95"
              >
                <RotateCcw size={18} />
                {challengeType === 'level1' ? 'Retry Level 1' : 'Play Again'}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Target</div>
                  <div className="mt-1 text-4xl font-black text-blue-300">{currentTarget?.key}</div>
                  <div className="text-sm text-slate-400">{currentTarget?.notation}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Score</div>
                  <div className="mt-1 font-mono text-3xl font-black">{score}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Combo</div>
                  <div className="mt-1 font-mono text-3xl font-black">{combo}</div>
                </div>
                <div className="hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 md:block">
                  <div className="text-xs uppercase tracking-widest text-slate-500">Accuracy</div>
                  <div className="mt-1 font-mono text-3xl font-black">{accuracy}%</div>
                </div>
              </div>

              <div className="mt-4 flex min-h-16 items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 px-3">
                {nextPreview.map((note, index) => (
                  <div
                    key={`${currentIndex}-${index}-${note.key}`}
                    className={`flex h-12 min-w-12 items-center justify-center rounded-xl border font-mono text-lg font-black transition ${
                      index === 0
                        ? 'border-blue-300 bg-blue-500 text-white'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                    }`}
                  >
                    {note.key}
                  </div>
                ))}
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-blue-500 transition-[width] duration-200"
                  style={{ width: `${(currentIndex / sequence.length) * 100}%` }}
                />
              </div>
            </>
          )}

          <div className="mt-4 space-y-2" aria-label="Virtual music keyboard">
            {[
              { label: 'High · C5–C6', notes: highRowNotes },
              { label: 'Mid · C4–C5', notes: midRowNotes },
              { label: 'Low · C3–C4', notes: lowRowNotes },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  {row.label}
                </div>
                <div className="grid grid-cols-8 gap-1 md:gap-2">
                  {row.notes.map((note) => {
                    const isActive = activeKeys.has(note.key);
                    const isTarget =
                      mode === 'challenge' && !isComplete && currentTarget?.key === note.key;

                    return (
                      <button
                        key={note.key}
                        type="button"
                        onPointerDown={(event) => {
                          event.preventDefault();
                          event.currentTarget.setPointerCapture(event.pointerId);
                          pressNote(note);
                        }}
                        onPointerUp={(event) => {
                          event.preventDefault();
                          releaseNote(note.key);
                        }}
                        onPointerCancel={() => releaseNote(note.key)}
                        onLostPointerCapture={() => releaseNote(note.key)}
                        className={`group flex min-h-20 flex-col items-center justify-between rounded-xl border px-0.5 py-2 transition active:scale-[0.98] md:min-h-28 md:rounded-2xl md:px-2 md:py-3 ${
                          isActive
                            ? 'border-blue-200 bg-blue-400 text-slate-950'
                            : isTarget
                              ? 'border-blue-400 bg-blue-500/15 text-white'
                              : 'border-white/10 bg-gradient-to-b from-slate-100 to-slate-300 text-slate-950 hover:from-white hover:to-slate-200'
                        }`}
                        aria-label={`${note.key} key, ${note.label}, ${note.notation}`}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-black md:h-10 md:w-10 md:text-lg ${
                            isActive ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'
                          }`}
                        >
                          {note.key === ',' ? ',' : note.key}
                        </span>
                        <div className="text-center leading-tight">
                          <div className="text-[11px] font-bold md:text-sm">{note.label}</div>
                          <div
                            className={`font-mono text-[9px] md:text-[11px] ${
                              isActive ? 'text-slate-800' : 'text-slate-500'
                            }`}
                          >
                            {note.notation}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>Keys: Q–I high · A–K mid · Z–, low.</span>
            {mode === 'challenge' && (
              <button
                type="button"
                onClick={() => resetChallenge()}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 font-semibold text-slate-300 hover:text-white"
              >
                <RotateCcw size={14} />
                {challengeType === 'level1' ? 'Restart Level' : 'New Pattern'}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
