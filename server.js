require( 'dotenv' ).config()

const express = require('express'),
    { MongoClient, ObjectId } = require("mongodb"),
    app = express()

app.use( express.static( 'public' ) )
app.use( express.json() )


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/?appName=Cluster0`
console.log( 'uri:', uri )
const client = new MongoClient( uri )

let collection = null

async function run() {
    await client.connect()

    collection = await client.db("datatest").collection("test")

    // route to get all docs
    app.get("/docs", async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray()
            res.json( docs )
        }
    })
}

run()
app.listen(process.env.PORT || 3000)

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/submit', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})
app.post( '/remove', async (req,res) => {
  const result = await collection.deleteOne({ 
    _id:new ObjectId( req.body._id ) 
  })
  
  res.json( result )
})
app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set:{ name:req.body.name } }
  )

  res.json( result )
})



//sign in stuff
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
 secret: 'your-secret-key',
 resave: true,
 saveUninitialized: true
}));
const port = 3000; // Replace with your desired port number
// MongoDB connection string
const dbUrl = 'mongodb://localhost:27017/login-page';

MongoClient.connect(dbUrl, (err, client) => {
 if (err) throw err;
 const db = client.db('login-page');
 const usersCollection = db.collection('users');
// Login route
 app.post('/login', (req, res) => {
 const { email, password } = req.body;
usersCollection.findOne({ email }, (err, user) => {
 if (err) throw err;
// User not found
 if (!user) {
 return res.status(401).send('Invalid email or password');
 }
// Compare the provided password with the hashed password stored in the database
 bcrypt.compare(password, user.password, (err, result) => {
 if (err) throw err;
if (result) {
 // Store user data in session
 req.session.user = user;
 res.redirect('/dashboard'); // Redirect to the dashboard page after successful login
 } else {
 res.status(401).send('Invalid email or password');
 }
 });
 });
 });
// Start the server
 app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}`);
 });
});








//a2 code
/* const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { name: 'Becca', birth_year: 2006, user_class: 'Junior', age: 20 }
]

function findAge(user_info){
  user_info.age = 2026 - user_info.birth_year;
  return user_info;
}

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }else if( request.method === 'DELETE') {
    handleDelete( request, response );
  }
  
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  // had chatgpt help me with this cause i was getting errors
  } else if (request.url === '/users') {
    response.writeHead(200, "OK", {
      'Content-Type': 'application/json'
    })
    response.end(JSON.stringify(appdata))
  } else {
    const filename = dir + request.url.slice(1)
    sendFile(response, filename)
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const this_user = JSON.parse(dataString);
    findAge(this_user);
    appdata.push(this_user);
    console.log(appdata);
    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })

    // change this to incorporate data
    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function( request, response ){
  const name = decodeURIComponent(request.url.replace('/users/', ''));
  const index = appdata.findIndex(function(user) {
    return user.name === name;
  });
  if (index !== -1) {
    appdata.splice(index, 1);
  }
  response.writeHead(200, 'OK', {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify(appdata));
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
*/