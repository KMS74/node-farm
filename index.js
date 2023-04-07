const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./replaceTemplate');
const slugify = require('slugify');

/////////////////////////////////////
// FILES

// Blocking, synchronous way
// const textInput = fs.readFileSync("./txt/input.txt", "utf8");
// console.log(textInput);

// const textOut = `This what we know about avocado: ${textInput}.\n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// Non-blocking, asynchronous way
// Callback Hell Proplem
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) {
//     return console.log("ERROT =>", err);
//   }
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, (err) => {
//         console.log("Your file has been written (:");
//       });
//     });
//   });
// });

// console.log("Will read file!");

/////////////////////////////////////
// SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync();
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

// parse json data into javascript
const dataObj = JSON.parse(data);

// console.log(slugify("Fresh Avaocados", { lower: true }));
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  // const pathName = req.url;
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%PRODUCTCARD%}', cardsHtml);
    res.end(output);
  }
  // Product Page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'Application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end(`<h1>Page not found</h1>`);
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log(`Server is running http://127.0.0.1:8000`);
});
