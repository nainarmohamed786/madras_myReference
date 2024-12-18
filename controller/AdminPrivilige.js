import UserModals from "../models/UserModels.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";



export const createAdmin=catchAsyncError(async (req,res, next)=>{
    const {firstName,lastName,email,phoneNumber,password}=req.body;

    const user=await UserModals.findOne({email});

    if(user){
        return next(new ErrorHandler("user is already registrate",400));
    };

    const admin=await UserModals.create({
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        role:"admin"
    });

    await admin.save();

    res.status(200).json({
        success:true,
        admin
    })

});


export const getUser=catchAsyncError(async (req,res,next)=>{
    const {email}=req.query;
    const user=await UserModals.findOne({email});
    if(!user || user.length===0){
        return next(new ErrorHandler("User not found",404));
    }
    res.status(200).json({
        success:true,
        user
    })
});

export const promoteUser=catchAsyncError(async (req,res,next)=>{
    const {email}=req.query;
    const user=await UserModals.findOne({email});
    if(!user || user.length===0){
        return next(new ErrorHandler("user not found",404));
    }
    user.role="admin";
    await user.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        user
    })
});


export const demoteUser=catchAsyncError(async (req,res,next)=>{
    const {email}=req.query;
    const user=await UserModals.findOne({email});
    if(!user || user.length===0){
        return next(new ErrorHandler("users not found",404));
    }
    user.role="user";
    await user.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        user
    })
});


export const getAdmins=catchAsyncError(async (req,res,next)=>{
    const admins=await UserModals.find({role:"admin"});
    res.status(200).json({
        success:true,
        admins
    })
})

