const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User = require('../models/user');
const { secret, userSecret } = require('../constants/keys');

const requireAuth = (req, res, next) => {
    const token = req.cookies.adminJwt;
  
    // check json web token exists & is verified
    if (token) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.send('not authorized');
        } else {
          console.log(decodedToken);
          next();
        }
      });
    } else {
      res.send('not authorized');
    }
};

const checkAdmin = (req, res, next) => {
    const token = req.cookies.adminJwt;
    if (token) {
      jwt.verify(token, secret, async (err, decodedToken) => {
        if (err) {
          res.locals.admin = null;
          next();
        } else {
          let admin = await Admin.findById(decodedToken.id);
          res.locals.admin = admin;
          next();
        }
      });
    } else {
      res.locals.admin = null;
      next();
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.userJwt;
    if (token) {
      jwt.verify(token, userSecret, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
};
  
  
module.exports = { requireAuth, checkAdmin, checkUser };