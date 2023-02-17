
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
 * Classes.
 * Classes.
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
 * id
 * userId
 * token
 */
class Session {
  id;
  userId;
  token;
  
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.token = data.token;
  }
}

/**
 * id
 * firstName
 * lastName
 * username
 * password
 */
class User {
  id;
  firstName;
  lastName;
  username;
  password;

  constructor(data) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.username = data.username;
    this.password = data.password;
  }
}

/**
 * @params : Standard
 */
function getGlitsFromDB (req, response) {
  client.query("SELECT * FROM glits ORDER BY datetime DESC",  (err, result) => {
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

// Testing
function getUser(request, response) {
  const username = "jascha";
  // const { username, password } = request.body;
  console.log("Line 92 - " + username);

  // const queryString = "SELECT * FROM users WHERE user_name = 'jascha'";
  const queryString = "SELECT * FROM users WHERE user_name = $1;";
  // client.query(queryString), (err, result) => {
  client.query(queryString, [username], (err, result) => {
    console.log(result.rows);
  } )
}

/**
 * 
 * @param {*} request 
 * @param {*} response 
 */
// Sessions / product

function postSession(request, response) {
  // const username = "jascha";
  // const { username, password } = request.body;
  var { username, password } = request.body;
  if (! username || ! password) {
    console.log("Username or PW from form missing")
    response.status(401).send("Please send username and password!");
  }
  else { 

  const queryString = "SELECT * FROM users WHERE user_name = $1;";
  client.query(queryString, [username], (err, result) => {
    if (err) {
      console.log("Error quering database");
      response.status(500).send("Error quering database");
    }
    else {        // success query
      if ( ( result.rowCount != "1" ) ) {          // not exactly one record found
        console.log("----no result ------------------");
        console.log("User " + username + " not in DB or ambiguous");
        response.status(401).send("Please send username and password!");
      }
      //                                          
      else {      // row count = 1 ; delete existing sessions of user

        currUser = new User({     // fill user
          id: result.rows[0].id,
          firstName: result.rows[0].first_name,
          lastName: result.rows[0].last_name,
          username: result.rows[0].user_name,
          password: result.rows[0].password
        });

        const queryString = "DELETE FROM sessions WHERE user_id = $1;";
        client.query(queryString,[currUser.id], (err,result) => {
          if (err) {
            response.status(400);
            console.log("Error deleting existing Usersessions");
          }
          // if (result) {
          else {
            response.status(202);
            console.log("DB delete exsting Usersessions successful");
          }
          // response.send(result);
        });      

      if ( ! (password.trim() === result.rows[0].password.trim())) {          // one record + Passwords not match
          console.log('\n + Password wrong. Supplied: ' + password + " vs. DB " + result.rows[0].password);
          response.status(401).send("Please send username and password!");
          }
      else {   
              // Password match : create Session

              userSession = new Session({
                userId: currUser.id,
                token: Math.random().toString(36)
              });

              const queryString = "INSERT INTO sessions (user_id, token) VALUES ($1, $2);";
              client.query(queryString,[userSession.userId, userSession.token], (err, result) => {
                if (err) {
                  response.status(400);
                }
                response.status(201);
                response.send(userSession);
              });

              
              // console.log("----------------------");
              // console.log('\nPassword correct !');
              // console.log('Username :' + currUser.username);
              // console.log('Password :' + currUser.password);
              // console.log('Userid :' + currUser.id);
              // console.log("----------------------");
              // response.status(200).send(result.rows);   // doCheck // don't send password / full record

              

          // doCheck // if Password correct create session ==> callback function !?!?
        } 
      }
    } 
  } )   // end client.query
  }
  // console.log("postsession hit");
}

// User
app.get("/user", postSession)
// app.get("/user", getUser)
// app.get("/user", getUser('jascha'))
// app.get("/user", (req, res) => {
//   client.query("SELECT * FROM users WHERE user_name = 'jascha'", (err, result) => {
//     console.log(result.rows);
//   })
// })
app.post("/sessions", postSession)

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


