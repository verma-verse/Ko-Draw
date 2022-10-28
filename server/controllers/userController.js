const User=require('../models/user')

module.exports.getUser=(req,res)=>{     //for fetching the profile of the user
    const id=req.params.id              //remember user id was stored as jwt cookie
    User.findById(id,(e,doc)=>{
        if(e){
            res.status(404).json({status:404,error:"not found"})
        }
        else{
            res.status(200).json({...doc._doc})
        }
    })
}