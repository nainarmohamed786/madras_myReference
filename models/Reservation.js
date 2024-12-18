import mongoose from 'mongoose';

const ReservationSchema=new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    tickets:{
       type:Number,
       default:100 
    },
    soldTickets:{
        type:Number,
        default:0
    }
});

const Reservation=mongoose.model("Reservation",ReservationSchema);

export default Reservation;