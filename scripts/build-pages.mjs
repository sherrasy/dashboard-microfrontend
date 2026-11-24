// Сборка трёх приложений для деплоя на GitHub Pages.
//
// GH Pages обслуживает репозиторий по пути https://<user>.github.io/<repo>/,
// поэтому каждое приложение собирается со своим base:
//   /<repo>/host, /<repo>/catalog, /<repo>/cart
// и хост получает URL ремоутов, указывающие на эти же пути (origin-относительные,
// username в коде не нужен). Фолбека-стейджинга на Pages нет — fallback = основной URL.
//
// Использование:
//   node scripts/build-pages.mjs --base=/<repo>
import { execSync } from 'node:child_process';
import { cpSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const arg = process.argv.find((item) => item.startsWith('--base='));
const rawBase = (arg ? arg.slice('--base='.length) : process.env.GH_PAGES_BASE ?? '').trim();

if (!rawBase || rawBase === '/' || rawBase === '/<repo>') {
  console.error(
    'Укажите base-путь репозитория: node scripts/build-pages.mjs --base=/имя-репозитория',
  );
  process.exit(1);
}

const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}`;
const appPath = (app) => `${base}/${app}`;

writeFileSync(
  path.join(root, 'apps/host-shell/.env.production'),
  [
    '# Сгенерировано scripts/build-pages.mjs (workflow Deploy to GitHub Pages).',
    '# Руками не редактировать — изменения перезапишутся следующей сборкой.',
    `VITE_CATALOG_REMOTE_URL=${appPath('catalog')}/assets/remoteEntry.js`,
    `VITE_CART_REMOTE_URL=${appPath('cart')}/assets/remoteEntry.js`,
    '# Стейджинг-фолбека на GH Pages нет: fallback = основной URL.',
    `VITE_CATALOG_REMOTE_FALLBACK_URL=${appPath('catalog')}/assets/remoteEntry.js`,
    `VITE_CART_REMOTE_FALLBACK_URL=${appPath('cart')}/assets/remoteEntry.js`,
    '',
  ].join('\n'),
);

const run = (command, envExtra = {}) =>
  execSync(command, {
    cwd: root,
    env: { ...process.env, ...envExtra },
    stdio: 'inherit',
  });

console.log(`\n=== Сборка для GH Pages, base: ${base} ===\n`);

run('npm run build -w @marketplace/shared');
run('npm run build -w @marketplace/remote-catalog', { BASE_PATH: appPath('catalog') });
run('npm run build -w @marketplace/remote-cart', { BASE_PATH: appPath('cart') });
run('npm run build -w @marketplace/host-shell', { BASE_PATH: appPath('host') });

const pagesDir = path.join(root, 'pages');
rmSync(pagesDir, { recursive: true, force: true });

const appDirs = {
  host: 'apps/host-shell/dist',
  catalog: 'apps/remote-catalog/dist',
  cart: 'apps/remote-cart/dist',
};

for (const [name, dist] of Object.entries(appDirs)) {
  cpSync(path.join(root, dist), path.join(pagesDir, name), { recursive: true });
}

// По корню сайта (/repo/) GH Pages отдал бы 404 — редирект на хост.
writeFileSync(
  path.join(pagesDir, 'index.html'),
  [
    '<!doctype html>',
    '<html lang="ru">',
    '  <head>',
    '    <meta charset="utf-8" />',
    `    <meta http-equiv="refresh" content="0; url=${base}/host/" />`,
    `    <link rel="canonical" href="${base}/host/" />`,
    `    <title>Кофейный маркетплейс</title>`,
    '  </head>',
    `  <body><p><a href="${base}/host/">Кофейный маркетплейс</a></p></body>`,
    '</html>',
    '',
  ].join('\n'),
);

console.log('\n✔ pages/ готов.');
