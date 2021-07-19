var express = require('express');
var router = express.Router();

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');

router.get('/item', itemController.item_get_all);
router.get('/item/:item_code', itemController.item_get);
router.get('/category', categoryController.category_get_all);
router.get('/category/:category_code', categoryController.category_get);
router.post('/order', orderController.order_post);
router.get('/order/:id', orderController.order_get);

module.exports = router;