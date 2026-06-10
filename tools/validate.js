#!/usr/bin/env node
// tools/validate.js — static validation for the 学伴 mini-program.
// Run: node tools/validate.js   (from repo root)
// Checks: JSON validity, JS syntax, WXML tag balance, page registration,
// navigation targets, component paths, require() resolution, CSS class usage.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === '.DS_Store') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const rel = (p) => path.relative(ROOT, p);

// ---------- 1. JSON validity ----------
for (const f of files.filter((f) => f.endsWith('.json'))) {
  try {
    JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (e) {
    errors.push(`JSON parse error in ${rel(f)}: ${e.message}`);
  }
}

// ---------- 2. JS syntax ----------
for (const f of files.filter((f) => f.endsWith('.js') && !f.includes('tools/'))) {
  try {
    execFileSync('node', ['--check', f], { stdio: 'pipe' });
  } catch (e) {
    errors.push(`JS syntax error in ${rel(f)}: ${e.stderr.toString().split('\n')[0]}`);
  }
}

// ---------- 3. WXML tag balance ----------
function checkWxml(file) {
  const src = fs.readFileSync(file, 'utf8');
  const stack = [];
  let i = 0;
  while (i < src.length) {
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i);
      if (end < 0) { errors.push(`${rel(file)}: unterminated comment`); return; }
      i = end + 3;
      continue;
    }
    if (src[i] !== '<') { i++; continue; }
    // parse tag respecting quoted attribute values
    let j = i + 1, quote = null;
    while (j < src.length) {
      const c = src[j];
      if (quote) { if (c === quote) quote = null; }
      else if (c === '"' || c === "'") quote = c;
      else if (c === '>') break;
      j++;
    }
    if (j >= src.length) { errors.push(`${rel(file)}: unterminated tag at offset ${i}`); return; }
    const tag = src.slice(i + 1, j);
    if (tag.startsWith('/')) {
      const name = tag.slice(1).trim();
      const top = stack.pop();
      if (top !== name) {
        errors.push(`${rel(file)}: closing </${name}> but expected </${top || 'nothing'}>`);
        return;
      }
    } else if (!tag.endsWith('/')) {
      const name = tag.split(/[\s\n]/)[0];
      if (name) stack.push(name);
    }
    i = j + 1;
  }
  if (stack.length) errors.push(`${rel(file)}: unclosed tags: ${stack.join(', ')}`);
}
for (const f of files.filter((f) => f.endsWith('.wxml'))) checkWxml(f);

// ---------- 4. page registration ----------
const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
const registered = appJson.pages;
const tabPages = appJson.tabBar.list.map((t) => t.pagePath);

for (const page of registered) {
  for (const ext of ['.js', '.json', '.wxml', '.wxss']) {
    if (!fs.existsSync(path.join(ROOT, page + ext))) {
      errors.push(`Registered page ${page} missing ${ext} file`);
    }
  }
}
// reverse: page dirs on disk that aren't registered
const pageDirs = new Set(
  files.filter((f) => /\/pages\/[^/]+\/[^/]+\.wxml$/.test(f)).map((f) => rel(f).replace(/\.wxml$/, ''))
);
for (const p of pageDirs) {
  if (!registered.includes(p)) errors.push(`Page on disk not registered in app.json: ${p}`);
}
for (const t of tabPages) {
  if (!registered.includes(t)) errors.push(`tabBar page not in pages[]: ${t}`);
}

