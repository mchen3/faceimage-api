const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Middle bodyPaser to parse all the body to JSON
app.use(bodyParser.json());
app.use(cors());
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'mikechen',
    password : '',
    database : 'faceimage'
  }
});

app.get('/', (req, res)=> {
  res.send(database.users);
})

// Need 2 extra parameters to pass database and bcrypt, ie dependency injection
//app.post('/register', (req, res) => { register.handleRegister(req,res,db,bcrypt) })
// Can use double arrow functions or Curried functions
app.post('/register',  register.handleRegister(db,bcrypt));
// Do not use curried functions for other functions, it's less readable
app.post('/signin', (req,res) => { signin.handleSignin(req,res,db,bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req,res,db) });
// Updates entries and increases count
app.put('/image', (req,res) => { image.handleImage(req,res,db) });

app.listen(3000, () => {
  console.log('app is running on port 3000');
});

