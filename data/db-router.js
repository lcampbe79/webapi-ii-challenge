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

//POSTs new post
router.post('/', (req, res) => {
  const postInfo = req.body;

  if (!postInfo.title || !postInfo.contents) {
    res.status(400).json({errorMessage: "Please provide title and contents for the post." })
    return
  }

  db.insert(postInfo)
  .then(posts => {
    db.findById(posts.id).then(updatedPost => {
      res.json(updatedPost)
    })
  })
  .catch((err) =>{
    res.status(500).json({errorMessage: "There was an error while saving the post to the database." })
  })
})

//GETs comments from post with specific "id"--> Confused returns the post
router.get('/:id/comments', (req, res) => {

  db.findPostComments(req.params.id)
  .then(comments => {
    if (comments.length > 0) {
      res.status(200).json(comments);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  })
  .catch(error => {
    res.status(500).json({ error: "The comments information could not be retrieved." })
  })
})

module.exports = router;