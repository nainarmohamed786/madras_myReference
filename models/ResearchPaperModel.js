import mongoose from "mongoose";

const ResearchPaper=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    video:{
        type:String
    },
    description:{
        type:String
    },
    pdf:{
        type:String
    }
},{timestamps:true});

const Schema=mongoose.model("ResearchPaper",ResearchPaper);

export default Schema;;