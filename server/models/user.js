const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const JWT_PRIVATE_KEY = process.env.JWTPRIVATEKEY

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dp: { type: String },
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, JWT_PRIVATE_KEY, {
        expiresIn: "7d",
    });
    return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email(),
        password: passwordComplexity(),
    });
    return schema.validate(data);
};

module.exports = { User, validate };