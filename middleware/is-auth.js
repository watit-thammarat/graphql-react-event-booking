const jwt = require('jsonwebtoken');

const { SECRET } = require('../helpers/config');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const [_, token] = authHeader.split(' ');
  if (!token || token.length === 0) {
    req.isAuth = false;
    return next();
  }
  try {
    const decodedToken = jwt.verify(token, SECRET);
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    req.isAuth = false;
    next();
  }
};
