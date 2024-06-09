const express = require('express');
const router = express.Router();
const upload = require('./upload');

// Require the controllers WHICH WE DID NOT CREATE YET!!
const product_controller = require('../controllers/Product');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', product_controller.test);
router.get('/', product_controller.getAllProducts);
router.get('/:id', product_controller.getIDProducts);
router.post('/', upload.single('Picture'), product_controller.addProduct);
router.put('/:id', upload.single('Picture'), product_controller.updateProduct);
router.delete('/:id', product_controller.deleteProduct);
module.exports = router;
