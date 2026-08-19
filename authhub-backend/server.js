require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express=require('express')
const mongoose=require('mongoose')
const router = require('./routes/user.routes')
const cors=require('cors')
const app=express()
app.use(express.json())
app.use(cors())

async function connectdb(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connection is done")
    } catch (err) {
        console.error("MongoDB Connection Error: Please verify that your current IP address is whitelisted in your MongoDB Atlas Network Access configuration.")
        console.error("Error details:", err.message)
    }
}
connectdb()

app.use("/api/v1/data",router)
// console.log("MAIL =", process.env.MAIL);
// console.log("PASSI =", process.env.PASSI);
console.log("MAIL =", process.env.MAIL);
console.log("BREVO_API_KEY set =", Boolean(process.env.BREVO_API_KEY));
app.listen(process.env.PORT)
