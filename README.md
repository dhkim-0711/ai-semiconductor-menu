# AI Semiconductor Division Menu

Static site for the AI Semiconductor Division project menu board.

## GitHub Pages

This repository is prepared for GitHub Pages deployment from the `main` branch root.

- Default site URL format: `https://<owner>.github.io/<repository>/`
- Entry file: `index.html`
- `.nojekyll` is included so static assets are published as-is

## Local preview

```powershell
node tools/static-server.js 4174
```

Then open `http://127.0.0.1:4174/`.

## Notice sync

Project-specific NIPA business notices can be refreshed with:

```powershell
node tools/sync-nipa-notices.js
node tools/build-web-data-from-csv.js
```

The repository also includes a scheduled GitHub Actions workflow that refreshes notice links twice a day and republishes the generated site data when new notices are detected.
