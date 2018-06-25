
const handleSignin = (req, res, db, bcrypt) => {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Incorrect form submission");
    }

    // Check email and then password with Bcrypt
    db.select('email', 'hash').from('login')
      .where('email','=', email)
      .then(data => {
        // Compare the entered password with the hash from Login table
        const passwordValid = bcrypt.compareSync(password, data[0].hash);
        if (passwordValid) {
          db.select('*').from('users')
            .where('email', '=', email)
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
  handleSignin
};