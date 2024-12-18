import Ticket from "../models/TicketModals.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Booking from "../models/BookingModal.js";
import Reservation from "../models/Reservation.js";
import NonWorkingDay from "../models/NonWorkingdays.js";
import mongoose from "mongoose";


export const BookingDates=catchAsyncError(async (req,res,next)=>{
    const {number_of_tickets,booking_date,ticket_type}=req.body;
    const MAX_TICKET_PER_DAY=100;
    const TICKET_PRICE=100;

    const session=await mongoose.startSession();
    session.startTransaction();

    try{
     if(await NonWorkingDay.findOne({date:booking_date}).session(session)){
        return next(new ErrorHandler("this date is holiday",400))
     };

     let reservation=await Reservation.findOne({date:booking_date});

     if(!reservation){
        reservation=await Reservation.create({date:booking_date}).session(session);
     };

     if(reservation.soldTickets + number_of_tickets > MAX_TICKET_PER_DAY){
        return next(new ErrorHandler("Maximum tickets exceeds",401));
     };

     const booking=await Booking.create([
        {
            user:req.user._id,
            bookingDate:booking_date,
            ticket:number_of_tickets,
            totalAmount : number_of_tickets * TICKET_PRICE,
            paymentStatus:true

        },
     ],
    {session}
    );

    reservation.soldTickets +=number_of_tickets;

    await reservation.save({session});

    const ticket=await Ticket.create([
        {
            user:req.user._id,
            bookingId:booking[0]._id,
            number_of_tickets,
            date:booking_date,
            ticketType:ticket_type,
            totalAmount:number_of_tickets * TICKET_PRICE,
        }
    ],{session});

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
        success:true,
        ticket:ticket[0],
    })

    }
    catch(err){
     await session.abortTransaction();
     session.endSession();
     return next(err)
    }
});


export const getHolidays=catchAsyncError(async (req,res,next)=>{
    try{
    const holidays=await NonWorkingDay.find();
    res.status(200).json({
        success:true,
        date:holidays.map((holiday)=>holiday.date || [])
    })
    }catch(err){
       return next(new ErrorHandler(err.message,500))
    }
});              


export const updateHoliday=catchAsyncError(async(req,res,next)=>{
    const {dates}=req.body;
    if(!Array.isArray(dates)){
        return next(new ErrorHandler("Invalid dates format",400));
    }
    try{
      await NonWorkingDay.deleteMany({});
      const dateEntries=dates.map(date=>({date}));
      await NonWorkingDay.insertMany(dateEntries);
      res.status(200).json({message:"Dates saved successfully"})
    }catch(err){
     console.log("Error Savings Dates",err);
      res.status(500).json({message:"Internal server error"});
    }
});


export const getBookings_admin=catchAsyncError(async(req,res,next)=>{
    try{
      const users=await Booking.find().populate({
        path:"user",
        select:"firstname lastname email"
      });
      res.status(200).json({
        success:true,
        users
      })
    }catch(err){
      return next(new ErrorHandler(err.message,500))
    }
})