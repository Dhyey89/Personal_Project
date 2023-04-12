const fs = require("fs");
const path = require("path");
const moment = require("moment");
const User= require("../models/userModel")
const Helper = require("../models/adminModel");
const Booking = require("../models/bookingModel");

exports.getAvailableTimeSlots = async (req, res, next) => {
  const date = req.query.date;
  const location = req.query.location;
  const timeSlots = ["9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am", "12:00 pm", "12:30 pm", "1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm", "3:00 pm", "3:30 pm", "4:00 pm", "4:30 pm"];
 

  // Check if there are any existing bookings for the current date and time slots
  const existingBookings = await Booking.find({
    date: date,
    location: location,
    starttime: { $in: timeSlots.map(time => moment(time, "h:mm a").toDate()) },
  });

  // Check if there are any existing bookings for the current date and time slots by the same user
  const existingUserBookings = await Booking.find({
    user: req.userId, // Exclude current user
    date: date,
    location: location,
    starttime: { $in: timeSlots.map(time => moment(time, "h:mm a").toDate()) },
  });
    // Check if the user has already booked the maximum number of time slots
    if (existingUserBookings.length >= 2) {
      // If the user has booked the maximum number of time slots, return an empty response
      return res.status(200).send({ availableTimeSlots: [] });
    }

  // Filter out the booked time slots
// Filter out the booked time slots
const availableTimeSlots = timeSlots.filter(slot => {
  const bookingTime = moment(slot, "h:mm a");
  const bookedSlots = existingBookings.filter(booking => moment(booking.starttime).isSame(bookingTime));
  const bookedSlotsBySameUser = existingUserBookings.filter(booking => moment(booking.starttime).isSame(bookingTime));

  // Exclude time slots that are booked by two different users
  if (bookedSlots.length >= 2) {
    return false;
  }

  // Exclude time slots that are booked by the same user
  if (bookedSlotsBySameUser.length > 0) {
    return false;
  }

  return true;
});


  // Return the available time slots
  return res.status(200).send({ availableTimeSlots: availableTimeSlots });
};


