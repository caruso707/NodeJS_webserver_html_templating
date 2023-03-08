const fs = require('fs'); 
const http = require('http'); 
const url = require('url'); 

// Functions
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCT%}/g, product.productName);
    output = output.replace(/{%EMOJI%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%LOCATION%}/g, product.from);
    if(!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output;
}

// Data
const tempOverview = fs.readFileSync(`${__dirname}/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const productData = JSON.parse(data);
const cardsHtml = productData.map(el => replaceTemplate(tempCard, el)).toString();
const overviewHTML = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

//Server
const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url, true)['pathname'];
    const ID = url.parse(req.url, true)['query']['id']

    // Overview Page
    if(pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(overviewHTML);
        
    // Products Page
    } else if (pathName === '/products') {
        res.writeHead(200, {'Content-type': 'text/html'});
        productHTML = replaceTemplate(tempProduct, productData[ID]).toString();       
        res.end(productHTML);
    
    // API
    } else if (pathName === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    
    // Not Found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'error'
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to requests on port 8000")
})