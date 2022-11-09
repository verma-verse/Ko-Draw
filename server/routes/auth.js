const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

const { EMAIL, PASSWORD } = process.env;

router.post("/login", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send({ success: false, message: error.details[0].message });

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
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(409).send({
      success: false,
      message: "User with given email already Exist!",
    });

  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  try {
    const user = await new User({ ...req.body, password: hashPassword }).save();
    const code = getrandomOTP();
    const redirectURL = user._id.toString() + code;
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });

    transport.sendMail({
      from: EMAIL,
      to: req.body.email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
                <h3>Hello ${req.body.firstName}</h3>
                <p>Thank you for considering us. Please confirm your email by clicking on the following link</p>
                <a href=http://localhost:8000/api/auth/verify/${redirectURL}> Click here</a>
                </div>`,
    });
    res.json({
      status: 201,
      message: "We've just sent an email... verify your account",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.get("/vreify/:id", (req, res) => {
  const code = req.params.id.slice(-6);
  console.log(code);
});
const getrandomOTP = () => {
  let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let otp = "";
  for (let i = 1; i <= 6; i++) {
    otp += str[Math.floor(Math.random() * 36)];
  }
  return otp;
};

module.exports = router;
