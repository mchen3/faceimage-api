

const handleImage = (req,res,db) => {

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
}

module.exports = {
  handleImage: handleImage
};