const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Email format is Incorrect...!! " + email);
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(passcode) {
            if (!validator.isStrongPassword(passcode)) {
                throw new Error("Entered passcode is weak...!!" + passcode);
            }
        },
        minlength: 6,
    },
},
    { timestamps: true }
);
  
userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return token;
}

userSchema.methods.validatePassword= async function(passwordInputByUser){
    const user=this;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);

    return isPasswordValid;
}

const User = mongoose.model('user', userSchema);

module.exports = User;