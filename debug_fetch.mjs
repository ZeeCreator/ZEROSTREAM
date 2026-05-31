import { execSync } from 'child_process';

try {
  const html = execSync('curl.exe -s -L --max-time 10 "https://nekolions.my.id/embed/htf5fo3b2656"', { encoding: 'utf-8', timeout: 15000 });
  console.log('LENGTH:', html.length);
  console.log('FIRST 300:', html.substring(0, 300));
  console.log('HAS packer:', html.includes('eval(function(p,a,c,k,e,d)'));
  console.log('HAS master.m3u8:', html.includes('master.m3u8'));
  console.log('HAS hls2:', html.includes('hls2'));
  console.log('HAS /dl?op:', html.includes('/dl?op'));
} catch(e) {
  console.log('ERROR:', e.message);
}
