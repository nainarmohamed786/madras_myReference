import mongoose from "mongoose";

const nonWorkingDays=new mongoose.Schema({
    date:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
});

const NonWorkingDay=mongoose.model("NonWorkingDay",nonWorkingDays);

NonWorkingDay.createIndexes();

export default NonWorkingDay;