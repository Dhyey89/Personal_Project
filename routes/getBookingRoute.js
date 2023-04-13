const express = require('express');
const getbookingController = require('../controllers/getBookingController');
const isAuthHelper = require('../middleware/is-AuthHelper');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/user-booking', isAuth, getbookingController.getCurrentBooking);
router.get('/confirmed-booking', isAuthHelper, getbookingController.getConfirmedBooking);

module.exports = router;