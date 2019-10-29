const router = require ('express').Router();

const db = require('./db');

//GETs all posts
router.get('/', (req, res) => {
  db.find()
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error: "The posts information could not be retrieved."})
  })
})

module.exports = router;