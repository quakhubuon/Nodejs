const express = require('express');
const router = express.Router();
const upload = require('./upload');

// Require the controllers WHICH WE DID NOT CREATE YET!!
const category_controller = require('../controllers/Category');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', category_controller.test);
router.get('/', category_controller.getAllCategories);
router.get('/:id', category_controller.getIDCategories);
router.post('/', upload.single('Picture'), category_controller.addCategory);
router.put('/:id', upload.single('Picture'), category_controller.updateCategory);
router.delete('/:id', category_controller.deleteCategory);
module.exports = router;
