
/**
 * Const.
 * 
 */

const cors = require("cors");
const { Client } = require('pg');

const express = require("express");     
const { request } = require("http");
// const { getUserByUsername } = require("../Code/Projects/Glitter/backend/src/models/user");

const app = express();
const port = 4000;

const client = new Client({
  user: "postgres", 
  database: "glitter", 
  password: "postgres"
  // password: "ee49f2c1d69f42faa6f5c91dc1daa8d9"
});

client.connect();   // hier richtig 

/**
 * Middleware.
 */

app.use(cors({
  origin: '*'
}));
app.use(express.json());

/**
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
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.username = data.user_name;
    this.password = data.password;
  }
}

/*****************************************
 * MODEL
 ****************************************/

// // Testing
// function getUser(request, response) {
//   const username = "jascha";
//   // const { username, password } = request.body;
//   console.log("Line 92 - " + username);

//   // const queryString = "SELECT * FROM users WHERE user_name = 'jascha'";
//   const queryString = "SELECT * FROM users WHERE user_name = $1;";
//   // client.query(queryString), (err, result) => {
//   client.query(queryString, [username], (err, result) => {
//     console.log(result.rows);
//   } )
// }

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

async function getUserByUsername(username) {
  const res = await client.query("SELECT * FROM users WHERE user_name = $1;",[username]);
  if (res.rowCount === 1) {
    // console.log("in getUserByUsername: " + JSON.stringify(res.rows[0]))
    return new User(res.rows[0])
  }
  return undefined
}

async function createSessionforUser(userId) {   // or id ?

  console.log(typeof(userId));
  await client.query("DELETE FROM sessions WHERE user_id = $1;",[userId])   // no check for success ; need a list !!

  const token = Math.random().toString(36);
  const res = await client.query(
    "INSERT INTO sessions (user_id, token) VALUES ($1, $2);",
    [userId, token]
    );                                          // funzt 02-21
  //  console.log(res.rows[0]);
   console.log(JSON.stringify(res));  
    // return new Session(res.rows[0])
  return new Session({userId, token})

  // userSession = new Session({
  //   // userId: currUser.id,
  //   userId: user.id,
  //   token: Math.random().toString(36)
  };

  // const queryString = "INSERT INTO sessions (user_id, token) VALUES ($1, $2);";
//   client.query(queryString,[userSession.userId, userSession.token], (err, result) => {
//     if (err) {
//       response.status(400);
//     }
//     response.status(201);
//     response.send(userSession);
//   });

//   console.log("ID: " + userSession.userId + " - Token: " + userSession.token);

// }


/*****************************************
 * VIEW
 ****************************************/


/*****************************************
 * CONTROLLER
 ****************************************/

/**
 * 
 * @param {*} request 
 * @param {*} response 
 */
// Sessions / product

async function postSession(request, response) {
  // const username = "jascha";
  // const { username, password } = request.body;
  var { username, password } = request.body;
  if (! username || ! password) {
    console.log("Username or PW from form missing")
    response.status(400).send("Please enter username and password!");
  }

  const user = await getUserByUsername(username);

  if ( ! user )  {
      response.status(401).send("Mismatch user or password");
  }
  else if ( ! (password.trim() === user.password.trim())) {          // one record + Passwords not match
    console.log('\n + Password wrong. Supplied: ' + password + " vs. DB " + user.password);
    response.status(401).send("Please send username and password!");
  }

  console.log("User.id before function: " + user.id)
  const session = await createSessionforUser(user.id);     // oder UserId ?!
  console.log("Userid: " + session.userId + ", Token: " + session.token)
  response.status(201).send({ token: session.token });

      // const queryString = "DELETE FROM sessions WHERE user_id = $1;";
      // // client.query(queryString,[currUser.id], (err,result) => {
      // client.query(queryString,[user.id], (err,result) => {
      //   if (err) {
      //     response.status(400);
      //     console.log("Error deleting existing Usersessions");
      //   }
      //   // if (result) {
      //   else {
      //     response.status(202);
      //     console.log("DB delete exsting Usersessions successful");
      //   }
      //   // response.send(result);
      // });      

    // if ( ! (password.trim() === user.password.trim())) {          // one record + Passwords not match
    //     console.log('\n + Password wrong. Supplied: ' + password + " vs. DB " + result.rows[0].password);
    //     response.status(401).send("Please send username and password!");
    //     }
    // else {   
            // Password match : create Session

            // userSession = new Session({
            //   // userId: currUser.id,
            //   userId: user.id,
            //   token: Math.random().toString(36)
            // });

            // const queryString = "INSERT INTO sessions (user_id, token) VALUES ($1, $2);";
            // client.query(queryString,[userSession.userId, userSession.token], (err, result) => {
            //   if (err) {
            //     response.status(400);
            //   }
            //   response.status(201);
            //   response.send(userSession);
            // });
            
            // console.log("ID: " + userSession.userId + " - Token: " + userSession.token);
            
            // console.log("----------------------");
            // console.log('\nPassword correct !');
            // console.log('Username :' + currUser.username);
            // console.log('Password :' + currUser.password);
            // console.log('Userid :' + currUser.id);
            // console.log("----------------------");
            // response.status(200).send(result.rows);   // doCheck // don't send password / full record

            

        // doCheck // if Password correct create session ==> callback function !?!?
  } 
    // }
//   } )   // end client.query
//   }
//   // console.log("postsession hit");
// }

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


/*****************************************
 * MAIN
 ****************************************/

app.listen(port, () => {          // actually run server (listen on port)
  console.log(`Glitter Server listening on port ${port}`)
})


