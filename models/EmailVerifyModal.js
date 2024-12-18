import mongoose from "mongoose";

const emailSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required"]
    },
    token:{
        type:String,
        required:true
    },
    expires:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


const EmailModel=mongoose.model("VerifiedEmail",emailSchema);

export default EmailModel;