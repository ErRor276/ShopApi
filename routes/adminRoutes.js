var express = require('express');
var router = express.Router();

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');

router.get('/item', itemController.item_get_all);
router.post('/item', itemController.item_post);
router.get('/item/:item_code', itemController.item_get);
router.put('/item/:item_code', itemController.item_update);
router.delete('/item/:item_code', itemController.item_delete);
router.get('/category', categoryController.category_get_all);
router.post('/category', categoryController.category_post);
router.get('/category/:category_code', categoryController.category_get);
router.put('/category/:category_code', categoryController.category_update);
router.delete('/category/:category_code', categoryController.category_delete);
router.get('/order', orderController.order_get_all);
router.post('/order', orderController.order_post);
router.get('/order/:id', orderController.order_get);
router.put('/order/:id', orderController.order_update);
router.delete('/order/:id', orderController.order_delete);
router.get('/user', userController.user_get_all);
router.get('/user/:id', userController.user_get);
router.put('/user/:id', userController.user_update);
router.delete('/user/:id', userController.user_delete);
router.get('/', adminController.admin_get_all);
router.get('/:id', adminController.admin_get);
router.delete('/:id', adminController.admin_delete);

module.exports = router;