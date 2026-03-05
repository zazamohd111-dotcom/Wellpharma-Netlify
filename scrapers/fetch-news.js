#!/usr/bin/env node
/**
 * fetch-news.js
 * Fetches healthcare RSS feeds, filters by WellPharma's 5 topic pillars,
 * and writes api/news.json.
 *
 * No external npm dependencies — uses Node 18+ built-in fetch.
 * Run: node scrapers/fetch-news.js
 */

const fs   = require('fs');
const path = require('path');

// ─── Category keyword filters ─────────────────────────────────────────────────
const CATEGORIES = {
  'GLP-1 & Weight': [
    'glp-1', 'glp1', 'semaglutide', 'ozempic', 'wegovy', 'tirzepatide',
    'mounjaro', 'zepbound', 'weight loss', 'obesity', 'weight management',
    'liraglutide', 'anti-obesity', 'glp receptor', 'incretin',
  ],
  'Hormones': [
    'menopause', 'perimenopause', 'hormone therapy', 'hormone replacement',
    'hrt', 'estrogen', 'progesterone', 'testosterone', 'hot flash',
    "women's health", 'postmenopause', 'bioidentical', 'menopausal',
  ],
  'Compounding': [
    'compounding', 'compounded', 'compound pharmacy', '503a', '503b',
    'custom medication', 'specialty pharmacy', 'custom formulation',
    'compounding pharmacy',
  ],
  'Peptides': [
    'peptide', 'peptide therapy', 'longevity peptide', 'growth hormone peptide',
    'ipamorelin', 'cjc-1295', 'cjc1295',
    'bpc-157', 'bpc157', 'bpc 157',
    'tb-500', 'tb500', 'tb 500',
    'ghk-cu', 'ghkcu', 'ghk cu', 'copper peptide',
    'sermorelin',
  ],
  'Maryland Health': [
    'maryland', 'baltimore', 'baltimore county', 'randallstown',
    'maryland department of health', 'mdh.maryland', 'chesapeake',
  ],
};

// ─── RSS feed sources ─────────────────────────────────────────────────────────
const FEEDS = [
  // FDA — drug safety and press releases
  {
    url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/drug-safety-communications/rss.xml',
    source: 'FDA',
  },
  {
    url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/recalls-market-withdrawals-safety-alerts/rss.xml',
    source: 'FDA Recalls',
  },
  // Pharmacy & Clinical
  {
    url: 'https://www.pharmacytimes.com/rss',
    source: 'Pharmacy Times',
  },
  {
    url: 'https://www.medpagetoday.org/rss/headlines.xml',
    source: 'MedPage Today',
  },
  // Research & biotech news
  {
    url: 'https://www.statnews.com/feed/',
    source: 'STAT News',
  },
  // Consumer health
  {
    url: 'https://www.healthline.com/rss/news',
    source: 'Healthline',
  },
  // Maryland / local
  {
    url: 'https://www.wbaltv.com/feeds/news/health.rss',
    source: 'WBAL Maryland',
  },
];

// ─── Simple RSS XML parser ────────────────────────────────────────────────────
function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  if (!match) return '';
  let content = match[1].trim();
  // Strip CDATA wrapper if present
  const cdata = content.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) content = cdata[1].trim();
  return content;
}

function parseRSS(xml, sourceName) {
  const items = [];
  const blocks = xml.split('<item');

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    const title = extractTag(block, 'title');
    // <link> in RSS is often not a standard tag — handle both formats
    let link = extractTag(block, 'link');
    if (!link) {
      const m = block.match(/<link>([^<]+)/);
      link = m ? m[1].trim() : '';
    }
    const description = extractTag(block, 'description');
    const pubDate     = extractTag(block, 'pubDate');

    if (!title || !link) continue;

    // Strip HTML tags and decode basic entities from description
    const clean = description
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g,  '&')
      .replace(/&lt;/g,   '<')
      .replace(/&gt;/g,   '>')
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&nbsp;/g, ' ')
      .slice(0, 220)
      .trim();

    const cleanTitle = title
      .replace(/&amp;/g,  '&')
      .replace(/&lt;/g,   '<')
      .replace(/&gt;/g,   '>')
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .trim();

    let parsedDate;
    try {
      parsedDate = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();
    } catch {
      parsedDate = new Date().toISOString();
    }

    items.push({
      title:       cleanTitle,
      link:        link.startsWith('http') ? link : '',
      description: clean,
      pubDate:     parsedDate,
      source:      sourceName,
    });
  }

  return items;
}

// ─── Category classifier ──────────────────────────────────────────────────────
function classify(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(kw => text.includes(kw))) {
      return category;
    }
  }
  return null; // no match — drop the article
}

// ─── Fetch one RSS feed ───────────────────────────────────────────────────────
async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'WellPharma-NewsBot/1.0 (+https://www.wellpharmapharmacy.com)' },
      signal:  AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml   = await res.text();
    const items = parseRSS(xml, feed.source);
    console.log(`  [OK]  ${feed.source}: ${items.length} items`);
    return items;
  } catch (err) {
    console.warn(`  [!!]  ${feed.source}: ${err.message}`);
    return [];
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\nWellPharma — fetching healthcare news feeds...\n');

  const results  = await Promise.allSettled(FEEDS.map(fetchFeed));
  const allItems = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

  console.log(`\nTotal raw items: ${allItems.length}`);

  // Classify, deduplicate, sort
  const seen       = new Set();
  const classified = [];

  for (const item of allItems) {
    if (!item.link || seen.has(item.link)) continue;
    const category = classify(item.title, item.description);
    if (!category) continue;
    seen.add(item.link);
    classified.push({ ...item, category });
  }

  classified.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Cap at 40 articles (max ~8 per category)
  const final = classified.slice(0, 40);

  // Summary
  const counts = {};
  for (const item of final) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }
  console.log('\nArticles by category:');
  for (const [cat, n] of Object.entries(counts)) {
    console.log(`  ${cat}: ${n}`);
  }
  console.log(`\nTotal saved: ${final.length}\n`);

  const output = {
    fetched_at: new Date().toISOString(),
    count:      final.length,
    articles:   final,
  };

  const outputPath = path.join(__dirname, '..', 'api', 'news.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Written to api/news.json\n`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
