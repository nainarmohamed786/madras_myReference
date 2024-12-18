import mongoose from 'mongoose';

const TicketSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"userRefer"
  } ,
  bookingId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Booking"
  },
  number_of_tickets:{
    type:Number,
    required:true,
    max:100
  },
   date:{
    type:Date,
    required:true
   },
   ticketType:{
    type:String,
    default:"GP"
   },
   totalAmount:{
    type:String,
    required:true
   }
},{toJSON:{virtuals:true},toObject:{virtuals:true},timestamps:true});


const Ticket=mongoose.model("Ticket",TicketSchema);
export default Ticket;

TicketSchema.virtual("isExpired").get(function(){
    return new Date(this.date) < new Date();
})