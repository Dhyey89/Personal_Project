const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
   
    date:{
      type:String,
      
    },
    timeSlot:{
      type:Date,
    },
    user: {
      type:Schema.Types.ObjectId,
      ref:'User'
    },
    helper: {
      type: Schema.Types.ObjectId,
      ref: 'helpers_1'
    },
  
    location:{
      type:String
    },
    starttime:{
      type:String
    },
    endtime:{
      type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
