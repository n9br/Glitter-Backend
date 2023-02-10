
/**
 * Const.
 * 
 */

const cors = require("cors");
const { Client } = require('pg');

const express = require("express");     
const { request } = require("http");

const app = express();
const port = 4000;

const client = new Client({
  user: "postgres", 
  database: "glitter", 
  password: "ee49f2c1d69f42faa6f5c91dc1daa8d9"
});

client.connect();   // hier richtig

/**
 * Middleware.
 */

app.use(cors({
  origin: '*'
}));
app.use(express.json());

/**#
 * Class.
 * 
 */


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

/**
 * @params : Standard
 */
function getGlitsFromDB (req, response) {
  client.query("SELECT * FROM glits ORDER BY datetime DESC", (err, result) => {
    // console.log(result.rows);
    response.send(result.rows);
  })
  // return(result.rows);
}

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

function getUser(request, response) {
  const username = "jascha";
  // username = request;
  console.log("Line 92 - " + username);

  // const queryString = "SELECT * FROM users WHERE user_name = 'jascha'";
  const queryString = "SELECT * FROM users WHERE user_name = $1;";
  // client.query(queryString), (err, result) => {
  client.query(queryString, [username], (err, result) => {
    console.log(result.rows);
  } )
}

// Session
app.get("/user", getUser)
// app.get("/user", getUser('jascha'))
// app.get("/user", (req, res) => {
//   client.query("SELECT * FROM users WHERE user_name = 'jascha'", (err, result) => {
//     console.log(result.rows);
//   })
// })

// app.post("/sessions", postSession)

// Glits Get
app.get('/glits',getGlitsFromDB)
app.post('/glits',postGlitsToDB) 

// Hello World
app.get('/', (req, res) => {
  res.send('Hello World from expressJS!')
})

app.listen(port, () => {          // actually run server (listen on port)
  console.log(`Glitter Server listening on port ${port}`)
})


