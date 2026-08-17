# bingo-game

A browser-based "bingo caller" app currently themed around famous artworks. Static
site, no build step, no backend — deployed straight to GitHub Pages from `main`.

## Live site

https://jlhstudiodesigns.github.io/bingo-game/

Deploys automatically on every push to `main` via `.github/workflows/pages.yml`
(GitHub Actions → Pages, not the "deploy from branch" method). If Pages ever needs
re-enabling on a fresh repo, the Actions token **cannot** create the Pages site on
its own (`Resource not accessible by integration`) — a repo admin has to do it once
manually: Settings → Pages → Source → "GitHub Actions". After that, the workflow
handles every deploy from then on.

## File layout

- `index.html` — markup only, no inline CSS/JS.
- `style.css` — all styles.
- `seed-data.js` — `window.SEED_ART` (the 75 default artwork entries), plus
  `window.SEED_IMAGES` and `window.SEED_DATES`, keyed by `"Title||Artist"`.
- `app.js` — all application logic, wrapped in one IIFE.
- `images/` — preloaded artwork images for the default set (see below).

This was originally one big `index.html` file (~460KB) and got split into these
four files. That split was **not stylistic** — it was forced by a hosting
constraint (see "Session/tooling constraints" below). Don't recombine it.

## Key data decisions

- **Seed data key collision**: two artworks share the title "The Kiss" (Gustav
  Klimt and Francesco Hayez). `SEED_IMAGES` and `SEED_DATES` are keyed on
  `title + '||' + artist`, matching the convention `buildItemKeyMap()` already
  used in `app.js`. If you add more seed lookups keyed by artwork, use the same
  composite key — a plain title lookup **will** silently collide on this pair.
- **Preloaded images are separate from user-uploaded images.** User uploads (via
  Setup → Upload Images) go into IndexedDB per-item, keyed by item id
  (`imgKey(activeSetId, item.id)`). Preloaded default-set images live as static
  files in `images/` and are attached via `item.imageUrl`. `getImageDataUrl()`
  checks `item.imageUrl` first, then falls back to the IndexedDB blob. Uploading
  or removing an image on a preloaded item correctly clears `imageUrl` so the
  override sticks — see `app.js` around the `data-pick`/`data-remove` handlers.
- **Backfill for already-saved browsers**: the default item list is only ever
  *created* once per browser (first visit), then persisted. Early testers'
  browsers had already saved a default list before images/dates were added, so
  a new seed mapping alone doesn't reach them. `backfillDefaultImages()` in
  `app.js` merges `SEED_IMAGES`/`SEED_DATES` into already-saved item lists on
  every load (without touching items a user has customized). If you add another
  seed-derived field later, extend this function, not just `defaultArtItems()`.
- **Artwork dates** (`item.dateText`, shown under the title on the reveal card
  and recap modal) were extracted programmatically from the existing "Time
  Period" fact text (e.g. "Painted 1503–1517 (about 14 years)" → "1503–1517").
  They were **not** independently verified against outside sources — this
  session had no outbound web/image-fetch access (see below), so treat them as
  "best effort from our own fact text," not authoritative.

## Preloaded artwork images (`images/`)

Most of the 75 seed artworks now have a bundled image; any that don't show the
"no image" placeholder until images are added. Filenames are kebab-case slugs of
the title (e.g. `the-great-wave-off-kanagawa.jpg`), not the raw filenames the
images arrived with — several needed renaming to fix typos/spaces/apostrophes
from the original uploads. Keep using that naming convention for consistency,
and remember to add the corresponding `SEED_IMAGES["Title||Artist"]` entry — a
file dropped in `images/` does nothing on its own.

Images are expected to arrive from the user directly, not sourced from the web.

## Standing instruction: auto-wire new images

**Whenever a new file appears in `images/` that is not yet in `SEED_IMAGES`**
(detected via `git pull`, a user message, or any other means), immediately add
the matching entry to `window.SEED_IMAGES` in `seed-data.js` and push to `main`
— without waiting to be asked. Steps:

1. `git pull origin main` to get the new file(s).
2. Cross-reference every unwired filename against the `SEED_ART` titles and
   artists to find the correct `"Title||Artist"` key. Use the composite key —
   never a plain title (two artworks share "The Kiss").
3. Add the entry: `"Title||Artist": "images/filename.ext"`.
4. If a filename clearly doesn't match any seed entry, note it to the user
   rather than guessing.
5. Commit and push to `main`.

## Planned but not built yet

The user wants a real "database feature" later: end users uploading their own
images and creating new bingo themes, persisted server-side (not just
IndexedDB). Nothing in the current architecture supports this — there's no
backend, and the site is 100% static. This will need real design work (storage,
auth, and almost certainly moving off pure static-Pages hosting) — don't assume
it's a small extension of the current Setup/upload UI.

## Session/tooling constraints worth knowing about

These aren't project requirements, just environment facts that shaped decisions
above and will likely recur:

- **No outbound web access** in the session that did this work — `curl`/fetch to
  any external host (including Wikipedia, Wikimedia, even `example.com`) was
  blocked at the network-policy level. `WebSearch` (text results) worked;
  downloading actual image files from the web did not. This is why the artwork
  dates came from existing fact text instead of a lookup, and why the 54
  remaining artwork images have to come from the user rather than being fetched.
- **Large single-file pushes fail.** Pushing file content through the GitHub API
  tool means generating the entire file as literal output — a ~280KB base64
  image blob alone was ~264K tokens, far beyond what fits in one response. Plain
  `git push` has no such limit (it streams from disk) and is the only viable way
  to push binary assets (images) — use it instead of the content-based file API
  for anything non-trivially sized.
- **`git push` needs the GitHub App actually installed with write access**, not
  just OAuth-authorized ("Authorized GitHub Apps" ≠ "Installed GitHub Apps" in
  GitHub's UI). A session's credentials are minted at session start — installing
  or fixing permissions mid-session does not refresh them for that same session.
  If push/API calls 403 with "Resource not accessible by integration" after
  supposedly fixing access, that's very likely a stale-credential issue, not a
  still-broken permission — a fresh session usually resolves it immediately.
