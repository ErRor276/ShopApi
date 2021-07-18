var express = require('express');
var router = express.Router();

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');

router.get('/', itemController.item_get_all);
router.post('/', itemController.item_post);
router.get('/:item_code', itemController.item_get);
router.put('/:item_code', itemController.item_update);
router.delete('/:item_code', itemController.item_delete);
router.get('/', categoryController.category_get_all);
router.post('/', categoryController.category_post);
router.get('/:category_code', categoryController.category_get);
router.put('/:category_code', categoryController.category_update);
router.delete('/:category_code', categoryController.category_delete);
router.get('/', orderController.order_get_all);
router.post('/', orderController.order_post);
router.get('/:id', orderController.order_get);
router.put('/:id', orderController.order_update);
router.delete('/:id', orderController.order_delete);
router.get('/user', userController.user_get_all);
router.get('/user/:id', userController.user_get);
router.get('/admin', adminController.admin_get_all);
router.get('/admin/:id', adminController.admin_get);

module.exports = router;