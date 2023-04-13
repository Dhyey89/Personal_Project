const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    firstname:{
        type: String,
    },
      lastname:{
      type: String,
      
    },
    password:{
        type:String,
       
    },
    email: {
      type: String,
      required: true
    },
 perId:{
        type:Schema.Types.ObjectId,
        ref:'admin'
    },
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('admin', adminSchema);