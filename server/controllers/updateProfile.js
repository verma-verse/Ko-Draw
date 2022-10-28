const User=require('../models/user')
module.exports.updateProfile=(req,res)=>{
    User.findByIdAndUpdate(req.params.id,{...req.body}).exec()
    .then((doc)=>{
        res.json({status:200,message:"successfully updated"})
    })
    .catch((e)=>{console.log(e)
            res.json({status:400,message:"can't update now \ntry again later"})})
}