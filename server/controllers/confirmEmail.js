const User=require('../models/user')
/* We have sent a mail using nodemailer along with a code and that is matched means user verified
so updating the document with verified as true */

module.exports.confirmEmail = (req, res) => {
  User.updateOne({confirmationCode: req.params.code}, 
    {verified:true}, function (err, docs) {
    if (err){
        console.log(err)
        return res.status(404)
    }
    else{
      res.status(200).send('<h1>Account verified, please <a href="http://localhost:3000/login">login</a></h1>')
    }
})
}
