const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const isAuth = async (req, res, next) => {
  try {
    // get token from Header
    const token = req.headers['x-auth-token'];
    if (!token)
      return res.status(401).send({ msg: 'No Token, authorization denied' });

    const decoded = await jwt.verify(token, process.env.secretOrKey);
    // add user form payload
    const user = await User.findById(decoded.id);
    //Check for user
    if (!user) {
      return res.status(401).send({ msg: 'authorization denied' });
    }
    // Create user
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = isAuth;
