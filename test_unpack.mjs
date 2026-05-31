import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

const html = execSync('curl.exe -s -L "https://nekolions.my.id/embed/htf5fo3b2656"', { encoding: 'utf-8' });

function findAllUrls(text) {
  const urls = [];
  const patterns = [
    /https?:\/\/[^"'\s<>)\]]+/g,
    /\/\/[^"'\s<>)\]]+\.(?:m3u8|mp4)[^"'\s<>)\]]*/g,
  ];
  for (const pat of patterns) {
    const matches = text.match(pat);
    if (matches) urls.push(...matches);
  }
  return urls;
}

function findVideoUrls(urls) {
  return urls.filter(u =>
    /\.(?:m3u8|mp4)(?:\?|$)/i.test(u) ||
    /\/master\.txt(?:\?|$)/i.test(u) ||
    /\/(?:index|playlist|media)\.txt(?:\?|$)/i.test(u) ||
    /\/(?:video|stream|play|media|cdn|hls)\//i.test(u) ||
    /(?:video|stream|play|cdn|hls)\./i.test(new URL(u).hostname) ||
    /\/(?:hls|hls2|hls3|hls4)\/(?:\d+\/)*(?:[^/]+\/)*[^/]+(?:master|index|playlist|media)\.(?:txt|m3u8)/i.test(u)
  );
}

function unpackJsPacker(text) {
  const match = text.match(
    /eval\s*\(\s*function\s*\(p,a,c,k,e,d\)\{[\s\S]*?return\s+p\}\s*\('((?:[^'\\]|\\.)*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^'\\]|\\.)*)'\s*\.\s*split\s*\(\s*['"][|]\s*['"]\s*\)(?:\s*,\s*\{\s*\})?\s*\)\s*\)/
  );
  if (!match) return null;
  
  const payload = match[1];
  const a = parseInt(match[2]);
  const c = parseInt(match[3]);
  const raw = match[4];
  const k = raw.split('|');
  
  const eFn = (code) => {
    const quot = Math.floor(code / a);
    const rem = code % a;
    let result = '';
    if (quot > 0) result += eFn(quot);
    result += rem > 35 ? String.fromCharCode(rem + 29) : rem.toString(36);
    return result;
  };
  
  let result = payload;
  for (let i = 0; i < c; i++) {
    if (k[i]) {
      const word = eFn(i);
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp('\\b' + escaped + '\\b', 'g'), k[i]);
    }
  }
  
  return result;
}

console.log('=== PACKER TEST ===');
const unpacked = unpackJsPacker(html);
if (unpacked) {
  console.log('UNPACKED LENGTH:', unpacked.length);
  console.log('UNPACKED (first 800):', unpacked.substring(0, 800));
  const all = findAllUrls(unpacked);
  console.log('\nALL URLS:', JSON.stringify(all, null, 2));
  const vids = findVideoUrls(all);
  console.log('\nVIDEO URLS:', JSON.stringify(vids, null, 2));
} else {
  console.log('PACKER: no match');
  const m = html.match(/eval\s*\(\s*function\s*\(p,a,c,k,e,d\)/);
  console.log('BASIC MATCH:', m ? 'YES at ' + m.index : 'NO');
}
