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
    res.status(500).json({errorMessage: "The posts information could not be retrieved."})
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

//GETs all comments with the "post_id" 
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
    res.status(500).json({ errorMessage: "The comments information could not be retrieved." })
  })
})

//Creates a comment for the post with the specified id
router.post('/:id/comments', (req, res) => {
  
  const newComment = req.body;

  if (!req.params.id) {
    res.status(404).json({errorMessage: "The post with the specified ID does not exist"});
  } else {
    if (!newComment.text) {
      res.status(400).json({errorMessage: "Please provide text for the comment."});
      return
    }
  }

  db.insertComment(newComment)
  .then(comment => {
    db.findCommentById(comment.id).then(updatedComment => {
      res.json(updatedComment)
    })
  })
  .catch(error => {
    res.status(500).json({ errorMessage: "There was an error while saving the comment to the database." })
  });
});

//Updates post
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const post = req.body;

  if (!post.title || !post.contents) {
    res.status(400).json({errorMessage: "Please provide title and contents for the post." })
    return
  }

  const posts = await db.findById(id);
  if (posts.length === 0) {
    res.status(404).json({message: "The post with the specified ID does not exist."})
    return
  }
  
  db.update(id, post)
  .then(updatedPost => {
    db.findById(id).then(updatedPost => {
      res.json(updatedPost)
    })
  })
  .catch(err => {
    res.status(500).json({errorMessage: "The post information could not be modified."})
  })
})

//DELETE
router.delete('/:id', (req, res) => {
  const {id} = req.params;

  db.findById(id)
  .then(post => {
    console.log(post)
    if (post.length === 0) {
      res.status(404).json({message: "The post with the specified ID does not exist."})
      return
    }
  })
  .catch(err => {
    res.status(500).json({error: "The post with the id could not be retrieved."})
  })

  db.remove(id)
  .then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({errorMessage: "The post with the specified ID does not exist."})
      return
    }
  })
  .catch(err => {
    res.status(500).json({errorMessage: "The post could not be removed."})
  })
})

module.exports = router;