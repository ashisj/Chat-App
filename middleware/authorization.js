const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.session.user;
    const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.userData = decode;
    next();
  }catch(error){
    next(new Error("Authorization Failed"))
  }
}