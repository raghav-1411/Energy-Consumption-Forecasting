# Frontend — Energy Consumption Forecasting

A static showcase site for the forecasting project. Zero dependencies, zero build step —
plain HTML, CSS and JavaScript with hand-rolled SVG charts.

## Run it locally

From the repository root:

```bash
python3 -m http.server 8000 --directory web
```

Then open <http://localhost:8000>.

(Opening `index.html` directly with `file://` also works, since nothing is fetched over the network.)

## What's here

| File | Purpose |
|------|---------|
| `index.html` | Page structure |
| `styles.css` | Design system and layout |
| `app.js` | Rendering, SVG charts, interactions |
| `data.js` | **All project numbers**, transcribed from the executed `main.ipynb` outputs |
| `assets/figures/` | Matplotlib figures extracted from the notebook |

Every metric on the page comes from `data.js` — nothing is hard-coded in the markup.
Re-run the notebook, update `data.js`, and the site reflects the new run.

## Deploying

Deployed on **Vercel** via the Git integration — every push to `main` publishes, and each
pull request gets its own preview URL.

The one setting that matters is **Root Directory = `web`** in the Vercel project settings.
Without it Vercel serves the repository root, where there is no `index.html`, and the
deployment 404s.

| Setting | Value |
|---|---|
| Framework Preset | Other |
| Root Directory | `web` |
| Build Command | *(none)* |
| Output Directory | *(none)* |
| Install Command | *(none)* |

There is deliberately no `vercel.json`. The site is plain static files, and Vercel's default
ETag revalidation already handles them correctly — pinning long cache lifetimes here would
only risk serving stale figures after the notebook is re-run.

Any other static host works the same way: serve the `web` folder, no build step.
