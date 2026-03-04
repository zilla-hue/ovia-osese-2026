import https from 'https';

https.get('https://html.duckduckgo.com/html/?q=kugile+font', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = data.match(/<a class="result__snippet[^>]*>(.*?)<\/a>/g);
    if (matches) {
      console.log(matches.slice(0, 5).join('\n'));
    } else {
      console.log("No results found.");
    }
  });
}).on('error', (err) => {
  console.error(err);
});
