const jwt = require('jsonwebtoken')

const Auth=async(req,resp,next)=>{
    try{
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        const token=req.headers.authorization.split(" ")[1]
        if(!token){
            return resp.json({
                success:false,
                message:"token not found"
            })
        }
        const decoded=jwt.verify(token,process.env.ACC_KEY)
        req.user=decoded
        return next()
    }
    else{
        return resp.json({
            success:false,
            message:"some issue in your process"
        })
    }
    }catch(err){
        return resp.json({
            success:false,
            message:err.message
        })
    }
}
module.exports=Auth