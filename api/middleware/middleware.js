const usersModel = require('../users/users-model');

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};

function logger(req, res, next) {
  console.log(
    `Method: ${req.method}, URl: ${req.url}, Timestamp: ${new Date()}`
  );
  next();
}

async function validateUserId(req, res, next) {
  const id = req.params.id;
  const result = await usersModel.getById(id);
  if (!result) {
    res.status(404).json({ message: 'user not found' });
  } else {
    req.user = result;
    next();
  }
}

function validateUser(req, res, next) {
  if (!req.body.name) {
    res.status(400).json({ message: 'missing required name field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body.text) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}
