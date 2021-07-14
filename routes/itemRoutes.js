var express = require('express');
var router = express.Router();

const itemController = require('../controllers/itemController');

router.get('/', itemController.item_get_all);
router.post('/', itemController.item_post);
router.get('/:item_code', itemController.item_get);
router.put('/:item_code', itemController.item_update);
router.delete('/:item_code', itemController.item_delete);

module.exports = router;