// ---------- 5. navigation targets ----------
for (const f of files.filter((f) => f.endsWith('.js') && f.includes('/pages/'))) {
  const src = fs.readFileSync(f, 'utf8');
  const navRe = /wx\.(navigateTo|redirectTo|switchTab)\(\s*\{[^}]*?url:\s*['"`]([^'"`]+)['"`]/gs;
  let m;
  while ((m = navRe.exec(src))) {
    const kind = m[1];
    const target = m[2].split('?')[0].replace(/^\//, '');
    if (!target.startsWith('pages/')) continue; // dynamic url, skip
    if (!registered.includes(target)) {
      errors.push(`${rel(f)}: ${kind} to unregistered page ${target}`);
    } else if (kind === 'switchTab' && !tabPages.includes(target)) {
      errors.push(`${rel(f)}: switchTab to non-tab page ${target}`);
    } else if ((kind === 'navigateTo' || kind === 'redirectTo') && tabPages.includes(target)) {
      errors.push(`${rel(f)}: ${kind} to TAB page ${target} (must use switchTab)`);
    }
  }
}

// ---------- 6. usingComponents paths ----------
for (const f of files.filter((f) => f.endsWith('.json') && (f.includes('/pages/') || f.includes('/components/')))) {
  const cfg = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const [name, p] of Object.entries(cfg.usingComponents || {})) {
    const compPath = p.startsWith('/')
      ? path.join(ROOT, p.slice(1))
      : path.resolve(path.dirname(f), p);
    if (!fs.existsSync(compPath + '.js')) {
      errors.push(`${rel(f)}: component "${name}" path ${p} does not resolve`);
    }
  }
}

// ---------- 7. require() resolution ----------
for (const f of files.filter((f) => f.endsWith('.js') && !f.includes('cloudfunctions/') && !f.includes('tools/'))) {
  const src = fs.readFileSync(f, 'utf8');
  const reqRe = /require\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while ((m = reqRe.exec(src))) {
    const p = m[1];
    if (!p.startsWith('.')) continue;
    const resolved = path.resolve(path.dirname(f), p);
    if (!fs.existsSync(resolved) && !fs.existsSync(resolved + '.js')) {
      errors.push(`${rel(f)}: require('${p}') does not resolve`);
    }
  }
}

// ---------- 8. CSS class usage (warnings only) ----------
function definedClasses(wxssFile) {
  if (!fs.existsSync(wxssFile)) return new Set();
  const src = fs.readFileSync(wxssFile, 'utf8');
  const out = new Set();
  const re = /\.([A-Za-z][A-Za-z0-9_-]*)/g;
  let m;
  while ((m = re.exec(src))) out.add(m[1]);
  return out;
}
const globalClasses = definedClasses(path.join(ROOT, 'app.wxss'));
for (const f of files.filter((f) => f.endsWith('.wxml'))) {
  const pageClasses = definedClasses(f.replace(/\.wxml$/, '.wxss'));
  const src = fs.readFileSync(f, 'utf8');
  const classRe = /class="([^"]*)"/g;
  let m;
  const missing = new Set();
  while ((m = classRe.exec(src))) {
    // strip dynamic {{...}} parts, check static tokens only
    const staticPart = m[1].replace(/\{\{[^}]*\}\}/g, ' ');
    for (const cls of staticPart.split(/\s+/).filter(Boolean)) {
      if (!pageClasses.has(cls) && !globalClasses.has(cls)) missing.add(cls);
    }
  }
  if (missing.size) warnings.push(`${rel(f)}: classes with no definition: ${[...missing].join(', ')}`);
}

// ---------- 9. WXML binding method calls (the classic breakage) ----------
for (const f of files.filter((f) => f.endsWith('.wxml'))) {
  const src = fs.readFileSync(f, 'utf8');
  const bindRe = /\{\{([^}]+)\}\}/g;
  let m;
  while ((m = bindRe.exec(src))) {
    const expr = m[1];
    if (/\.\s*(join|map|filter|includes|toFixed|slice|split|replace|indexOf|find|some|reduce)\s*\(/.test(expr)) {
      errors.push(`${rel(f)}: method call in WXML binding: {{${expr.trim().slice(0, 60)}}}`);
    }
  }
}

// ---------- report ----------
console.log(`\nChecked ${files.length} files.`);
if (errors.length) {
  console.log(`\n❌ ${errors.length} ERROR(S):`);
  errors.forEach((e) => console.log('  - ' + e));
}
if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log('  - ' + w));
}
if (!errors.length) console.log('\n✅ No errors.');
process.exit(errors.length ? 1 : 0);
