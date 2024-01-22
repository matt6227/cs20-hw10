
/* necessary stuff */
var http = require("http");
var fs = require("fs");
var qs = require("querystring");


/* We want to connect to MongoDB Atlas so we do following steps: */
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://matthewsoto:F9UpwlOxfc2J03F9@cluster0.zlhmrc8.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(url);
client.connect();


http.createServer(function (req, res) {
   /* This code is used to display form */
   if (req.url == "/") {
       file = "form.html";
       fs.readFile(file, function (err, txt) {
           res.writeHead(200, { "Content-Type": "text/html" });
           res.write('<link rel="stylesheet" type ="text/css" href="/form.css">');
           res.write(txt);
           res.end();
       });
   /* read form data: */
   } else if (req.url == "/part_two.js") {
       var results = "";


       res.writeHead(200, { "Content-Type": "text/html" });
       res.write('<link rel="stylesheet" type ="text/css" href="/form.css">');
       req.on("data", (data) => {
           results += data.toString();
       });


       /* process form data */
       req.on("end", async () => {
           results = qs.parse(results);
           res.write( "<br><h3>Search Term: " + results["searchTerm"] + "</h3><br>");
           var db = client.db("hate_Stock_Ticker");
           var collection = db.collection("companies");


           /* show results using the code below: */
           res.write("<h3>Results:</h3><br>");
           if (results["searchType"] == "company") {
               const docs = await collection.find({ company: results["searchTerm"] }).toArray();
               docs.forEach(function (doc) {
                   res.write("<div class='result1'>" + doc.company + "</div><br>");
                   res.write("<div class='result'>" + doc.ticker + "</div><br>");
                   res.write("<div class='result'>" + doc.price + "</div><br><br>");
               });
           } else {
            /*  find colleciton and then company, ticker, and price*/
               const docs = await collection.find({ ticker: results["searchTerm"] }).toArray();
               docs.forEach(function (doc) {
                   res.write("<div class='result1'>" + doc.company + "</div><br>");
                   res.write("<div class='result'>" + doc.ticker + "</div><br>");
                   res.write("<div class='result'>" + doc.price + "</div><br><br>");
               });
           }
           res.end();
       });
   } else if (req.url === "/form.css") {
       const contents = fs.readFileSync("form.css", "utf-8");
       res.writeHead(200, { "Content-Type": "text/css" });
       res.write(contents);
       res.end();
   } else {
       res.writeHead(200, { "Content-Type": "text/html" });
       res.write("Unknown page request");
       res.end();
   }
}).listen(8080);
