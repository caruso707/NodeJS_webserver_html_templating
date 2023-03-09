// Dependencies
const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replace_template = require(`./modules/replace_template`);

// Data
const tempOverview = fs.readFileSync(`${__dirname}/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const productData = JSON.parse(data);
const slugs = productData.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
const cardsHtml = productData
  .map((el) => replace_template(tempCard, el, slugs))
  .toString();
const overviewHTML = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

// Server
const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true)['pathname'];

  // Overview Page
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(overviewHTML);

    // Products Page
  } else if (pathName === '/products') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const ID = slugs.indexOf(url.parse(req.url, true)['query']['id']);
    // const ID = url.parse(req.url, true)['query'][idIndex]
    productHTML = replace_template(
      tempProduct,
      productData[ID],
      slugs
    ).toString();
    res.end(productHTML);

    // API
  } else if (pathName === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'error',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
