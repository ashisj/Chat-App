var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var Authorization = require('../middleware/authorization');
//
var csrfProtection = csrf({ cookie: true });
router.use(csrfProtection);

/* GET home page. */
router.get('/', isLoggedIn,Authorization,function(req, res, next) { 
  res.render('index', { title: 'ChatApp' , user : req.userData});
});

router.get('/logout',isLoggedIn, (req, res) => {
  req.session.destroy(function() {
    res.clearCookie('user_sid');
    res.redirect('/');
  });
});

router.use('/',notLoggedIn,function(req,res,next){
  next();
})

router.get('/signup', function(req, res, next) {
  res.render('user/signup',{csrfToken: req.csrfToken()})
});

router.get('/signin', function(req, res, next) {
  res.render('user/signin',{csrfToken: req.csrfToken()})
});

function isLoggedIn(req,res,next){
  if(req.session.user && req.cookies.user_sid){
    res.locals.login = true
    return next();
  }
  res.redirect('/signin');
}

function notLoggedIn(req,res,next){
  if(!(req.session.user && req.cookies.user_sid)){
    res.locals.login = false;
    return next();
  }
  res.redirect('/');
}

module.exports = router;
