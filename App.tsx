import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Gamepad2, RotateCcw, Volume2 } from 'lucide-react';
import { CHALLENGE_LENGTH, createChallenge, createLevelOneChallenge, DEFAULT_VOLUME, KEYBOARD_NOTES } from './constants';
import { audioService } from './services/audioService';
import { ChallengeType, GameMode, KeyboardNote } from './types';

const keyMap = new Map(KEYBOARD_NOTES.map((note) => [note.key, note]));

export default function App() {
  const [mode, setMode] = useState<GameMode>('free');
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [activeKey, setActiveKey] = useState<string | null>(null);
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

  const flashKey = useCallback((key: string) => {
    setActiveKey(key);
    window.setTimeout(() => {
      setActiveKey((current) => (current === key ? null : current));
    }, 140);
  }, []);

  const playNote = useCallback(
    (note: KeyboardNote) => {
      void audioService.resume();
      audioService.playTone(note.frequency, 0.42);
      flashKey(note.key);

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
    [combo, currentTarget, flashKey, isComplete, mode],
  );

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
      setActiveKey(null);
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
      playNote(note);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playNote]);

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
            <p className="text-xs text-slate-400">A S D F G H J K · Play by keyboard or tap</p>
          </div>
        </div>

        <div className="hidden text-right text-xs text-slate-400 sm:block">
          <div>HTML / Web Audio</div>
          <div className="font-mono text-blue-300">8-note keyboard</div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col px-4 py-4 md:px-6">
        <section className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
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

          <label className="flex min-w-52 items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm">
            <Volume2 size={17} className="text-blue-300" />
            <span className="w-10 font-mono">{Math.round(volume * 100)}%</span>
            <input
              className="min-w-24 flex-1 accent-blue-500"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label="Master volume"
            />
          </label>
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
              <p className="mt-2 text-sm text-slate-400">Press A–K or tap the piano keys below.</p>
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

          <div className="mt-6 grid grid-cols-4 gap-2 md:grid-cols-8 md:gap-3" aria-label="Virtual music keyboard">
            {KEYBOARD_NOTES.map((note) => {
              const isActive = activeKey === note.key;
              const isTarget = mode === 'challenge' && !isComplete && currentTarget?.key === note.key;

              return (
                <button
                  key={note.key}
                  type="button"
                  onPointerDown={(event) => {
                    event.preventDefault();
                    playNote(note);
                  }}
                  className={`group flex min-h-32 flex-col items-center justify-between rounded-2xl border px-2 py-4 transition active:scale-[0.98] md:min-h-48 ${
                    isActive
                      ? 'border-blue-200 bg-blue-400 text-slate-950'
                      : isTarget
                        ? 'border-blue-400 bg-blue-500/15 text-white'
                        : 'border-white/10 bg-gradient-to-b from-slate-100 to-slate-300 text-slate-950 hover:from-white hover:to-slate-200'
                  }`}
                  aria-label={`${note.key} key, ${note.label}, ${note.notation}`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl font-mono text-xl font-black ${
                      isActive ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'
                    }`}
                  >
                    {note.key}
                  </span>
                  <div className="text-center">
                    <div className="font-bold">{note.label}</div>
                    <div className={`font-mono text-xs ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                      {note.notation}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>Tip: Use both hands across A–K.</span>
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
