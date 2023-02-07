
const fs = require("fs");
const cors = require("cors");
const { Client } = require('pg');

// const bodyParser = require('body-parser');
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

const express = require("express");     
// const { text } = require("body-parser");
const app = express();
const port = 4000;


const client = new Client({user: "postgres", database: "glitter", password: "ee49f2c1d69f42faa6f5c91dc1daa8d9"} );
client.connect();

client.query('SELECT $1::text as message', ['Hello world from postgres!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  client.end()
})

const glitsFile = "./glits.json";

app.use(cors({
  origin: '*'
}));
app.use(express.json());

/**
 *avatarId: number;
  user: string;
  text: string;
  datetime: string;
 */

class Glit {
  // id;
  avatarId;
  user;
  text;
  datetime;

  constructor(data) {
    // this.id = data.id;
    this.avatarId = data.avatarId;  
    this.user = data.user;
    this.text = data.text;
    this.datetime = data.datetime;
  }
}

function readGlitsFromFile() {
  try {
    const filedata = fs.readFileSync(glitsFile).toString();
    const jsonglits = JSON.parse(filedata);
    return jsonglits;
  } catch (e) {
    return []
  }
}

// Hello World
app.get('/', (req, res) => {
  res.send('Hello World from expressJS!')
})

// Glits Get
app.get('/glits', (req, res) => {
    res.send(readGlitsFromFile().reverse())
  })

  // Glits Post
app.post('/glits', (req, res) => {
  // console.log(req.body);    
    const glits = readGlitsFromFile();
    const glit = new Glit(req.body);          // from payload
    glits.push(glit);
    fs.writeFileSync(glitsFile,JSON.stringify(glits));
    res.status(201).send();                         // set statuscode 201 and send
})                                 
                                

app.listen(port, () => {          // actually run server (listen on port)
  console.log(`Glitter Server listening on port ${port}`)
})


