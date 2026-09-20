# Keyboard Music Game

A lightweight browser music game built with React, TypeScript, Vite, and the Web Audio API.

## Play

The keyboard provides three playable white-key octaves from **C3 through C6**.

### High octave

| Key | Note |
| --- | --- |
| Q | C5 / Do |
| W | D5 / Re |
| E | E5 / Mi |
| R | F5 / Fa |
| T | G5 / Sol |
| Y | A5 / La |
| U | B5 / Ti |
| I | C6 / Do |

### Middle octave

| Key | Note |
| --- | --- |
| A | C4 / Do |
| S | D4 / Re |
| D | E4 / Mi |
| F | F4 / Fa |
| G | G4 / Sol |
| H | A4 / La |
| J | B4 / Ti |
| K | C5 / Do |

### Low octave

| Key | Note |
| --- | --- |
| Z | C3 / Do |
| X | D3 / Re |
| C | E3 / Mi |
| V | F3 / Fa |
| B | G3 / Sol |
| N | A3 / La |
| M | B3 / Ti |
| , | C4 / Do |

## Game modes

### Free Play

Play all three octaves from the computer keyboard or the on-screen keys. Hold multiple keys at the same time to play polyphonic chords; each note sustains until its key is released.

### Loop Recorder

Free Play includes a small loop recorder:

1. press **Record**
2. play a phrase
3. press **Stop**
4. press **Loop** to hear the timed phrase repeat
5. press **Make Challenge** to convert the recorded note-on order into a playable Challenge

The current version keeps the loop in browser memory for the current session. Chords can be recorded and looped; when converted to Challenge, note attacks are practiced in their recorded order.

### Challenge

Challenge now includes:

- **Level 1** — the original fixed A–K exercise
- **Beethoven · Ode to Joy** — a C-major white-key practice adaptation of the public-domain melody
- **Bach · Prelude in C Major, BWV 846** — a simplified single-note opening arpeggio exercise
- **My Loop** — appears after a loop recording is converted into a Challenge

Correct notes advance the pattern and build the combo. Accuracy tracks correct inputs, while wrong notes reset the combo.

## Classical source note

The underlying Beethoven and Bach compositions are in the public domain. The in-game sequences are simplified practice adaptations rather than reproductions of a modern commercial score edition.

Reference scores:

- Mutopia Project — Beethoven, *Ode to Joy*: https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=528
- Mutopia Project — J. S. Bach, *Prelude in C Major, BWV 846*: https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=5

## Volume

The main interface uses a compact speaker button. Tap or click the speaker icon to open the volume slider, adjust the master volume, then tap elsewhere to close it.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS via CDN
- Lucide React
- Web Audio API

No external music recordings, lyrics, AI API, or API keys are required.

## Run locally

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

Vite is configured to run locally on port `3000`.

## Deployment

Every push to `main` is automatically checked, built, and deployed through GitHub Pages.

Public URL:

`https://yoko5566.github.io/Music-Practice/`
