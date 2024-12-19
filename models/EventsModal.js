import mongoose from "mongoose";

const EventSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:String,
    video:String,
    pdf:String,
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    }
},{toJSON:{virtuals:true},timestamps:true});

const Event=mongoose.model("Event",EventSchema);
EventSchema.virtual("status").get(function(){
      if(this.startDate <=Date.now() && this.endDate >= Date.now()){
        return "Ongoing"
      }
      else if (this.startDate > Date.now()){
        return "Upcoming"
      }
      else{
        return "Completed"
      }
})

export default Event;