const router = require("express").Router();
const { User } = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

const { EMAIL, PASSWORD } = process.env;

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ success: false, message: "Invalid Email" });
    if (!user.isVerified)
      return res
        .status(401)
        .send({ success: false, message: "First Verify your account" });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Password" });

    const token = user.generateAuthToken();
    //TODO: check if cookie is working...
    res.cookie("jwtCookie", token, {
      httpOnly: false,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      dp: user.dp,
      message: "logged in successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
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
                <p>Please confirm your account by clicking on the below <em>one time</em> link</p>
                <a href=http://localhost:8000/api/auth/verify/${redirectURL}> Click here</a>
                </div>`,
    });
    const hashCode = await bcrypt.hash(code, salt);
    const newToken = new Token({ user: user._id, token: hashCode });
    newToken.save((err, doc) => {
      if (err)
        return res
          .status(404)
          .json({ success: false, message: "cannot set verification token" });
      res.json({
        status: 201,
        success: true,
        message: "We've just sent an email. Verify your account",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.get("/verify/:id", (req, res) => {
  const id = req.params.id.slice(0, -6);
  const code = req.params.id.slice(-6);
  Token.findOneAndDelete({ user: id }, async (err, doc) => {
    if (err)
      return res
        .status(404)
        .json({ success: false, messsage: "cannot verify user" });
    const check = await bcrypt.compare(code, doc.token);
    if (!check)
      return res
        .status(404)
        .json({ success: false, messsage: "cannot verify user" });
    User.findByIdAndUpdate(id, { isVerified: true }, (err, doc) => {
      if (err)
        return res
          .status(404)
          .json({ success: false, message: "cannot update verified user" });
      res.json({
        success: true,
        message: "verified successfully. Please login",
      });
    });
  });
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
