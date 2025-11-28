const bcrypt = require("bcrypt");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../emails/emailHandlers");
const { ENV } = require("../lib/env");

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      console.log("please Enter all fields");

      return res.status(400).json({
        success: false,
        message: `All fields are required`,
      });
    }

    //check if valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: `Please Enter valid email !`,
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: `Password must have lenth of 6`,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: `Email already exits`,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      await newUser.save();
      res.status(201).json({
        success: true,
        message: "Successfully registered",
      });
      try {
        await sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL);
      } catch (error) {
        console.log("WelCome email not sent", error);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `Bad request`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal server Error`,
    });
  }
};

const login = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!((fullName || email) && password)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // const user = null;
    const user = await User.findOne({
      $or: [{ email }, { fullName }],
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exit",
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const payload = {
      userId: user._id,
      username: user.fullName,
    };
    const secret_key = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret_key, { expiresIn: "30m" });

    res.status(200).json({
      success: true,
      message: "Successfully logedin",
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { signup, login };
