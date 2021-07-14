var express = require('express');
var router = express.Router();

const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.category_get_all);
router.post('/', categoryController.category_post);
router.get('/:category_code', categoryController.category_get);
router.put('/:category_code', categoryController.category_update);
router.delete('/:category_code', categoryController.category_delete);

module.exports = router;