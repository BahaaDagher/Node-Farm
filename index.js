const fs = require('fs') ;
const http = require("http") ; 
const url = require("url") ;
const slugify = require("slugify") ; 




const replaceTemplate = require('./modules/replaceTemplate')

//////////////////////////////////////////////////
///////// FILES

// // reading and writing

// // blocking, synchronous way 
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf8') ;
// //console.log(textIn) ;

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}` ;
// fs.writeFileSync('./starter/txt/output.txt', textOut) ;


// // no-blocking, asynchronous way
// fs.readFile('./starter/txt/start.txt' ,  'utf8' , (err , data1)=>{
//     console.log(data1) ; 
//     fs.readFile(`./starter/txt/${data1}.txt` ,  'utf8' , (err , data2)=>{
//         console.log(data2) ; 
//         fs.readFile(`./starter/txt/append.txt` ,  'utf8' , (err , data3)=>{
//             console.log(data3) ; 
//             fs.writeFile(`./starter/txt/final.txt` , `${data2}\n${data3}` , (err )=>{
//                 console.log("your file has been written 😀") ; 
//             }) ;
//         }) ;
//     }) ;
// }) ;
// console.log("file will read ");


//////////////////////////////////////////////////
///////// SERVER



const tempCard = fs.readFileSync("./starter/templates/template-card.html" , "utf-8") ;
const tempOverview = fs.readFileSync("./starter/templates/template-overview.html" , "utf-8") ;
const tempProduct = fs.readFileSync("./starter/templates/template-product.html" , "utf-8") ;


const data = fs.readFileSync("./starter/dev-data/data.json" , "utf-8") ;
const dataObj = JSON.parse(data) ;


const productNameLower = dataObj.map( (el) => slugify(el.productName , {lower :true } ))
console.log(productNameLower)


const server = http.createServer((req , res) =>{
    console.log(req.url) ;
    // console.log(url.parse(req.url, true)) ;
    const {query , pathname}  = url.parse(req.url, true) ;
    if (pathname == '/' || pathname == '/overview'){
        res.writeHead(200 , {
            'Content-type' : 'text/html'
        }) ;

        const cardsHtml = dataObj.map ((el)=>  replaceTemplate(tempCard , el)).join('') ;
        const output = tempOverview.replace(/{%PRODUCTCARDS%}/g , cardsHtml) ;
        res.end(output) ;
    } 





    else if (pathname == '/product'){
        res.writeHead(200 , {
            'Content-type' : 'text/html'
        }) ;
        const product = dataObj[query.id] ;
        const output = replaceTemplate(tempProduct , product)
        res.end(output) ;
    }
    else if (pathname == '/api'){
        res.writeHead(200 , {
            'Content-type' : 'application/json'
        }) ;
        res.end(data) ;
    }
    else {
        res.writeHead(404 , {
            'Content-type' : 'text/html' , 
            'my-own-header' : 'hello-world'
        }) ;
        res.end(`<h1>page not found</h1>`) ;
    }
})



server.listen(8000 ,'127.0.0.1' ,  ()=>{
    console.log("server is listening on port 8000") ;
});


