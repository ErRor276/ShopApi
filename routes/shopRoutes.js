var express = require('express');
var router = express.Router();

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');

router.get('/', itemController.item_get_all);
router.get('/:item_code', itemController.item_get);
router.get('/', categoryController.category_get_all);
router.get('/:category_code', categoryController.category_get);
router.post('/', orderController.order_post);
router.get('/:id', orderController.order_get);

module.exports = router;