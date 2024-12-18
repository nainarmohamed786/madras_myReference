
const isAuthorized=(...roles)=>{
    return(req,res,next)=>{
        console.log(roles)
        if(roles.includes(req?.user?.role)){
            res.status(500).json({
                success:false,
                message:"you are not authorized user"
            });
        }
        next()
    }
}


export default isAuthorized;