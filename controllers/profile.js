
const handleProfileGet = (req,res,db) => {

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

}

module.exports = {
  handleProfileGet
};