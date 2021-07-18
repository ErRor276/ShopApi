var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');

router.post('/signup', userController.signup_post);
router.post('/login', userController.login_post);
router.post('/logout', userController.logout_post);
router.post('/admin/signup', adminController.signup_post);
router.post('/admin/login', adminController.login_post);
router.post('/admin/logout', adminController.logout_post);

module.exports = router;