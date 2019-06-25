const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const InputValidator = require('../services/inputValidtion');

const { validationResult } = require('express-validator/check');
router.post('/login',InputValidator.validate('login'),UserController.login);

router.post('/register',InputValidator.validate('register'),UserController.register);
router.get('/username/:username',UserController.username);
router.get('/email/:email',UserController.email);
// router.post('/login',(req,res)=>{
//     if(req.body.email == 'a' && req.body.password == 'b'){
//         req.session.user = req.body;
//         res.status(200).json({message:"Authentication successfull"})
//     } else {
//         res.status(400).json({message:"Authentication failed"})
//     }
    
// });
/*
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});
*/
module.exports = router;