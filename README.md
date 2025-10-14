# timeline.523.life

A personal timeline aggregating blog posts, saved articles, and social media activity into a unified chronological view.

**Live Site:** https://timeline.523.life

## Overview

This project transforms my online history into an interactive timeline, replacing the previous Jekyll blog with a modern Astro-based timeline application. The timeline automatically updates every 4 hours via GitHub Actions, fetching new content from multiple sources.

## Data Sources

### 1. **Blog Posts** (36 posts)
- Sourced from Jekyll markdown files in `_posts/`
- Converted to HTML via `marked` library
- Full content available as separate pages
- Topics: Security, DevOps, Python, Networking

### 2. **Bluesky Posts** (4 posts)
- Fetched via AT Protocol API
- Handle: [@chase523.bsky.social](https://bsky.app/profile/chase523.bsky.social)
- Incremental updates (only fetches new posts)
- No authentication required

### 3. **Readwise Reader** (10 documents tagged "classic")
- Fetched via Readwise Reader API v3
- Documents tagged with "classic" from all locations (archive, inbox, later)
- Includes highlights and reading metadata
- Requires API token

**Total Timeline Items:** 50

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Data Sources                             │
├──────────────┬──────────────────┬───────────────────────────┤
│ _posts/*.md  │ Bluesky API      │ Readwise Reader API       │
│              │ (AT Protocol)    │ (v3)                       │
└──────┬───────┴────────┬─────────┴──────────┬────────────────┘
       │                │                    │
       ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Fetching Scripts (Node.js)                 │
├──────────────┬──────────────────┬───────────────────────────┤
│ fetch-blog   │ fetch-bluesky    │ fetch-readwise-reader     │
│              │                  │                            │
└──────┬───────┴────────┬─────────┴──────────┬────────────────┘
       │                │                    │
       └────────────────┼────────────────────┘
                        ▼
              ┌──────────────────┐
              │   merge-sources  │
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │  timeline.json   │
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │   Astro Build    │
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │   docs/ (deploy) │
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │  GitHub Pages    │
              └──────────────────┘
```

## Tech Stack

- **Framework:** [Astro](https://astro.build/) v4
- **Styling:** Custom CSS with dark theme
- **Deployment:** GitHub Pages (from `/docs` directory)
- **Automation:** GitHub Actions (every 4 hours)
- **Data Processing:** Node.js with TypeScript
- **Libraries:**
  - `gray-matter` - Parse front matter from markdown
  - `marked` - Convert markdown to HTML
  - Native `fetch` - API requests

## Project Structure

```
.
├── _posts/                          # Original Jekyll blog posts (markdown)
├── astro/                           # Astro application
│   ├── src/
│   │   ├── components/
│   │   │   └── Timeline.astro      # Timeline component with filters
│   │   ├── pages/
│   │   │   ├── index.astro         # Main timeline page
│   │   │   └── blog/[slug].astro   # Dynamic blog post pages
│   │   └── data/
│   │       └── timeline.json       # Merged timeline data
│   ├── scripts/
│   │   ├── fetch-blog.mts          # Fetch blog posts
│   │   ├── fetch-bluesky.mts       # Fetch Bluesky posts
│   │   ├── fetch-readwise-reader.mts # Fetch Readwise Reader docs
│   │   └── merge-sources.mts       # Merge all sources
│   ├── data/sources/               # Individual source JSON files
│   │   ├── blog.json
│   │   ├── bluesky.json
│   │   └── readwise.json
│   └── package.json
├── docs/                            # Deployed site (GitHub Pages)
│   ├── index.html
│   ├── blog/                        # Individual blog post pages
│   └── assets/
├── .github/workflows/
│   └── fetch-timeline.yml          # Auto-update workflow
├── deploy.sh                        # Build and deploy script
├── READWISE_SETUP.md               # Readwise integration guide
└── README.md                        # This file
```

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
# Clone the repository
git clone git@github.com:chasemp/chasemp.github.io.git
cd chasemp.github.io

# Install dependencies
cd astro
npm install

# Fetch data (optional - will use existing data if tokens not provided)
npm run generate

# Start dev server
npm run dev
```

Visit http://localhost:4321 to see the timeline.

### Environment Variables

Optional environment variables for data fetching:

```bash
# Readwise Reader API token
export READWISE_TOKEN="your_token_here"

# Filter Readwise by tag (optional)
export READWISE_TAG_FILTER="classic"
```

Get your Readwise token: https://readwise.io/access_token

## Deployment

The site automatically deploys via GitHub Actions every 4 hours. To manually deploy:

```bash
# Build and deploy to docs/
bash deploy.sh

# Commit and push
git add docs/
git commit -m "Deploy timeline update"
git push origin master
```

## GitHub Actions Workflow

The workflow (`.github/workflows/fetch-timeline.yml`) runs every 4 hours and:

1. Fetches new Bluesky posts
2. Fetches new blog posts
3. Fetches new Readwise documents (if token provided)
4. Merges all sources
5. Builds the Astro site
6. Deploys to `/docs`
7. Commits and pushes changes

**Secrets Required:**
- `READWISE_TOKEN` (optional)
- `READWISE_TAG_FILTER` (optional)

The workflow uses `GITHUB_TOKEN` (automatically provided) with `contents: write` permission to push changes.

## Features

### Timeline View
- **Vertical timeline** with chronological posts
- **Filter controls** for content types (Blog, Saved, Bluesky)
- **Timeline nodes** with color-coded dots by type
- **Responsive design** optimized for mobile

### Content Display
- **Blog posts:** Open as full pages (mobile-friendly, better for long content)
- **Saved articles & Bluesky:** Open in modal panels (quick preview for short content)
- **Search params:** Timeline state preserved in URL

### User Experience
- Dark theme matching 523.life aesthetic
- Hover tooltips on timeline nodes
- Keyboard navigation (ESC to close panels)
- Scroll lock when panels are open
- Reading time estimates for articles

## Data Format

All timeline entries follow this schema:

```typescript
interface TimelineEntry {
  id: string;                    // Unique ID (e.g., "blog:post-slug")
  type: 'blog' | 'saved' | 'bluesky';
  timestamp: string;             // ISO 8601 date
  title: string;
  summary?: string;
  url: string | null;
  canonical_url?: string;
  author?: string;
  tags: string[];
  content_html?: string;
  metadata?: Record<string, any>;
}
```

## Configuration

### Astro Configuration
- Build output: `static` (pre-rendered HTML)
- Build directory: `dist/`

### GitHub Pages
- Source: `/docs` directory
- Custom domain: `timeline.523.life`
- CNAME: Managed via `astro/public/CNAME`

## Contributing

This is a personal project, but feel free to fork it for your own timeline!

## Related Projects

- **Main Site:** https://523.life
- **Bluesky:** [@chase523.bsky.social](https://bsky.app/profile/chase523.bsky.social)

## License

Content is © Chase Pettet. Code is MIT licensed.

---

**Note:** This project replaced a Jekyll-based blog. The original posts are preserved in `_posts/` and rendered through the new timeline interface.
