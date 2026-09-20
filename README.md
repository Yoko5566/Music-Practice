# Keyboard Music Game

A lightweight browser music game built with React, TypeScript, Vite, and the Web Audio API.

## Play

The keyboard now spans **15 white-key notes from C4 through C6**.

### Lower octave

| Key | Note |
| --- | --- |
| Z | C4 / Do |
| X | D4 / Re |
| C | E4 / Mi |
| V | F4 / Fa |
| B | G4 / Sol |
| N | A4 / La |
| M | B4 / Ti |

### Upper octave

| Key | Note |
| --- | --- |
| A | C5 / Do |
| S | D5 / Re |
| D | E5 / Mi |
| F | F5 / Fa |
| G | G5 / Sol |
| H | A5 / La |
| J | B5 / Ti |
| K | C6 / Do |

## Game modes

### Free Play

Play all 15 white-key notes using the computer keyboard or the on-screen keys.

### Challenge

- **Level 1** keeps the existing fixed 42-key sequence and uses the upper-octave A–K mapping.
- **Random** generates a 16-note challenge from the full C4–C6 white-key range.

Correct notes advance the pattern, build combo, increase score, and improve accuracy. Wrong notes reset the combo and reduce the score slightly.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS via CDN
- Lucide React
- Web Audio API

No external music, lyrics, audio files, AI API, or API keys are required.

## Run locally

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

Vite is configured to run locally on port `3000`.

## Project structure

```text
Music-Practice/
├── App.tsx
├── constants.ts
├── types.ts
├── services/
│   └── audioService.ts
├── index.tsx
├── index.html
├── metadata.json
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Deployment

The project includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml`.

Every push to `main` automatically:

1. installs dependencies
2. runs TypeScript type checking
3. builds the Vite production bundle
4. uploads the `dist` artifact
5. deploys it to GitHub Pages

Public URL:

`https://yoko5566.github.io/Music-Practice/`

The Vite configuration keeps local development at `/` while using `/Music-Practice/` as the production base path.
