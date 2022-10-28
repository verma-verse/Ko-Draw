const User=require('../models/user')
const nodemailer=require('nodemailer')
const config=require('../config')
const {google}=require('googleapis')
const OAuth2=google.auth.OAuth2

const OAuth2_client=new OAuth2(config.clientId, config.clientSecret)
OAuth2_client.setCredentials({refresh_token:config.refreshToken})


module.exports.resetPassword=(req,res)=>{       //request to send email to the user containing OTP
    const id=req.params.id
    User.findOne({email:id}).exec()
    .then((doc)=>{
            const characters='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            let otp = ''    
            for (let i = 0; i < 6; i++) {
                otp += characters[Math.floor(Math.random() * characters.length )]
            }
            doc.otp=otp
            doc.save()
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
                subject: "Password reset",
                html: `<h2>Hello ${doc.name}</h2>
                    <p>OTP to reset your password is: <h2>${otp}</h2></p>
                    <h3>If you have not requested to reset password. Ignore the message</h3>
                    </div>`,
              }).catch(err => console.log(err));
            res.json({status:200,message:"otp sent to email."})
    })
    .catch((e)=>    res.json({status:404,message:"this email is not registered"}))
}

module.exports.checkingOTP=(req,res)=>{     //to match the OTP
    const {email,code}=req.params
    User.findOne({email}).exec()
    .then((doc)=>{
       if(code===doc.otp){
          res.json({status:200,user:doc._id})
        }else{
            res.json({status:404,message:"incorrect OTP"})
        }
    })
    .catch((e)=>    res.json({status:404,message:"unauthorized access"}))
}

module.exports.updatePassword=(req,res)=>{      //to finally update the password
    const {password}=req.body
    const {id,otp}=req.params
    User.findById(id,function(e,doc){
        if(e){
            console.log(e)
            res.json({status:404,message:"cannot update now"})
        }else if(otp!==doc.otp){
            res.json({status:404,message:"unauthorized access"})
        }
        else{
            doc.password=password
            doc.save()
            .then(()=>res.json({status:200,message:"password updated successfully"}))
            .catch((e)=>res.json({status:404,message:"cannot update now"}))
        }
    })
}