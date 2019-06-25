var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var csrfProtection = csrf({ cookie: true });
router.use(csrfProtection);

router.get('/signup', function(req, res, next) {
  res.render('user/signup',{csrfToken: req.csrfToken()})
});

router.get('/signin', function(req, res, next) {
  res.render('user/signin',{csrfToken: req.csrfToken()})
});

module.exports = router;
