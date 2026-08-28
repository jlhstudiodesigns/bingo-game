# bingo-game

A browser-based "bingo caller" app themed around famous artworks. Static site,
no build step, no backend — deployed straight to GitHub Pages from `main`.

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

## Current cache-busting versions (bump when editing the file)

| File | Version tag |
|------|-------------|
| `style.css` | `?v=20260824e` |
| `app.js` | `?v=20260824b` |
| `seed-data.js` | `?v=20260818e` |

When you edit any of these files, bump the corresponding tag in `index.html`
(format: `YYYYMMDDx` where x is a letter suffix, e.g. `20260825a`). A changed
query string forces browsers to re-fetch without clearing cache.

## UI / visual design decisions

### Controls bar (bottom of main view)

Button order (left group): **Draw · ◀ · ▶ · Leading · 🏆 · Reset**
Right group: **Now Playing** (select) · **⚙** (setup) · **⛶** (fullscreen)

All buttons share a unified style:
- Green gradient: `linear-gradient(155deg, #3f9d64, #256b3f)`, white text, 36px height, `box-sizing:border-box`
- Hover: text turns black, `filter:brightness(1.1)`
- Active/down: `transform:scale(0.9)`, `filter:brightness(0.6)`
- Disabled: same gradient, 50% opacity, `cursor:not-allowed`
- `#setupBtn` icon is 23.5px, `#fsBtn` icon is 22px; setup icon has `padding-top:6px !important` to center vertically

### Leading and Winners buttons

- **Leading btn** (`#leadingBtn`): enabled as soon as any non-winning card has ≥2 called items in its best line. Shows count: "Leading N". Never displays winning cards — computed from non-winners only. No special color.
- **Winners btn** (`#winnersBtn`): enabled and turns gold-pulse (`#winnersBtn.winning`) when any card achieves BINGO. Shows count: "🏆 N". Triggers a star-burst animation (`spawnWinnerStars()`) each time the winner count increases.

### Star burst animation

`spawnWinnerStars()` spawns 18–26 `★` spans from the Winners button, flying upward (±20° from straight up) with a curved arc, white→yellow→gold→fade over 1.3s. Uses CSS custom properties (`--dx`,`--dy`,`--mx`,`--my`,`--spin`) per star. `animation-fill-mode: both` prevents a black-star flash during delay.

### BINGO column colors

B = red `#d24a3c→#a8291d` · I = orange `#e0912f→#b6691a` · N = yellow `#ffd200→#d1a900` (dark text) · G = green `#3f9d64→#256b3f` · O = blue `#3f77c2→#24518f`

These colors must be applied consistently in: column header badges, lightbox badges (`.lightbox-badge.letter-*`), and accordion column badges (`.acc-col.col-*`).

### Reveal card / pop-up card

- **FREE cell**: dark background `#0c0f0c`, gold text `#e8c468`. Font size: `14.3px` in grid cells, `19.5px` in the enlarged win-tile label (`.win-tile-free-label`).
- **Lightbox badge colors** must match the column color system above.

### Setup / editor view

- **Accordion item list**: all items collapsed by default. Header bar: `#787878` gray background, white text, `#8d8d8d` border. Interior panel (`.acc-body`) stays white when expanded.
- **Two-column layout**: items are split at the midpoint — first half left column, second half right — rendered as two `.items-col` flex stacks inside a `grid-template-columns: 1fr 1fr` `.items-table`. Collapses to single column at ≤720px.
- **Accordion header** shows: item number (gold `#f0d080`), title (white, bold), subtitle/artist (light gray `#e0e0e0`), column badge (BINGO color), ▶ arrow (rotates 90° when open).
- **Title and subtitle in the header sync live** as the user types in the expanded fields (via `data-acc-title` and `data-acc-sub` attributes updated in the field change handler).
- **`.item-row-top` grid**: `96px 1.2fr 1.2fr auto` (4 columns — the old 28px `.idx` column was moved into the accordion header, so only 4 remain).

## Key data decisions

- **Seed data key collision**: two artworks share the title "The Kiss" (Gustav
  Klimt and Francesco Hayez). `SEED_IMAGES` and `SEED_DATES` are keyed on
  `title + '||' + artist`, matching the convention `buildItemKeyMap()` already
  uses in `app.js`. If you add more seed lookups keyed by artwork, use the same
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
  They were **not** independently verified against outside sources — treat them
  as "best effort from our own fact text," not authoritative.

## Game logic (key functions in `app.js`)

- **`computeBingoStatus()`** — returns `{mode, winners, leaders, leaderCard, leaderLineIdx, leaderCount}`. Always includes leader info. In winning mode, leaders are computed **only from non-winning cards** (winners are excluded).
- **`renderBingoWinner()`** — updates button states; tracks `prevWinCount` to fire `spawnWinnerStars()` only when the winner count increases.
- **`renderItemsTable()`** — re-renders the full editor list. Called after every add/delete/image operation. Accordion toggle handlers and live field-sync are wired inside this function after the HTML is set.

## Preloaded artwork images (`images/`)

Most of the 75 seed artworks have a bundled image; any that don't show the
"no image" placeholder. Filenames are kebab-case slugs of the title
(e.g. `the-great-wave-off-kanagawa.jpg`). Keep that convention and remember to
add the corresponding `SEED_IMAGES["Title||Artist"]` entry — a file in `images/`
does nothing on its own.

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
5. Bump the cache-busting version on the `seed-data.js` script tag in `index.html`.
6. Commit and push to `main`.

## Planned but not built yet

The user wants a real "database feature" later: end users uploading their own
images and creating new bingo themes, persisted server-side (not just
IndexedDB). Nothing in the current architecture supports this — there's no
backend, and the site is 100% static. This will need real design work (storage,
auth, and almost certainly moving off pure static-Pages hosting) — don't assume
it's a small extension of the current Setup/upload UI.

## Session/tooling constraints worth knowing about

- **No outbound web access** — `curl`/fetch to any external host is blocked at
  the network-policy level. `WebSearch` (text results) works; downloading actual
  image files from the web does not. Images must come from the user directly.
- **Large single-file pushes fail.** Pushing file content through the GitHub API
  tool requires generating the entire file as literal output — impractical for
  large files. Use plain `git push` (streams from disk) for everything, especially
  binary assets.
- **`git push` needs the GitHub App installed with write access** — not just
  OAuth-authorized. Session credentials are minted at start; fixing permissions
  mid-session doesn't refresh them. A 403 "Resource not accessible by integration"
  after supposedly fixing access is almost always a stale-credential issue — start
  a fresh session.
- **All development is committed and pushed directly to `main`**, which is the
  branch GitHub Pages deploys from. There is no staging branch in active use.
