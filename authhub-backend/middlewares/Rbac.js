const roleBased=async(req,resp,next)=>{
    if(req.user.role=='admin'){
        next()
    }
    else{
        return resp.json({
            success:false,
            message:"you arent authorized to access this page"
        })
    }
}
module.exports=roleBased