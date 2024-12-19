import dotenv from 'dotenv';
dotenv.config();
import UserModals from '../models/UserModels.js';
import catchAsyncError from '../middlewares/catchAsyncError.js';
import EmailModel from '../models/EmailVerifyModal.js';
import sendToken from '../utils/sendToken.js';
import crypto from 'crypto';
import sendMail from '../utils/mailService.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';

export const signUp=catchAsyncError(async(req,res,next)=>{

    const {firstName,lastName,phoneNumber,email,password}=req.body;

    const users=await UserModals.findOne({email});
    console.log(users)

    if(users?.isVerified===true){
        return next (new ErrorHandler("Email already exists",400));
    };
    //generate a token and its hashed version
    const rawToken=crypto.randomBytes(32).toString("hex");
    console.log("raw token",rawToken)
    const hashedToken=crypto.createHash("sha256").update(rawToken).digest("hex");

    let user;
    if(users){
        user=await UserModals.updateOne({email},{token:hashedToken,expires:Date.now()+3*60*1000})
    }
    else{
        user=await UserModals.create({email,token:hashedToken,expires:Date.now()+3*60*1000,isVerified:false,role:"user",firstName,lastName,phoneNumber,password}) //3 minutes
    }

    await user.save();

    const verificationUrl=`${process.env.FRONTEND_URL}/verify-email?verify=${rawToken}&email=${encodeURIComponent(email)}`;

    const emailMessage=`
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
      <h1 style="color: #333;">Email Verification</h1>
      <p style="font-size: 16px; color: #555;">Click the link below to verify your email:</p>
      <a href="${verificationUrl}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
      <p style="font-size: 14px; color: #777; margin-top: 20px;">This link will expire in 3 minutes.</p>
      <div style="margin-top: 30px; font-size: 12px; color: #aaa; text-align: center;">
          <p>If you did not request this email, please ignore it.</p>
      </div>
  </div>
    `;

    await sendMail({
        email,
        subject:"Email Verification",
        message:emailMessage
    });



    sendToken(user,201,res);

});



export const sendVerificationEmail=catchAsyncError(async(req,res,next)=>{
    const {email}=req.body;

    const exitingUser=await UserModals.findOne({email});

    //check if the user alreadu exists
    if(exitingUser){
        return next(new ErrorHandler("Email already exists",400))
    };

    //generate a token and its hashed version
    const rawToken=crypto.randomBytes(32).toString("hex");
    console.log("raw token",rawToken)
    const hashedToken=crypto.createHash("sha256").update(rawToken).digest("hex");

    const emailVerificationExist=await EmailModel.findOne({email});

    if(emailVerificationExist){
        await EmailModel.updateOne({email},{token:hashedToken,expires:Date.now()+3*60*1000}) //3 minutes
    }
    else{
        await EmailModel.create({email,token:hashedToken,expires:Date.now()+3*60*1000}) //3 minutes
    }

    const verificationUrl=`${process.env.FRONTEND_URL}/verify-email?verify=${rawToken}&email=${encodeURIComponent(email)}`;

    const emailMessage=`
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
      <h1 style="color: #333;">Email Verification</h1>
      <p style="font-size: 16px; color: #555;">Click the link below to verify your email:</p>
      <a href="${verificationUrl}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
      <p style="font-size: 14px; color: #777; margin-top: 20px;">This link will expire in 3 minutes.</p>
      <div style="margin-top: 30px; font-size: 12px; color: #aaa; text-align: center;">
          <p>If you did not request this email, please ignore it.</p>
      </div>
  </div>
    `;

    await sendMail({
        email,
        subject:"Email Verification",
        message:emailMessage
    });

    res.status(200).json({message:"Verification email sent successfully"});

});


export const verifyEmail=catchAsyncError(async(req,res,next)=>{
    let token=req.params.token;
    console.log("params token",token);

    token=crypto.createHash("sha256").update(token).digest("hex");
    console.log("hashed token",token);

    const emailVerification=await UserModals.findOne({token});

    if(!emailVerification ||emailVerification.expires < Date.now()){
        return next(new ErrorHandler("Invalid or expired token",400));
    }

    await emailVerification.updateOne({isVerified:true,token:undefined,expires:undefined});
 

    res.status(200).json({message:"Email verified successfully"});
});


export const signin=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password",409));
    };

    if(!validator.isEmail(email) || !validator.isLength(password,{min:6})){
        return next(new ErrorHandler("Please provide valid email",409))
    }

    const user=await UserModals.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password"));
    }

    const isPasswordMatched=await user.isValidPassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Password doesn't match",401))
    };

    sendToken(user,201,res);
});

export const getAccessToken=catchAsyncError(async (req,res,next)=>{
   try{
     const refershToken=req.cookies.key;
     if(!refershToken){
        return next(new ErrorHandler("Refresh token is missing",404));
     };

     jwt.verify(refershToken,process.env.REFRESHTOKEN_SECUIRITY_KEY,async(err,decode)=>{
        if(err){
            return next(new ErrorHandler("Refresh token is not valid",400));
        }

        const user=await UserModals.findById(decode.id);

        if(!user){
            return next(new ErrorHandler("user is not found",404));
        }
        req.user=user;

        const accessToken=await user.getAccessToken();
        res.json({accessToken});

     })

   }catch(err){
       return next(new ErrorHandler("Refresh token is failed"));
   } 
})


export const forgotPassword=catchAsyncError(async (req,res,next)=>{
    const {email}=req.body;

    if(!email || !validator.isEmail(email)){
      return next(new ErrorHandler("Please provide valid email",401));
    }

    const user=await UserModals.findOne({email});

    if(!user){
        return next(new ErrorHandler("couldn't find the user",409));
    }

    const resetToken=await user.generateResetToken();
    await user.save({validatingBeforeSave:false});

    try {
        const resetUrl = `${
          process.env.FRONTEND_URL
        }/reset-password?verify=${resetToken}&email=${encodeURIComponent(email)}`;
        const message = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
          <h1 style="color: #333;">Reset Password</h1>
          <p style="font-size: 16px; color: #555;">Click the link below to reset your password:</p>
          <a href="${resetUrl}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">This link will expire in 3 minutes.</p>
          <div style="margin-top: 30px; font-size: 12px; text-align: center; color: #aaa;">
              <p>If you did not request this email, please ignore it.</p>
          </div>
      </div>
    `;
        const subject = "Reset password for booking app";

        sendMail(
            {
                email,
                subject,
                message
            }
        );

        res.status(201).json(`email has been sent ${email}`)

    }catch(err){
       user.resetPasswordToken=undefined;
       user.resetPasswordTokenExpired=undefined;
       await user.save({validateBeforeSave:false});
       res.status(500).json({message:err})
    }
});

export const resetPassword=catchAsyncError(async (req,res,next)=>{
    const {newPassword,confirmPassword}=req.body;

    if(!newPassword || !confirmPassword || newPassword.isLength < 6 || confirmPassword .isLength < 6){
        return next(new ErrorHandler("Please enter valid password",401));
    };

    const resetToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    console.log("resetToken",resetToken)

    const user=await UserModals.findOne({resetPasswordToken:resetToken});

    if(!user){
        return next(new ErrorHandler("token is not valid",402));
    };

    user.password=newPassword;
    user.resetPasswordToken=undefined;
    user.resetPasswordTokenExpired=undefined;
    await user.save({validateBeforeSave:false});

    res.status(201).json({message:"password has been changed"});

});


export const logout=catchAsyncError(async (req,res,next)=>{
    res.clearCookie("key", { path: "/" });
    res.status(201).json({message:"logout is successfull"});
});