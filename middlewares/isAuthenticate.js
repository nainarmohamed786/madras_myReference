import jwt from 'jsonwebtoken';
import UserModals from '../models/UserModels.js';
import catchAsyncError from './catchAsyncError.js';;
import ErrorHandler from '../utils/ErrorHandler.js';

const isAuthenticate=catchAsyncError(async (req,res,next)=>{
    try{
        const authHeader=req.headers.authorization || req.headers.Authorization;
        const tokenHeader=Array.isArray(authHeader) ? authHeader[0] : authHeader;
        console.log(tokenHeader);
        const token=tokenHeader.split(" ")[1];

        console.log(token);
    
        if(!token || token==="undefined" || token==="null"){
            return next(new ErrorHandler("missing token",404));
        };
    
        jwt.verify(token,process.env.ACCESSTOKEN_SECUIRITY_KEY,async(err,decode)=>{
            if(err){
                return next(new ErrorHandler("Token is not valid or expired",401));
            };
    
            try{
             const user=await UserModals.findById(decode.id);
             if(!user){
                return next(new ErrorHandler("user is not found",404));
             };
             req.user=user;
             next()
    
            }
            catch(err){
                return next(new ErrorHandler("Authorization is  failed",500))
            }
        })
    }
    catch(err){
        return next(new ErrorHandler("Authorization is failed",500))
    }
});

export default isAuthenticate;