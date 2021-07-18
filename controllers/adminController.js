const Admin = require("../models/admin");
const jwt = require('jsonwebtoken');
const { secret } = require('../constants/keys');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('admin validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge
  });
};

module.exports.signup_post = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const admin = await Admin.create({ name, email, password });
    const token = createToken(admin._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ admin: admin._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.login(email, password);
    const token = createToken(admin._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ admin: admin._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_post = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.send('logged out');
}

module.exports.admin_get_all = (req, res) => {
  try {
      const admins = await Admin.find({});
      res.status(200).json({ admins });
  } 
  catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
  }
}

module.exports.admin_get = (req, res) => {
  const id = req.params.id;

  try {
      const admin = await Admin.findOne({ _id: id });
      res.status(200).json({ admin });
  } 
  catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
  }
}