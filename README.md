# Codex Ideas Board

This repository now contains a lightweight static starter app that turns the raw 101-item Codex idea list into a concrete working backlog.

## What is included

- A searchable idea board grouped by strategic category.
- A recommended **Top 12** list to start executing first.
- Priority tags (`Now`, `Next`, `Later`) to help sequence work.
- Effort and leverage tags so idea selection is more practical.

## Run locally

Because this is a static app, you can open `index.html` directly in a browser or serve the folder with a basic web server.

### Example

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Files

- `index.html` — page structure.
- `styles.css` — visual design.
- `data.js` — idea dataset and featured picks.
- `app.js` — filtering and rendering logic.

## Suggested next steps

1. Add persistence so ideas can be re-prioritized interactively.
2. Add export/import to save custom rankings.
3. Turn featured ideas into clickable detail pages.
4. Connect the board to a backend for notes, owners, and execution status.
