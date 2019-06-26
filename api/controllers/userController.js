var User = require('../models/userModel');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken')

exports.register = (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      let errorResult={
          username:'',
          name:'',
          email:'',
          password:''
      };
      errors.array().forEach((value)=>{
          errorResult[value.param] = value.msg;
      })
      res.status(400).json({message:errorResult});
  } else{
    User.findOne({$or:[{'email':req.body.email},{'username':req.body.username}]},(err,user) => {
      if(err){
        return next(err);
      }
      if(user){
        res.status(409).json({message:'Email or UserName is already exists.'});
      } else {
        var newUser = new User();
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.name = req.body.name;
        newUser.username = req.body.username;
        newUser.save(function(error,result){
          if(error){
            return next(error);
          }
          res.status(202).json({message:"Registration successfull"});
        });
      }
    });
  }
};

exports.username = (req,res,next) => {
  User.findOne({'username':req.params.username},(err,user) => {
    if(err){
      return next(err);
    }
    if(user){
      res.status(409).json({message:'UserName is already exists.'});
    } else {
      res.status(200).json({message:'UserName is unique'});
    }
  })
}

exports.email = (req,res,next) => {
  User.findOne({'email':req.params.email},(err,user) => {
    if(err){
      return next(err);
    }
    if(user){
      res.status(409).json({message:'Email is already exists.'});
    } else {
      res.status(200).json({message:'Email is unique'});
    }
  })
}

exports.login = (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(401).json({message:'Authentication Failed'});
  }

 User.findOne({'email': req.body.email},(err,user) => {
    if(err){
      return next(err)
    }
    if(user){
      if(!user.validPassword(req.body.password)){
        return res.status(401).json({message:'Authentication Failed'});
      } else {
        var token = jwt.sign(
          {
            email:user.email,
            username:user.username,
            name:user.name
          },
          process.env.JWT_PRIVATE_KEY,
          {
            expiresIn: 180*60*1000
          }
        );
        req.session.user = token;
        return res.status(200).json({message:"Authentication successfull"})
      }
    } else {
      return res.status(401).json({message:'Authentication Failed'})
    }
  });
};

exports.loggedInUser = (username,done) => {
  User.findOne({'username':username},{_id:0,name:1},(err,user) => {
    if(err){
       return done(err,null);
    }
    return done(null ,user);
  })
}
