const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

// Require the controllers WHICH WE DID NOT CREATE YET!!
const order_controller = require('../controllers/Order');

// a simple test url to check that all of our files are communicating correctly.
router.post('/', auth, order_controller.createOrder);
router.get('/:id', auth, order_controller.getOrderById);
router.get('/user/orders', auth, order_controller.getOrdersByUser);
router.put('/:id', auth, order_controller.updateOrder);
router.delete('/:id', auth, order_controller.deleteOrder);

module.exports = router;
