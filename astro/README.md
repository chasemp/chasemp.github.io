# Timeline Site (Astro)

Static, accessible timeline that aggregates blog posts from the legacy Jekyll `_posts/` and optional saved articles (Readwise). Newest items appear at the top; click a node to open details on the right.

## Local development

```bash
npm install
npm run dev
```

Data is generated into `src/data/timeline.json`.

## Data generation

- Readwise: set `READWISE_TOKEN` secret in GitHub → used by workflow.
- Blog posts: place Markdown files under `posts/` with frontmatter (`title`, `date`, `description`, `tags`, `slug`).

Manually generate locally:

```bash
READWISE_TOKEN=... npm run generate
npm run build
```

## Build

```bash
npm install
npm run generate
npm run build
```

