const {check} = require('express-validator/check');

exports.validate = (method) => {
    switch (method){
      case 'register':{
        return [
            check('username').exists().trim()
                .matches(/^[A-Za-z0-9@_-]+$/).withMessage('User Name is not a valid username')
                .isLength({ min:5,max: 15 }).withMessage('User Name must have minimum 5 character and maximum 15 character')
                .not().isEmpty().withMessage('User Name field should not be empty'),
            check('name').exists().trim()
                .matches(/^[A-Za-z]+[A-Za-z ]*$/).withMessage('Name is not a valid')
                .not().isEmpty().withMessage('Name field should not be empty'),
            check('email').exists().trim()
                .matches(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
                    .withMessage('please enter a valid email address eg:- a@gmail.com')
                .not().isEmpty().withMessage('Email field should not be empty')
                .isLength({ max: 50 }).withMessage('Email must have maximum 50 character'),
            check('password').exists()
                .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)
                    .withMessage('Password must contain at least 6 characters, including uppercase,lowercase and number')
                .not().isEmpty().withMessage('Password field should not be empty')
        ]
        break;
      }
      case 'login':{
          return [
            check('email').exists().trim()
                .matches(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
                .not().isEmpty(),
            check('password').exists()
                .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)
                .not().isEmpty()
          ]
          break;
      }
    }
  }