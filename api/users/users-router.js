const express = require('express');

const usersModel = require('./users-model');
const postsModel = require('../posts/posts-model');

const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  usersModel
    .get()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Error retrieving the users' });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user);
});

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  usersModel
    .insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(() => {
      res.status(500).json({
        message: 'There was an error while saving the user to the database',
      });
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  usersModel
    .update(id, req.body)
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: 'There was an error while saving the updated user' });
    });
});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;
  const userToDelete = await usersModel.getById(id);
  usersModel
    .remove(id)
    .then(() => {
      res.json(userToDelete);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Error deleting the user' });
    });
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params;
  const userPosts = await usersModel.getUserPosts(id);
  console.log('Jello', userPosts);
  res.json(userPosts);
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const newPost = { text: req.body.text, user_id: req.params.id };
  postsModel
    .insert(newPost)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch(() => {
      res.status(500).json({
        message: 'There was an error while saving the post to the database',
      });
    });
});

// do not forget to export the router
module.exports = router;
