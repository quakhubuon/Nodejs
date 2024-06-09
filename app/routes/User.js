const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/User');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', auth, user_controller.test);
router.get('/', user_controller.getAllUsers);
router.post('/', user_controller.Register);
router.post('/login', user_controller.Login);
router.post('/logout', auth, user_controller.Logout);
router.post('/logoutall', auth, user_controller.LogoutAll);

module.exports = router;
