
const fs = require("fs");
const cors = require("cors");
const { Client } = require('pg');

// const bodyParser = require('body-parser');
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

const express = require("express");     
const { request } = require("http");
// const { text } = require("body-parser");
const app = express();
const port = 4000;


const client = new Client({
  user: "postgres", 
  database: "glitter", 
  password: "ee49f2c1d69f42faa6f5c91dc1daa8d9"
});

client.connect();   // hier richtig
  // console.log('Success connect');

// client.query('SELECT $1::text as message', ['Hello world from postgres!'], (err, res) => {
//   console.log(err ? err.stack : res.rows[0].message) // Hello World!
//   client.end()
// })

// const glitsFile = "./glits.json";

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
  avatarid;
  user;
  text;
  datetime;

  constructor(data) {
    // this.id = data.id;
    this.avatarid = data.avatarid;  
    this.user = data.user;
    this.text = data.text;
    this.datetime = data.datetime;
  }
}

// function readGlitsFromFile() {
//   try {
//     const filedata = fs.readFileSync(glitsFile).toString();
//     const jsonglits = JSON.parse(filedata);
//     return jsonglits;
//   } catch (e) {
//     return []
//   }
// }

/**
 * @params : Standard
 */
function getGlitsFromDB (req, response) {
  client.query("SELECT * FROM glits ORDER BY datetime DESC", (err, result) => {
    // console.log(result.rows);
    response.send(result.rows);
    // response.send(result.rows.reverse());
  })
  // return(result.rows);
}

// Glits Get
app.get('/glits',getGlitsFromDB)

// app.get('/glits', (req, res) => {
//     // res.send(readGlitsFromFile().reverse())
//     res.send(getGlitsFromDB());
//   })

// simpel
// app.get('/glits', (req,res) => {
//     client.query('SELECT * FROM glits', (err, results) => {
//       res.send(results.rows);
//     })

//   }
// )


  // Glits Post
  app.post('/glits',postGlitsToDB) 

  function postGlitsToDB(request, response) {
    const glit = new Glit(request.body);
    console.log(glit);

    const queryString = "INSERT INTO glits (avatarId, \"user\", text, datetime) VALUES ($1, $2, $3, $4)"
    // console.log(client.query(queryString, [glit.avatarId, glit.user, glit.text, glit.datetime]));
    client.query(queryString, [glit.avatarId, glit.user, glit.text, glit.datetime], (err, result) => {
      if (err) {
        response.status(400);
      }
      response.status(201);
      response.send(glit);
      }
    )
  }

// Hello World
app.get('/', (req, res) => {
  res.send('Hello World from expressJS!')
})

app.listen(port, () => {          // actually run server (listen on port)
  console.log(`Glitter Server listening on port ${port}`)
})


