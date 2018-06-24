const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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

// db.select('*').from('users').then(data => {
//   console.log(data);
// });
 
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ],

  login: [
    {
      id: '987',
      has: '',
      email: 'john@gmail.com'
    }
  ]
}

app.get('/', (req, res)=> {
  res.send(database.users);
})


app.post('/signin', (req, res) => {

  let hash = '$2a$10$/iEaTsE4k29wBEW4AXfnk.wTzKZDjI7afqE4tNdjrCoOGZ90HKX4e';

  // Load hash from your password DB.
  bcrypt.compare("apples", hash, function(err, res) {
    // res == true
    console.log("Guess ", res);
  });
  bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
    console.log("Wrong ", res);
  });

  if(req.body.email == database.users[0].email &&
  req.body.password == database.users[0].password) {
    return res.json(database.users[0]);
  } else {
    return res.status(400).json('error logging in');
  }
 //res.json('signing');
})


app.post('/register', (req, res) => {

  // BCrypt
  let hashPassword;
  const {name, email, password} = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    // Store hash in your password DB.
    //console.log(hash);
    hashPassword = hash;
  });

  db('users')
    .returning('*')
    .insert({
      name: name,
      email: email,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json("Unable to register"))
  
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  // With ES6 - can do where({id}) because id is same
  db.select('*').from('users').where({
    id: id
  })
    .then(user => {
      if(user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(err => res.status(400).json('error getting user'));

  // Same as above but same syntax from Knex site
  // db('users').where({
  //   id: id
  // }).select('*').then(user => {
  //   console.log(user);
  //   })


})

app.put('/image', (req,res) => {
  const { id } = req.body;
  let foundUser = false;
  database.users.forEach(user => {
    if (user.id === id) {
      foundUser = true;
      user.entries++;
      return res.json(user.entries);
    } 
  })
  if(!foundUser) {
    res.status(400).json("No user found");
  }
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });

app.listen(3000, () => {
  console.log('app is running on port 3000');
});

