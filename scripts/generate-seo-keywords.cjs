#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'client', 'pages');
const outFile = path.join(__dirname, '..', 'public', 'seo-keywords.json');

function kebab(s) {
  return s.replace(/\.tsx?$/i, '').replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]+/g, '-').toLowerCase();
}

function heuristics(name) {
  const keywords = ['SYPE Ministry', 'Seventh-day Adventist', 'Kigali', 'Rwanda'];
  if (/news/.test(name)) keywords.push('News', 'Articles', 'Press');
  if (/devotion|devotions|devotiondetail/.test(name)) keywords.push('Devotions', 'Daily devotion', 'Devotional');
  if (/donat/.test(name)) keywords.push('Donate', 'Donations', 'Giving');
  if (/contact/.test(name)) keywords.push('Contact', 'Contact Us', 'Phone', 'Email');
  if (/about/.test(name)) keywords.push('About', 'Mission', 'History');
  if (/projects/.test(name)) keywords.push('Projects', 'Community Projects', 'Programs');
  if (/membership/.test(name)) keywords.push('Membership', 'Join', 'Sign Up');
  if (/events|eventdetail/.test(name)) keywords.push('Events', 'Calendar', 'Register');
  if (/library/.test(name)) keywords.push('Library', 'Books', 'Downloads');
  if (/videos/.test(name)) keywords.push('Videos', 'YouTube', 'Media');
  return Array.from(new Set(keywords));
}

function main() {
  if (!fs.existsSync(pagesDir)) {
    console.error('Pages directory not found:', pagesDir);
    process.exit(1);
  }

  const files = fs.readdirSync(pagesDir).filter(f => /\.tsx?$/.test(f));
  const mapping = {};

  files.forEach(f => {
    const name = f.replace(/\.tsx?$/, '');
    const route = '/' + kebab(name).replace(/index|home/, '').replace(/^-+|-+$/g, '');
    const key = route === '/' ? '/' : route;
    const words = heuristics(name);
    words.unshift(name.replace(/([A-Z])/g, ' $1').trim());
    mapping[key] = words.join(', ');
    mapping[key.replace(/^\//, '')] = mapping[key];
  });

  if (!mapping['/']) mapping['/'] = 'SYPE Ministry, Home, Kigali, Rwanda';

  fs.writeFileSync(outFile, JSON.stringify(mapping, null, 2), 'utf8');
  console.log('Wrote', outFile);
}

main();
