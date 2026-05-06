import https from 'https';

https.get('https://cdnjs.cloudflare.com/ajax/libs/recharts/2.12.0/Recharts.js', (res) => {
  console.log(res.statusCode);
});
https.get('https://unpkg.com/recharts/umd/Recharts.js', (res) => {
    console.log("unpkg:", res.statusCode);
});
