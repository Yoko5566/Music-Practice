# Keyboard Music Game

A lightweight browser music game built with React, TypeScript, Vite, and the Web Audio API.

## Play

Use the computer keyboard or the on-screen keys:

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

## Game modes

### Free Play

Play the eight-note keyboard freely using A–K or by tapping the virtual keys.

### Challenge

The game generates a random 16-note pattern. Match the displayed target keys to:

- advance through the pattern
- build a combo
- increase your score
- track accuracy

Wrong notes reset the combo and reduce the score slightly.

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

## Public-release note

This version uses generated note challenges and synthesized Web Audio tones. It does not include the previous third-party song lyrics or song-specific note sequence, making it substantially cleaner for a public demo or portfolio project.


## Deployment

The project includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml`.

Every push to `main` automatically:

1. installs dependencies
2. runs TypeScript type checking
3. builds the Vite production bundle
4. uploads the `dist` artifact
5. deploys it to GitHub Pages

Expected public URL after GitHub Pages is enabled:

`https://yoko5566.github.io/Music-Practice/`

The Vite configuration keeps local development at `/` while using `/Music-Practice/` as the production base path.
