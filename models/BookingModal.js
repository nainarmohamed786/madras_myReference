import mongoose from "mongoose";

const BookingSchema=new mongoose.Schema({
    bookingDate:{
        type:String,
        required:true
    },
    ticket:{
        type:Number,
        required:true
    },
    totalAmount:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:Boolean,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"userRefer"
    }
},{timestamps:true});


const Booking=mongoose.model("Booking",BookingSchema);

export default Booking;