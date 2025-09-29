#!/usr/bin/env node
// @ts-nocheck
/* eslint-disable */
import fs from 'fs/promises';

const READWISE_TOKEN = process.env.READWISE_TOKEN;
if (!READWISE_TOKEN) {
  console.error('READWISE_TOKEN is not set. Skipping.');
  process.exit(0);
}

const OUT_DIR_URL = new URL('../data/sources/', import.meta.url);
await fs.mkdir(OUT_DIR_URL, { recursive: true });

async function fetchAll() {
  const items: any[] = [];
  let page = 1;
  for (;;) {
    const res = await fetch(`https://readwise.io/api/v3/list/?page=${page}&category=all`, {
      headers: { Authorization: `Token ${READWISE_TOKEN}` },
    });
    if (!res.ok) throw new Error(`Readwise fetch failed: ${res.status}`);
    const data = await res.json();
    const results = (data?.results ?? []) as any[];
    items.push(...results);
    if (!data?.next) break;
    page += 1;
  }
  return items;
}

function normalize(readwiseItems: any[]) {
  return readwiseItems.map((x: any) => {
    const id = `readwise:${x?.id}`;
    const url = x?.source_url || x?.url || null;
    return {
      id,
      type: 'saved',
      source: 'readwise',
      timestamp: x?.updated_at || x?.created_at || new Date().toISOString(),
      title: x?.title || (x?.author ? `${x.author} — saved article` : 'Saved article'),
      summary: x?.summary || x?.text || '',
      url,
      author: x?.author ? { name: x.author } : undefined,
      tags: Array.isArray(x?.tags) ? x.tags : [],
      media: x?.cover_image_url ? [{ type: 'image', url: x.cover_image_url }] : [],
    };
  });
}

const raw = await fetchAll();
const normalized = normalize(raw);
await fs.writeFile(new URL('readwise.json', OUT_DIR_URL), JSON.stringify(normalized, null, 2));
console.log(`Saved ${normalized.length} Readwise items.`);

