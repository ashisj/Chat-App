const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const InputValidator = require('../services/inputValidtion');

const { validationResult } = require('express-validator/check');
router.post('/login',InputValidator.validate('login'),UserController.login);

router.post('/register',InputValidator.validate('register'),UserController.register);
router.get('/username/:username',UserController.username);
router.get('/email/:email',UserController.email);

router.loggedInUsers = (username,done) =>{
  UserController.loggedInUser(username,(err,response) => {
    if(err){
      return done(err,null);
    }
    return done(null,response);
  })
}

module.exports = router;
