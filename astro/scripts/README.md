# Timeline Data Fetching Scripts

This directory contains scripts that fetch and process data for the timeline site.

## Scripts

### `fetch-blog.mts`
Fetches blog posts from the `_posts` directory (Jekyll markdown files), converts them to HTML, and stores them in `data/sources/blog.json`.

**Usage:**
```bash
npm run fetch:blog
```

### `fetch-bluesky.mts`
Fetches posts from your Bluesky profile using the AT Protocol API. Stores posts in `data/sources/bluesky.json`.

**Features:**
- Incremental updates (only fetches new posts since last run)
- Stores post content and embed information
- No authentication required (uses public API)

**Usage:**
```bash
npm run fetch:bluesky
```

### `fetch-readwise.mts`
Fetches saved articles and highlights from Readwise API using the v2 API. Requires `READWISE_TOKEN` environment variable.

**Features:**
- Fetches articles (not books/tweets/podcasts) with all highlights
- Incremental updates (only fetches new/updated articles)
- Optional tag filtering via `READWISE_TAG_FILTER`
- Automatic rate limiting (20 req/min)
- Stores highlights as HTML content

**Usage:**
```bash
# Basic usage
READWISE_TOKEN=your_token npm run fetch:readwise

# With tag filter (only articles tagged "timeline")
READWISE_TOKEN=your_token READWISE_TAG_FILTER=timeline npm run fetch:readwise
```

**Get your token:** https://readwise.io/access_token

### `merge-sources.mts`
Merges all JSON files from `data/sources/` into a single `src/data/timeline.json` file, deduplicating entries and sorting by timestamp.

**Usage:**
```bash
npm run merge
```

### `generate` (all scripts)
Runs all fetch scripts and merges the results.

**Usage:**
```bash
npm run generate
```

## Data Flow

```
_posts/*.md  ──→  fetch-blog.mts   ──→  data/sources/blog.json
Bluesky API  ──→  fetch-bluesky.mts ──→  data/sources/bluesky.json    ──→  merge-sources.mts  ──→  src/data/timeline.json
Readwise API ──→  fetch-readwise.mts ──→ data/sources/readwise.json
```

## GitHub Actions

The `.github/workflows/fetch-timeline.yml` workflow runs every 4 hours to:
1. Fetch new Bluesky posts
2. Fetch blog posts
3. Merge all sources
4. Build and deploy the site if there are changes

## Configuration

### Bluesky Handle
Edit `BLUESKY_HANDLE` in `fetch-bluesky.mts`:
```typescript
const BLUESKY_HANDLE = 'chase523.bsky.social';
```

### Readwise Token
Set as environment variable or GitHub secret:
```bash
export READWISE_TOKEN=your_token_here
```

