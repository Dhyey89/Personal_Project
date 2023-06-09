const moment = require("moment");
const nodemailer = require("nodemailer");
// const { validationResult } = require('express-validator/check');
const User = require("../models/userModel");
const Helper = require("../models/adminModel");
const Booking = require("../models/bookingModel");


exports.createBooking = async (req, res, next) => {
  const date = req.body.date;
  const location = req.body.location;
  const timeSlot = req.body.timeSlot;
  const user = req.userId; // Assuming you have the user ID available in the request
 
  const existingUserTimeSlotBooking = await Booking.findOne({
    user: user,
    date: date,
    starttime: timeSlot
  });

  if (existingUserTimeSlotBooking) {
    // If the user has already booked the same time slot, return an error response
    return res.status(400).send({ message: 'You have already booked the same time slot.' });
  }
  // Check if the user has already booked the maximum number of time slots
  const existingUserBookings = await Booking.find({
    user: user,
    date: date,
  });

  if (existingUserBookings.length >= 2) {
    // If the user has booked the maximum number of time slots, return an error response
    return res.status(400).send({ message: 'You have already booked the maximum number of time slots.' });
  }

  // Check if the selected time slot is available
  const existingBookings = await Booking.find({
    date: date,
    location: location,
    starttime: timeSlot
  });

  if (existingBookings.length >= 2) {
    // If the selected time slot is already booked by 2 users, return an error response
    return res.status(400).send({ message: 'The selected time slot is not available.' });
  }
  const startTime = moment(timeSlot, 'h:mm a');
  const endTime = startTime.clone().add(30, 'minutes').format('h:mm a');
  const newBooking = new Booking({
    user: user,
    date: date,
    location: location,
    starttime: timeSlot,
    endtime : endTime
  });

  try {
    await newBooking.save();
    return res.status(201).send({ message: 'Booking created successfully.' });
  } catch (err) {
    return res.status(500).send({ message: 'Failed to create booking.' });
  }
};

