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

GitHub Pages' branch deployment only offers the repository **root** or **`/docs`** — it
cannot serve an arbitrary folder such as `web/`. So there are two routes:

**A — GitHub Actions (keeps this folder where it is).** Add a workflow that uploads `web/`
as the Pages artifact, then set Settings → Pages → Source to *GitHub Actions*. Redeploys on
every push to `main`.

**B — Rename to `docs/`.** `git mv web docs`, then Settings → Pages → deploy from branch
`main`, folder `/docs`. No CI, but the folder name is fixed by GitHub.

Any static host works too — Netlify or Vercel with publish directory `web` and no build
command.
