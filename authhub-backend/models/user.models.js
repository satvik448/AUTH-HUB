const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const UserSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
        lowercase:true
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

UserSchema.pre("validate", function() {
    if (this.role) {
        this.role = this.role.toLowerCase();
    }
});

UserSchema.pre("save",async function(){
    if(!this.isModified("password")) return
    const hashedPassword=await bcrypt.hash(this.password,10)
    this.password=hashedPassword
})

const User=mongoose.model('User',UserSchema)

module.exports=User

