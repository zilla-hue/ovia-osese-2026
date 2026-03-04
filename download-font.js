import https from 'https';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const url = 'https://dl.dafont.com/dl/?f=kugile';
const dest = 'kugile.zip';

if (!fs.existsSync('public/fonts')) {
  fs.mkdirSync('public/fonts', { recursive: true });
}

https.get(url, (res) => {
  const file = fs.createWriteStream(dest);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded zip.');
    try {
      execSync('npx -y decompress-cli kugile.zip public/fonts');
      console.log('Unzipped successfully.');
    } catch (e) {
      console.error('Error unzipping:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
