const router = require("express").Router();
const Paint = require("./../models/paint")
const Paintuser = require("./../models/paintuser")
const { User } = require("./../models/user")

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
                res.json({ success: true, message: "paint saved succssfully", paint: result.id });
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

module.exports = router;