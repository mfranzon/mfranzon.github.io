# Model Garden - CV model showcase

A static, self-contained showcase of the finetuned computer-vision models in this repo.
Each model is shown result-first: an autoplaying demo clip framed like a detection feed,
its spec sheet (base model, classes, data, speed), and a link to the weights on Hugging Face.

Models are trained with the [YOLO Training Template](https://github.com/computer-vision-with-marco/yolo-training-template).
Weights live on Hugging Face under `marcofranzon/*` (you push them; the page just links them).

Cards are grouped by **category** (Detection / Segmentation / Tracking) via filter chips,
and paginated at **5 cards per page**.

`index.html` has no build step and no external dependencies - just open it or host the folder.

## Contents

```
hub/
  index.html        the page (self-contained: inline CSS + JS)
  media/            web-optimized demo clips + poster frames
    fire.mp4/.jpg   early fire & smoke detection
    solar.mp4/.jpg  aerial solar-panel segmentation
    cells.mp4/.jpg  cell & bacterium tracking (SAM2)
```

The clips are H.264, 640-720p, muted, `+faststart`, re-encoded from the full-size
outputs in the repo root so the page stays light (~7.5 MB total).

## Preview locally

```bash
open hub/index.html                 # macOS, straight from disk
# or serve it (needed if a browser blocks file:// video autoplay):
python -m http.server -d hub 8000   # then visit http://localhost:8000
```

## Deploy free

**GitHub Pages** - commit the repo, then in Settings > Pages set the source to the
branch and `/` root, and point people at `.../hub/`. (Or move `hub/`'s contents to the
repo root / a `docs/` folder if you want a cleaner URL.)

**Cloudflare Pages / Netlify** - drag the `hub/` folder into the dashboard, or connect
the repo with output directory `hub`. No build command.

## Adding a model

1. Re-encode its demo to `media/<name>.mp4` (keep it small):
   ```bash
   ffmpeg -i source.mp4 -vf "scale=-2:720" -an -c:v libx264 -crf 26 \
     -pix_fmt yuv420p -movflags +faststart hub/media/<name>.mp4
   ffmpeg -ss 1.5 -i hub/media/<name>.mp4 -frames:v 1 -q:v 3 hub/media/<name>.jpg
   ```
2. Copy one `<article class="card" data-category="...">` block in `index.html`. Set
   `data-category` to `detection`, `segmentation`, or `tracking` (add a new chip in
   `#filters` if you need a new category). Swap the video, the confidence chip, the
   `task-tag`, the `<h3>`, the description, the `dl.facts` rows, and the `.weights` link
   (point it at `https://huggingface.co/marcofranzon/<repo>`).
3. Bump the model count in the hero (`MODELS 3`). Chip counts, the result count, and
   pagination update themselves from the cards - no need to touch the JS.

Note: the repo's pre-commit hook rejects em-dashes in files - use a plain hyphen.
