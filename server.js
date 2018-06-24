const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const register = require('./controllers/register');

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

app.post('/signin', (req, res) => {

  // Check email and then password with Bcrypt
  db.select('email', 'hash').from('login')
    .where('email','=',req.body.email)
    .then(data => {
      // Compare the entered password with the hash from Login table
      const passwordValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (passwordValid) {
        db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
              res.json(user[0]);
          })     
          .catch(err => res.status(400).json('error getting user'));
      } else {
        res.status(400).json('Wrong password');
      }
    })
    .catch(err => res.status(400).json('Wrong credentials'));
})

// Need 2 extra parameters to pass database and bcrypt, ie dependency injection
app.post('/register', (req, res) => { register.handleRegister(req,res,db,bcrypt) })

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

// Updates entries and increases count
app.put('/image', (req,res) => {
  const { id } = req.body;
  let foundUser = false;

  /*
  Note- for this function, the increment/decrement
  will not work without the added 'then' at the end, 
  not sure why, different from the docs
  Returning() part is just for the console
  */

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then ( entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));

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

