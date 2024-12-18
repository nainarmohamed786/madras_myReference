import catchAsyncError from "../middlewares/catchAsyncError";
import Ticket from "../models/TicketModals";
import ErrorHandler from "../utils/ErrorHandler";


export const getTicket=catchAsyncError(async (req,res,next)=>{
    const tickets=await Ticket.findOne({user:req.user._id});
    if(!tickets || tickets.length ===0){
        return next(new ErrorHandler("Ticket not booked",404));
    };

    res.status(201).json({
        success:true,
        message:tickets
    })
})