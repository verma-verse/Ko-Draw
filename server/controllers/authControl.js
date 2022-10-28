const User=require('../models/user')
const jwt=require('jsonwebtoken')
require("dotenv").config()
const config=require('../config')
const {google}=require('googleapis')
const OAuth2=google.auth.OAuth2

const OAuth2_client=new OAuth2(config.clientId, config.clientSecret)
OAuth2_client.setCredentials({refresh_token:config.refreshToken})


const nodemailer=require('nodemailer')          //used it to send mail to newly registered emails for verification purposes.
const {JWT_SECRET}=process.env       //jwt secret, email and password of the gmail account from which we will send mails

const createToken=(id)=>{       //function to create jwt cookies
    return jwt.sign({id}, JWT_SECRET,{
        expiresIn:3*24*60*60*1000
    })
}

//login ->
module.exports.login=async (req,res)=>{
    const {email, password}=req.body
    try{
        const user=await User.login(email,password)
        if(!user.verified)          //verified is a field in the user document, we are setting it to true when their email is verified. Here we are allowing only verified people to login
            return res.json({status:404,message:"account not verified"})
        const token=createToken(user._id)
        res.cookie('jwtCookie',token,{httpOnly:false, maxAge:3*24*60*60*1000})      
        res.json({status:200,user:user._id,userType:user.userType})
    }
    catch(err){
        console.log(err)
        res.json({status:400,error:err.message})
    }
}

//register ->
module.exports.register=async (req,res)=>{
   
    /* creating a confirmation code which will be stored in db for email verification of the users and then
    creating the user, and sending a mail for verification. If verified then only one can log in 
 */
    try{
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';      
        for (let i = 0; i < 25; i++) {
            code += characters[Math.floor(Math.random() * characters.length )];
        }
        const user= await User.create({...req.body,confirmationCode:code})
        const accessToken=OAuth2_client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type:'OAuth2',
                user: config.user,
                clientId:config.clientId,
                clientSecret:config.clientSecret,
                refreshToken:config.refreshToken,
                accessToken:accessToken
            },
          })
          transport.sendMail({
            from: config.user,
            to: req.body.email,
            subject: "Please confirm your account",
            html: `<h1>Email Confirmation</h1>
                <h2>Hello ${req.body.name}</h2>
                <p>Thank you for considering us. Please confirm your email by clicking on the following link</p>
                <a href=http://localhost:8080/verify/${code}> Click here</a>
                </div>`,
          }).catch(err => console.log(err));
          res.json({status:201,message:"We've just sent an email... verify your account"})
    }
    catch(err){
        let error=err.message
        if(err.code===11000)
            error="Email is already registerd"
        res.json({status:400,error:error})
    }
}

//logout ->
module.exports.logout=(req,res)=>{
    res.cookie('jwtCookie','',{maxAge:1})       //set cookie age 1ms and already removed the data in sessionStorage from frontend  
    res.json({status:200, message:"successfully logged out"})
}