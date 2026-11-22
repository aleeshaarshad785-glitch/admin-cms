// Netlify build pe chalta hai: content/phones/*.md padh kar products.json banata hai
const fs = require('fs');
const path = require('path');

const dir = 'content/phones';
const items = [];

if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir).sort().reverse()) {
    if (!f.endsWith('.md')) continue;
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) continue;
    const o = {};
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(':');
      if (i < 1) continue;
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      o[k] = v;
    }
    o.body = m[2].trim();
    items.push(o);
  }
}

fs.writeFileSync('products.json', JSON.stringify(items));
console.log('products.json ready:', items.length, 'phones');
