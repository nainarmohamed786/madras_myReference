import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema=new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    phoneNumber:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin","super-admin"],
        default:"user"
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordTokenExpired:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

UserSchema.pre("save",async function(next) {
    if(!this.isModified("password")){
        return next();
    };
    
    this.password=await bcrypt.hashSync(this.password,10);
    next();
});

UserSchema.methods.generateAccessToken=function(){
    return jwt.sign({id:this.id,role:this.role},process.env.ACCESSTOKEN_SECUIRITY_KEY,{expiresIn:process.env.ACCESS_EXPIRESTIME})
};

UserSchema.methods.generateRefreshToken=function(){
    return jwt.sign({id:this.id,role:this.role},process.env.REFRESHTOKEN_SECUIRITY_KEY,{expiresIn:process.env.REFERSH_EXPIRESTIME});
};


UserSchema.methods.isValidPassword=async function(enteredPassword){
   return bcrypt.compare(enteredPassword,this.password)
};

UserSchema.methods.generateResetToken=function(){
    const token=crypto.randomBytes(16).toString("hex");
    console.log("Token is created", token);
    this.resetPasswordToken=crypto.createHash("sha256").update(token).digest("hex");
    console.log("reset password token with encrypted",this.resetPasswordToken);

    this.resetPasswordTokenExpired=Date.now()+10*60*1000;
    console.log(this.resetPasswordTokenExpired);
    return token;
}


const User=mongoose.model("userRefer", UserSchema);

export default User;