const http = require('http');
let data = [];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'GET' && req.url === '/api/data') res.end(JSON.stringify(data));
  if (req.method === 'POST' && req.url === '/api/data') req.on('data', chunk => data.push(JSON.parse(chunk))).on('end', () => res.end());
  if (req.method === 'PUT' && req.url === '/api/data') req.on('data', chunk => (data = JSON.parse(chunk))).on('end', () => res.end());
  if (req.method === 'DELETE' && req.url === '/api/data') (data = []), (res.statusCode = 204), res.end();
  if (!res.finished) res.statusCode = 404, res.end('Not Found');
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

//curl -X POST -H "Content-Type: application/json" -d '{"name":"Novo Dado"}' http://localhost:3000/api/data

