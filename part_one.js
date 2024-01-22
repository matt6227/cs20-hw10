const fs = require('fs');
const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://matthewsoto:F9UpwlOxfc2J03F9@cluster0.zlhmrc8.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url);


async function main() {
   try {
       await client.connect();
       console.log("Connected to MongoDB!");
   } catch (err) {
       console.log('failed to connect');
   }


   /* create FINAL_Stock_Ticker */
   var db = client.db("FINAL_Stock_Ticker");
   /* create collection companies*/
   var collection = db.collection('companies');
   var read_stream = fs.createReadStream('companies.csv');
   var read_interface = readline.createInterface({ input: read_stream });

  /* ignore the first line of the CSV file */
   let headerLine = true;
   read_interface.on('line', async(line) => {
       if (headerLine == true) {
           headerLine = false;
           return;
       }

       const [name, ticker, price] = line.split(',');
       const company = { company: name, ticker: ticker, price: parseFloat(price) };

       try {
           await collection.insertOne(company);
       } catch (err) {
           console.log('Error inserting document', err);
       }
   });
}

main();
