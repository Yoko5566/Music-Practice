# Music Practice

A lightweight React + TypeScript music-practice web app for stepping through lyrics and numbered notation with tap or autoplay controls.

## Current features

- Tap anywhere to advance one note at a time
- Autoplay mode with adjustable BPM
- Master volume control
- Step back and reset controls
- Keyboard navigation
- Numbered notation and lyric progress display
- Web Audio API tone synthesis
- Reduced-motion accessibility support

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS via CDN
- Lucide React
- Web Audio API

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite. The development server is configured to use port `3000`.

## Validation

```bash
npm run typecheck
npm run build
```

## Project structure

```text
Music-Practice/
├── App.tsx                 # Main UI and playback state
├── constants.ts           # BPM, pitch table, lyrics and note data
├── types.ts               # Shared TypeScript data types
├── services/
│   └── audioService.ts    # Web Audio API synthesizer service
├── index.tsx              # React entry point
├── index.html             # App shell and global inline styles
├── metadata.json          # AI Studio app metadata
├── vite.config.ts         # Vite development/build configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Security note

The current app does not require Gemini or any other API key. Secrets should never be committed to the repository. Local `.env` files are ignored by Git.

## Phase 1 cleanup

The initial Google AI Studio export included unused Gemini environment-variable injection and browser import-map remnants. Phase 1 removes those template artifacts without changing the app's UI or playback behavior.

## Next development direction

The current song data is hard-coded in `constants.ts`. A logical next phase is to separate song content from application configuration so multiple songs and practice modes can be added without expanding the main application component.
