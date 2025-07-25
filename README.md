# GoGAdmin – Nutrition Search Workflow Logs UI

This folder contains a **stand-alone React admin panel** dedicated to reviewing and managing nutrition-search workflow logs.

Initial scaffold only – no styling yet.

## Structure
```
GoGAdmin/
  ├─ public/
  │   └─ index.html        # root HTML
  ├─ src/
  │   ├─ App.tsx           # entry component
  │   ├─ api.ts            # thin wrapper around /api/logs routes
  │   └─ index.tsx         # React-DOM bootstrap
  ├─ vite.config.ts        # Vite config (React + TS)
  └─ package.json
```

## Getting started locally
```bash
cd GoGAdmin
npm install
npm run dev
```
The dev server runs on http://localhost:5174 (separate port from main app).

## Build
```bash
npm run build
```
`dist/` will hold static assets that can be copied to any host or merged into the main site.

---
Further design / color / UX details to be added next.
