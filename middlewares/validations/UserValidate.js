import validator from 'validator';

const ValidateUser=(req,res,next)=>{
    const {firstName,lastName,phoneNumber,email,password}=req.body;

    const errors={};

    if(!firstName){
        errors.firstName="First name is required";
    } else if(!validator.isLength(firstName,{min:2})){
        errors.firstName="First name must be at least 2 characters long";
    }

    if(!lastName){
        errors.lastName="Last name is required";
    } else if(!validator.isLength(lastName,{min:2})){
        errors.lastName="Last Name must be at least 2 characters long";
    }

    if(!phoneNumber){
        errors.phoneNumber="Phone Number is required";
    }

    if(!email){
        errors.email="Email is required";
    }else if(!validator.isEmail(email)){
        errors.email="Invalid email address";
    }

    if(!password){
        errors.password="password is required";
    }else if(!validator.isLength(password,{min:6})){
        errors.password="Password must be at least 6 characters long";
    }

    if(Object.keys(errors).length > 0){
        return res.status(400).json({errors});
    }
    next();
};


export default ValidateUser;