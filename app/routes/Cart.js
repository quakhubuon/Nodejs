const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const cart_controller = require('../controllers/Cart');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', cart_controller.test);

router.get('/', cart_controller.getCart);
router.post('/add-to-cart/', cart_controller.addToCart);
router.delete('/clear-cart/', cart_controller.clearCart);
router.put('/update-item', cart_controller.updateCartItemQuantity);

module.exports = router;
