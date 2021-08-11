const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { userSecret } = require('../constants/keys');

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
  return jwt.sign({ id }, userSecret, {
    expiresIn: maxAge
  });
};

module.exports.signup_post = async (req, res) => {
  const { name, user_img, email, password, personal_info, delivery_info, wishlist } = req.body;

  try {
    const user = await User.create({ name, user_img, email, password, personal_info, delivery_info, wishlist });
    const token = createToken(user._id);
    res.cookie('userJwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('userJwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_post = async (req, res) => {
    res.cookie('userJwt', '', { maxAge: 1 });
    res.send('logged out');
}

module.exports.user_get_all = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ users });
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.user_get = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findOne({ _id: id });
        res.status(200).json({ user });
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.user_update = async (req, res) => {
  const { name, email, password, personal_info, delivery_info, wish_list } = req.body;
  const id = req.params.id;

  try {
      const user = await User.updateOne({ _id: id }, { name, email, password, personal_info, delivery_info, wish_list });
      res.status(200).json({ user });
  } 
  catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
  }
}

module.exports.user_delete = async (req, res) => {
  const id = req.params.id;

  try {
      const user = await User.deleteOne({ _id: id });
      res.status(200).json({ user });
  } 
  catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
  }
}