const ServiceData=require('../services/user.services')
const jwt=require('jsonwebtoken')
const {validationResult}=require('express-validator')
const Getdata=async(req,resp)=>{
    const data=await ServiceData.Getingdata()
    resp.json(data)
}
const Postdata=async(req,resp)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return resp.json({
            success:false,
            message:errors.array()
        })
    }
    const data=await ServiceData.Postingdata(req.body)
    resp.json(data)
}
const Patchdata=async(req,resp)=>{
    const data=await ServiceData.Patchingdata(req.params.id,req.body)
    resp.json(data)
}
const Deletedata=async(req,resp)=>{
    const data=await ServiceData.Deletingdata(req.params.id)
    resp.json(data)
}
const signup = async (req, resp) => {
  try {
    const data = await ServiceData.Signup(req.body);
    resp.json(data);
  } catch (err) {
    resp.status(400).json({
      success: false,
      message: err.message || "Signup failed",
    });
  }
};
const login = async (req, resp) => {
  try {
    const data = await ServiceData.Login(req.body.email, req.body.password);
    resp.json(data);
  } catch (err) {
    resp.status(400).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
};
const reset=async(req,resp)=>{
    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return resp.json({
            success:false,
            message:"format is incorrect you are trying to acces in wronf format"
        })
    }
    const token=authHeader.split(" ")[1]
    const decode=jwt.verify(token,"refsecretkey")
    if(!decode){
        return resp.json({
            success:false,
            messahe:"you are not verified user"
        })
    }
    const newAccToken=jwt.sign({id:decode.id,role:decode.role},"accsecretkey",{expiresIn:"2d"})
    resp.json({
        newAccToken
    })
}
const forget = async (req, resp) => {
  try {
    const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
    const data = await ServiceData.Forgot(req.body.email, origin);
    resp.json(data);
  } catch (err) {
    resp.status(400).json({
      success: false,
      message: err.message || "Failed to process forgot password request",
    });
  }
};
const resetPassword = async (req, resp) => {
  try {
    const data = await ServiceData.reset(req);
    resp.json(data);
  } catch (err) {
    resp.status(400).json({
      success: false,
      message: err.message || "Reset password failed",
    });
  }
};

module.exports={
    Getdata,
    Postdata,
    Patchdata,
    Deletedata,
    signup,
    login,
    reset,forget,
    resetPassword
}
