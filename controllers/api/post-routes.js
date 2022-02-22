const router = require("express").Router();
const { Post, User, Vote, Comment } = require("../../models");


router.get("/", (req, res) => {
  console.log("=====================");
  Post.findAll({
    attributes: ["id", "post_url", "title", "created_at"],
    order:[['created_at', 'desc']],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model:Comment,
        attributes:['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include:{
          model: User,
          attributes:['username']
        }
      }
    ]
  })

    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// eslint-disable-next-line no-unused-vars
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "post_url", "title", "created_at"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  });
});

router.post("/", (req,res) => {
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.body.user_id
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
})

//upvote
router.put("/upvote", (req, res) => {
  Post.upvote(req.body, { Vote })
  .then(updatedPostData => res.json(updatedPostData))
  .catch(err => {
    console.log(err)
    res.status(400).json(err)
  })
});

router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req,res)=> {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })

  .then(dbPostData => {
    if(!dbPostData){
      res.status(404).json({ message: 'no post found with this id'})
      return
    }
    res.json(dbPostData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
})



module.exports = router