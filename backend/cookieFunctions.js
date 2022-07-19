const jwt = require('jsonwebtoken');


function createSessionCookie(userId, res, callback) {
  var token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: 3 * 60 * 60 * 24 });
  res.cookie('userLogin', token, { maxAge: 60 * 60 * 24 * 3000 });
  // res.cookie('hipwork', token, { maxAge: 60 * 60 * 24 * 3000, httpOnly: true, secure: true });
  callback();
}
module.exports.createSessionCookie = createSessionCookie;
