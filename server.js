const http = require('http');
const { parse } = require('url');

let data = [];

const server = http.createServer((req, res) => {
  const { pathname, method } = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');

  const getIndexById = id => data.findIndex(item => item.id === id);

  switch (method) {
    case 'GET':
      if (pathname === '/api/items') return res.end(JSON.stringify(data));
      break;
    case 'POST':
      if (pathname === '/api/items') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          const newItem = { ...JSON.parse(body), id: (data.length > 0 ? Math.max(...data.map(item => item.id)) : 0) + 1 };
          data.push(newItem);
          res.end(JSON.stringify(newItem));
        });
      }
      break;
    case 'PUT':
    case 'DELETE':
      if (pathname.startsWith('/api/items/')) {
        const itemId = parseInt(pathname.split('/').pop(), 10);
        const itemIndex = getIndexById(itemId);
        if (itemIndex !== -1) {
          if (method === 'PUT') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              data[itemIndex] = { ...data[itemIndex], ...JSON.parse(body) };
              res.end(JSON.stringify(data[itemIndex]));
            });
          } else {
            const [deletedItem] = data.splice(itemIndex, 1);
            res.end(JSON.stringify({ message: 'Item removido com sucesso.', deletedItem }));
          }
        }
      }
      break;
  }

  res.writeHead(404, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ error: 'Rota não encontrada' }));
});

const porta = 3000;
server.listen(porta, () => console.log(`Server running http://localhost:${porta}`));
