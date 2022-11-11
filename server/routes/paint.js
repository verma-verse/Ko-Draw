const router = require("express").Router();
const Paint = require("./../models/paint")
const Paintuser = require("./../models/paintuser")
const { User } = require("./../models/user")
const nodemailer = require('nodemailer')
require("dotenv").config();
const { EMAIL, PASSWORD } = process.env;

router.get("/paint/:id", (req, res) => {
    const id = req.params.id;
    Paint.findById(id, (err, doc) => {
        if (err)
            return res.status(404).json({ success: false, message: "cannot get paint now" })
        return res.json({ success: true, paintId: doc._id, imgString: doc.imgString, title: doc.title })
    })
})
router.post("/add/:id", async (req, res) => {
    const id = req.params.id
    if (!req.body.imgString || !req.body.title)
        return res.status(404).json({ success: false, message: "some fields missing" })
    User.findById(id, (err, docs) => {
        if (err)
            return res.status(401).json({ success: false, message: "User not found" })
        let newPaint = new Paint({
            owner_id: id,
            contributors: [id],
            imgString: req.body.imgString,
            title: req.body.title,
            version: req.body.version || []
        })
        newPaint.save(function (err, result) {
            if (err)
                return res.status(500).json({ success: false, message: "Cannot save paint" })
            let relation = new Paintuser({
                user_id: id,
                paint_id: result.id
            })
            relation.save((err, docq) => {
                if (err)
                    return res.status(404).json({ success: false, message: "cannot save data" })
                res.json({ success: true, message: "paint saved succssfully", paint: result.id, title: result.title });
            })
        })

    })
});

router.delete("/:id", (req, res) => {
    const id = req.params.id
    Paint.findByIdAndDelete(id, (err, doc) => {
        if (err)
            return res.status(404).json({ success: false, message: "cannot delete document" })
        Paintuser.deleteMany({ paint_id: id }, (err, doc) => {
            if (err)
                return res.status(404).json({ success: false, message: "cannot delete references" })
            res.json({ success: true, message: "paint deleted successfully" })
        })
    })
})

router.post("/share", (req, res) => {
    const { addresses, paintId, title, owner } = req.body
    let transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL,
            pass: PASSWORD,
        },
    });
    addresses.forEach(email => {
        User.findOne({ email: email }, (err, user) => {
            if (!err) {
                Paintuser.findOne({ user_id: user._id, paint_id: paintId }, (err, result) => {
                    if (!result) {
                        new Paintuser({ user_id: user._id, paint_id: paintId }).save((err, doc) => {
                            if (err)
                                return res.status(404).json({ success: false, message: "cannot invite user" })
                            transport.sendMail({
                                from: EMAIL,
                                to: email,
                                subject: "Became a contributor in paint",
                                html: `<h1>Paint information</h1>
                                        <h3>Hello ${user.firstName}</h3>
                                        <div>You are added as a contributer to a paint <em>${title}</em> by <em>${owner}</em><br/>
                                        <a href="http://localhost:3000/profile" >Go to my profile</a>
                                        </div>`,
                            });
                        })
                    }
                })
            }
        })
    });
    res.json({ success: true, message: "invited successfully" })
})

router.get("/contributors/:id", (req, res) => {
    const id = req.params.id;
    Paintuser.find({ paint_id: id }, (err, doc) => {
        if (err)
            return res.status(404).json({ success: false, message: "no users found", users: [] })
        res.json({ success: true, users: doc })
    })
})

module.exports = router;