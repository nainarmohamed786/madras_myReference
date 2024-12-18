const sendToken=async(user,statuscode,res)=>{
    const refreshToken=await user.generateRefreshToken();
    const accessToken=await user.generateAccessToken();

    const refreshTokenExpires={
        expires:new Date(Date.now()+parseInt(process.env.REFERSH_TOKEN_COOKIE_EXPIRES)*24*60*60*1000),
        httpOnly:true,
        path:'/',
        secure:false
    };

    const {password,...rest}=user._doc;

    res.status(statuscode).cookie("key",refreshToken,refreshTokenExpires).json({...rest,accessToken});
};

export default sendToken;