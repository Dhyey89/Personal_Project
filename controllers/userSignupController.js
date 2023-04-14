const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
//const NodeCache = require('node-cache');
const Helper= require('../models/adminModel')
const User = require('../models/userModel');
const cache=require('../services/cache');
//const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

// Signup route that sends email verification
exports.signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    
    const existingHelper = await Helper.findOne({ email: email });
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const error = new Error('A user with this email address already exists');
      error.statusCode = 422;
      throw error;
    }
    if (existingHelper ) {
      const error = new Error('A helper with this email address already exists');
      error.statusCode = 422;
      throw error;
    }
    // Generate OTP
    const OTP = Math.floor(1000 + Math.random() * 9000);

    // Hash password and create user in database
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      firstname:firstname,
      lastname:lastname,
    });
    const savedUser = await user.save();
    
    // Create JWT for user
    const token = jwt.sign({ 
      userId: savedUser._id, 
      email_verified: false 
    }, 'somesupersecretsecret', { expiresIn: '1h' });

    res.status(201).json({ 
      message: 'User created!', 
      token: token 
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

