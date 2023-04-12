const express = require('express');
const bookingController = require('../controllers/createBookingController');
const isAuthHelper = require('../middleware/is-AuthHelper');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.post('/book', isAuth, bookingController.createBooking);



module.exports = router;
