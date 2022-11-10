const router = require("express").Router();
const Paint = require("../models/paint");
const { User } = require("../models/user");
const Paintuser = require("./../models/paintuser")

router.put("/:id", (req, res) => {
    const id = req.params.id
    const dataToBeUpdated = req.body
    User.findByIdAndUpdate(id, { ...dataToBeUpdated }, (err, doc) => {
        if (err)
            return res.status(404).json({ success: false, message: "user not found" })
        res.json({ success: true, message: "profile updated successfully" })
    })
})
router.delete("/:id", (req, res) => {
    const id = req.params.id
    User.findByIdAndDelete(id, (err, doc) => {
        if (err)
            return res.status(404).json({ success: false, message: "user not found" })
        Paintuser.deleteMany({ user_id: id }, (err, doc) => {
            if (err)
                return res.status(404).json({ success: false, message: "user not found" })
            Paint.deleteMany({ owner_id: id }, (err, doc) => {
                if (err)
                    return res.status(404).json({ success: false, message: "user not found" })
                res.json({ success: true, message: "profile deleted successfully" })
            })
        })
    })
})

//TODO: do some async await to fill the data array..
router.get("/history/:id",(req,res)=>{
    const id=req.params.id;
    let data=[];
    Paintuser.find({user_id:id},async (err,doc)=>{
        if(err)
            return res.status(404).json({success:false,message:"cannot get paints now.."})
        doc.forEach(paint => {
            Paint.findById(paint.paint_id,(err,result)=>{
                console.log(result)
                if(!err)
                    data=[...data,{imgString:result.imgString,title:result.title}]
            })
        })
        res.json({success:true,data})
    })
})

module.exports = router;