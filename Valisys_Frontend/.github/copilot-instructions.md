<!-- .github/copilot-instructions.md -->
# Copilot / AI Agent Instructions — Valisys Frontend

Purpose: quickly orient an AI coding agent to be productive in this repository (React + Vite minimal template).

- Project type: React (JSX) app built with `vite`. Entry points: `src/main.jsx` and `src/App.jsx`.
- Package manager commands (run from repository root):
  - `npm install` — install deps
  - `npm run dev` — start Vite dev server (HMR)
  - `npm run build` — produce production `dist`
  - `npm run preview` — serve production build locally
  - `npm run lint` — run ESLint (config in `eslint.config.js`)

Architecture / Big picture
- Single-page React app using Vite. The app mounts at `document.getElementById('root')` in `src/main.jsx` using `createRoot`.
- Styling is simple: `src/index.css` is imported from `main.jsx`. Static assets served from `public/`.
- Vite config: `vite.config.js` uses `@vitejs/plugin-react` (see plugin options if you change JSX handling).

Important files to read / edit
- `src/main.jsx` — app bootstrap (StrictMode + root render).
- `src/App.jsx` — current app component (small placeholder). New components should be imported from here or routed in.
- `src/index.css` — global CSS; currently empty but imported by `main.jsx`.
- `public/` — static assets (favicon, index.html is at repo root).
- `vite.config.js` — dev/build behavior and plugins.
- `eslint.config.js` — lint rules; note `globalIgnores(['dist'])` and rule: `'no-unused-vars'` allows uppercase/underscore pattern `^[A-Z_]`.

Project-specific conventions and patterns
- This is a minimal Vite + React template (no TypeScript by default). Files use ESM imports (package.json `type: "module"`).
- Keep `.jsx` extension for components (examples: `src/App.jsx`, `src/main.jsx`).
- Avoid switching to CommonJS (`require`) — prefer `import`/`export`.
- ESLint is configured with React hooks rules and Vite refresh plugin. Follow existing lint rules when adding code.

How to add a component (example)
- Create `src/components/MyCard.jsx` with a default export:
  ```jsx
  export default function MyCard(){
    return <div className="my-card">Hello</div>
  }
  ```
- Import and use in `src/App.jsx`:
  ```jsx
  import MyCard from './components/MyCard.jsx'
  // then <MyCard /> inside App
  ```

Testing / CI notes
- No test runner is configured in this repo. If adding tests, document the chosen runner and add scripts to `package.json`.

Warnings & gotchas for AI edits
- Do not assume TypeScript or Jest exist. Add dependencies and scripts explicitly if you enable them.
- `eslint.config.js` intentionally ignores `dist` and allows some unused identifiers; follow that pattern for similar config changes.
- Keep `package.json` `type: "module"` unless intentionally migrating to CJS.

Integration points / external deps
- Main runtime deps: `react`, `react-dom`. Dev deps include `vite` and `@vitejs/plugin-react`.
- If you add server-side code or APIs, document expected fetch endpoints and CORS considerations in the repo README.

When you make edits
- Run `npm run dev` locally to verify HMR and basic behavior.
- Run `npm run lint` and fix lint errors before committing.
- Keep changes minimal and consistent with the JSX/ESM style used by existing files.

If anything in these instructions is unclear or you want more detail (routing setup, state management conventions, or a suggested test setup), tell me which area to expand.
