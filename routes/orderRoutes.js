var express = require('express');
var router = express.Router();

const orderController = require('../controllers/orderController');

router.get('/', orderController.order_get_all);
router.post('/', orderController.order_post);
router.get('/:id', orderController.order_get);
router.put('/:id', orderController.order_update);
router.delete('/:id', orderController.order_delete);

module.exports = router;