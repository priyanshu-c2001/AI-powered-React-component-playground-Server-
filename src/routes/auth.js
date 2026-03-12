const express = require('express');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const validator = require('validator');

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.json({ message: "User Added successfully!" });
  } catch (err) {
    res.status(400).json({ message: "Error saving the user:" + err.message });
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Format of emailId is Incorrect!!");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid Credentials..!!!");

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) throw new Error("Invalid Credentials..!!!");

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }).json({ user });
  }
  catch (err) {
    res.status(400).json({ message: "ERROR : " + err.message });
  }
});

userRouter.post('/logout', async (req, res) => {
  res.clearCookie("token").json({ message: "Logged out Successfully..!!!" });
});

module.exports = userRouter;