/**
 * After Vite build, copy index.html into SEO route folders so crawlers
 * receive HTML at canonical paths (SPA shell + route-specific meta).
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const indexPath = join(dist, 'index.html');

const ROUTES = [
  '/',
  '/about',
  '/contact',
  '/help',
  '/neighbourhood',
  '/neighbourhood/lagos',
  '/neighbourhood/lagos/lekki',
  '/neighbourhood/lagos/ikoyi',
  '/neighbourhood/abuja',
  '/neighbourhood/abuja/gwarinpa',
  '/neighbourhood/port-harcourt',
  '/articles',
  '/articles/buying-guide-nigeria',
  '/articles/investment-hotspots',
  '/articles/land-documentation',
  '/articles/market-outlook-2026',
  '/requests',
  '/for-sale/in/lagos',
  '/for-sale/in/lagos/lekki',
  '/for-sale/in/lagos/ikoyi',
  '/for-sale/in/lagos/ajah',
  '/for-sale/in/abuja',
  '/for-sale/in/abuja/gwarinpa',
  '/for-sale/in/rivers',
  '/for-sale/in/rivers/port-harcourt',
  '/for-rent/in/lagos',
  '/for-rent/in/lagos/lekki',
  '/for-rent/in/abuja',
  '/shortlet/in/lagos',
  '/shortlet/in/lagos/lekki',
  '/shortlet/in/abuja',
  '/land/in/lagos',
  '/land/in/abuja',
  '/land/in/delta',
];

const META = {
  '/': {
    title: 'PropertyArena.ng — Find. Compare. Own.',
    description: "Nigeria's smartest property marketplace. Buy, rent, short let and land.",
  },
  '/for-sale/in/lagos': {
    title: 'Property for Sale in Lagos | PropertyArena.ng',
    description: 'Browse verified homes for sale in Lagos on PropertyArena.',
  },
  '/for-sale/in/lagos/lekki': {
    title: 'Property for Sale in Lekki, Lagos | PropertyArena.ng',
    description: 'Homes for sale in Lekki, Lagos — duplexes, apartments and more.',
  },
  '/neighbourhood': {
    title: 'Neighbourhood Guides | PropertyArena.ng',
    description: 'City and area guides across Nigeria with photos and listing links.',
  },
};

if (!existsSync(indexPath)) {
  console.error('[prerender] dist/index.html missing — run vite build first');
  process.exit(1);
}

const baseHtml = readFileSync(indexPath, 'utf8');

for (const route of ROUTES) {
  const meta = META[route] || {
    title: 'PropertyArena.ng',
    description: "Nigeria's property marketplace.",
  };
  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/i, `<title>${meta.title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${meta.description}" />`,
    );

  if (!/<meta\s+name="description"/i.test(html)) {
    html = html.replace(
      '</head>',
      `  <meta name="description" content="${meta.description}" />\n  <link rel="canonical" href="https://propertyarena.ng${route === '/' ? '/' : route}" />\n</head>`,
    );
  } else {
    html = html.replace(
      '</head>',
      `  <link rel="canonical" href="https://propertyarena.ng${route === '/' ? '/' : route}" />\n</head>`,
    );
  }

  if (route === '/') {
    writeFileSync(indexPath, html);
    continue;
  }

  const outDir = join(dist, ...route.slice(1).split('/'));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log('[prerender]', route);
}

console.log(`[prerender] Wrote ${ROUTES.length} routes`);
