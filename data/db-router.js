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
});

//GETs posts by id
router.get('/:id', (req, res) => {
  db.findById(req.params.id)
  .then(post => {
    if (post.length > 0) {
      res.status(200).json(post)
    } else {
      res.status(400).json({message: "The post with the specified ID does not exist."})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error: "The posts information could not be retrieved."})
  })
})

router.post('/', (req, res) => {

})

module.exports = router;