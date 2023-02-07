// const fs = require("fs")
// const hapi = require("@hapi/hapi")


// const port = 4000
// const hostname = "0.0.0.0"
// const glittsFile = "./user1.json"

// class myglitz{
//     firstname;
//     text;
//     postedOn;

//     constructor(data){
//         this.firstname = data.firstname;
//         this.text = data.text;
//         this.postedOn = data.postedOn;
//     }  
    
// }

// function readFromJsonFile(){
//     try{
//         const dataBuffer = fs.readFileSync(glittsFile)
//         const data = dataBuffer.toString()
//         const json =JSON.parse(data)
//         return json
//         console.log(json)
//     }catch (e){
//         return []
//     }
    
// }

// const startapp = async () => {
//     const server = hapi.server({
//         port : port,
//         host : hostname,
//         routes: {
//             cors :{
//                 origin:["*"]
//             }
//             //  cors: {
//             //      origin: ["http://localhost:4000", "http://127.0.0.1:3000"]
//             // }
//         }
//     })   
//     await server.start();
//     console.log("Server running on %s", server.info.uri);

//     server.route({        
//         method : "GET",
//         path : "/user",
//         handler : (request, reply) => {
//             // const id1 = request.params.id;
//             // return user[id1].firstname;
//             return readFromJsonFile().reverse()
//             console.log(readFromJsonFile())
//         }
//     })

//     server.route({
//         method : "POST",
//         path : "/user",
//         handler : (request,response) => {
//             const glitts = readFromJsonFile();
//             const glitz = new myglitz(request.payload);
//             glitts.push(glitz)
//             console.log(glitz)
//             fs.writeFileSync(glittsFile,JSON.stringify(glitts))
//             return response.response(glitz).code(201)
//         }
//     })

    
// }
// startapp();
var express =require('express')
var app =express();
var cors = require('cors');
var bodyParser = require('body-parser'); 
//var Config = require("./user1.json");
var { response } = require('express');
var urlencodedParser = bodyParser.urlencoded({ extended: false }) 
var fs = require("fs")

app.use(express.static('public'));  


class myglitz{
         firstname;
         text;
         postedOn;
    
         constructor(data){
             this.firstname = data.firstname;
             this.text = data.text;
             this.postedOn = new Date();
         }  
        }

app.listen(3000,function(){
console.log('server is running on port 3000')
});
app.use(cors({
    origin: '*'
}));

app.get('/users', (req, res) => { 
    var alldata = fs.readFileSync('user1.json');
    res.send(JSON.parse(alldata)).reverse()
});

app.use(express.json())
app.post('/users', urlencodedParser, function (req, res) {    
    response = {     
        firstname:req.body.firstname,  
        text:req.body.text         
        };  
        console.log(response);
        const glitz = new myglitz(response);
        console.log(glitz);
        var alldata = fs.readFileSync('user1.json');
        var myObject= JSON.parse(alldata);
        myObject.push(glitz)
        fs.writeFileSync('user1.json',JSON.stringify(myObject))
        res.end(JSON.stringify(response));      
})  
