const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/login", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "logged in successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post("/register", async (req, res) => {
    try {
        console.log(req.body)
        //TODO: validate the data (can be done in the frontend too.)
        // const { error } = validate(req.body);
        // if (error)
        //     return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res
                .status(409)
                .send({ success: false, message: "User with given email already Exist!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();
        res.status(201).send({ success: true, message: "User created successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
});


const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

const getrandomOTP = () => {
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let otp = ""
    for (let i = 1; i <= 6; i++) {
        otp += str[Math.floor(Math.random() * 36)]
    }
    return otp;
}

module.exports = router;