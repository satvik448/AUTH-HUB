const express=require('express')
const { body } = require('express-validator')
const User = require('../models/user.models')
const { Getdata, Postdata, Patchdata, Deletedata, signup, login, reset, forget, resetPassword } = require('../controllers/user.controllers')
const router=express.Router()

const validation=[
    body('email').isEmail().withMessage("email is required"),
    body('name').isLength(5).withMessage("name should be minimum of length 5"),
    body('password').isLength(6).withMessage("password should be minimum of length 6"),
    body('email').custom(async(val)=>{
        const user=await User.findOne({email:val})
        if(user){
            throw new Error("user already exists ")
        }
    })
]

router.get("/",Getdata)
router.post("/",validation,Postdata)
router.patch("/:id",Patchdata)
router.delete("/:id",Deletedata)
router.post("/signup",signup)
router.post("/login",login)
router.post("/reset",reset)
router.post("/forget",forget)
router.post("/reset/:token",resetPassword)



module.exports=router

