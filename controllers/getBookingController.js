const Booking = require("../models/bookingModel");

  exports.getCurrentBooking = async (req, res, next) => {
    const userId = req.userId;
  
    try {
      const bookings = await Booking.find({ user: userId });
      res.send(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
    
  };
  exports.getConfirmedBooking = async (req, res, next) => {
    try {
      const bookings = await Booking.find().populate('user', 'firstname lastname');
  
      res.send(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };