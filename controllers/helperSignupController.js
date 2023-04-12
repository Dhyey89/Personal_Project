const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/userModel");
const Helper = require("../models/adminModel");
const cache = require("../services/cache");

exports.signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = await User.findOne({ email: email });
    const existingHelper = await Helper.findOne({ email: email });
    if (existingUser) {
      const error = new Error('A user with this email address already exists');
      error.statusCode = 422;
      throw error;
    }
    else if (existingHelper ) {
      const error = new Error('A helper with this email address already exists');
      error.statusCode = 422;
      throw error;
    }
    // 
    

    // Hash password and create helper in database
    const hashedPw = await bcrypt.hash(password, 12);
    const helper = new Helper({
      // firstname: firstname,
      // lastname: lastname,
      email: email,
      password: hashedPw,
      dob: "",
      mob: "",
      gender: "",
      age: 0,
      helped: 0,
      description: "",
      availability: {
        Monday: "",
        Tuesday: "",
        Wednesday: "",
        Thursday: "",
        Friday: "",
        Saturday: "",
        Sunday: "",
      },
      bookings: [],
    });
    const savedHelper = await helper.save();
    cache.set(email, OTP);
    // Create JWT for helper
    const token = jwt.sign(
      {
        helperId: savedHelper._id,
        email_verified: false,
      },
      "somesupersecretsecret",
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "Helper created!",
      token: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
