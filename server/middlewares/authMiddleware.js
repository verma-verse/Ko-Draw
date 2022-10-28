const jwt=require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()
JWT_SECRET=process.env.JWT_SECRET

const checkUser=async(req,res)=>{
   // Getting cookie and verifying it to ensure user is logged in..
    const token=await req.cookies.jwtCookie
    if(token){          
        jwt.verify(token,JWT_SECRET,async(err,decodedToken)=>{
            if(err){
                console.log(err.message)
                res.status(404).json({user:""})
            }
            else{
                User.findById(decodedToken.id).exec()
                .then((user)=>
                    res.json({status:200,user:user._id,userType:user.userType}))
                .catch((e)=>res.json({status:404,user:""}))
            }
        })
    }
    else{
        res.json({status:404,user:""})
    }
}


module.exports={checkUser}