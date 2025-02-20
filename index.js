const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules_js/replaceTemplate');

//=================== Files ========================
// Blocking, Synchronus way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8',(err, data1) => {
//     if(err) return console.log('ERROR! 🛑');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8',(err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8',(err, data3) => {
//             console.log(data3);
            
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8', err => {
//                 console.log('Your file has been written 😀');
//             })
//         });
//     });
// });
// console.log('Will read file!');

//=================== Server ========================
const tempOverview = fs.readFileSync(`${__dirname}/templates/template_overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template_card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template_product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    const pathName = req.url;


    // Overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html'});

        const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
        res.end(output);

    // Product Page
    } else if (pathname === '/product') {
        const product = dataObj[query.id];
        res.writeHead(200, { 'Content-type': 'text/html'});
        const output = replaceTemplate(tempProduct, product);

        res.end(output);

    // API
    } else if(pathname === '/api') {
         res.writeHead(200, { 'Content-type': 'application/json'})
         res.end(data);  
         
    // Not Found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});