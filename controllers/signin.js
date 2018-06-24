
const handleSignin = (req, res, db, bcrypt) => {
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
}

module.exports = {
  handleSignin: handleSignin
};