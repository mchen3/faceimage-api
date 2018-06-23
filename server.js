const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middle bodyPaser to parse all the body to JSON
app.use(bodyParser.json());

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
  ]
}

app.get('/', (req, res)=> {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  if(req.body.email == database.users[0].email &&
  req.body.password == database.users[0].password) {
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
 res.json('signing');
})

app.post('/register', (req, res) => {
  const {name, email, password} = req.body;
  database.users.push ( {
      id: '125',
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
  })
  res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let foundUser = false;
  database.users.forEach(user => {
    if (user.id === id) {
      foundUser = true;
      return res.json(user);
    } 
  })
  if(!foundUser) {
     res.status(400).json("No user found");
  }
})

app.post('/image', (req,res) => {
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

app.listen(3000, () => {
  console.log('app is running on port 3000');
});

/*
/ --> res = this is working
/signin --> POST = success / fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user 
*/