# Agents

## Project Overview

blog-utils is a Vite-based JavaScript library that builds `globe.js` — an interactive globe visualization using PixiJS v8. The built output is consumed by the blog Hugo site.

## Key Files

- `globe.js` — Source for the interactive globe (PixiJS v8 + d3 geo)
- `dist/globe.js` — Built output (IIFE format, single file)
- `data.js` — Trip data consumed by globe.js
- `create-trip-metadata.js` — Generates trip metadata
- `vite.config.js` — Vite lib mode config, outputs to `dist/`

## NPM Scripts

```bash
npm run build          # Vite build → dist/globe.js
npm test               # Jest tests
npm run create-trip-metadata  # Generate trip metadata from data.js
```

## Dependencies

Key packages: `pixi.js@^8.14.3`, `d3@^7.9.0`, `topojson-client`, `lodash`, `world-atlas`