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

module.exports = router;