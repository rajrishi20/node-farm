const fs = require("fs"); //file system
const http = require("http"); //netowrking capabilities such as building etc.
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
/////////////FILES
// const hello = "hello world";
// console.log(hello);
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); //how to read from files
// console.log(textIn);
// // how to write into some files
// const textOut = `This is what we know about the avocado : ${textIn}.\nCreated on ${Date.now()} `;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written");
//non-blocking ,asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR !");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written 😊");
//       });
//     });
//   });
// });
// console.log("will read file");
/////////////////////SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8"); //sync read even blocking than also cuz its the initial statement thats why...
const dataobj = JSON.parse(data); //fs.readFile("./dev-data/data.json");
// there is  an exception to this rule:
//     Now there is an exception to this rule,

// which is the require function.

// So when requiring modules,

// we can actually require our own modules,

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataobj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
    //product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataobj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" }); //200 status code for okay
    res.end(data);
    console.log(dataobj);
    //So what we want to do now is to actually read the data from this file here, then parse JSON into JavaScript,and then send back that result to the client.
    //not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world", //these are used to send some meta data response itself
    }); //check -> developer tool -> network tab
    //we can also specify some additional arg send header http header is a piece of response that we are sending back
    res.end("<h1>page not found</h1>"); //header just above this line should be setup before this responce line
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listen to requests on port 8000");
}); //port-8000(sub address) local host-default 127.0.0.1 standart ip address additional message as a call back function that server atually started.
//ROuting
