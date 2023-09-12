const JWT = require("jsonwebtoken");
var { expressjwt: jwt } = require("express-jwt");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");

//middleware
const requireSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and must be 6 characters long.",
      });
    }
    // existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User already registered with this email",
      });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // save user
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();
    return res.status(201).send({
      success: true,
      message: "Registered Successfully. Please Login!!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in register API",
      error,
    });
  }
};

// login controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide email or password",
      });
    }

    // find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }

    // match password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid username or password",
      });
    }

    // TOKEN JWT
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //undefined password
    user.password = undefined;

    return res.status(200).send({
      success: true,
      message: "User Logged In successfully!!!",
      token,
      user,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

// update user
const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    //user find
    const user = await userModel.findOne({ email });

    // password  validate
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and should be 6 characters long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    // updated user
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );

    updatedUser.password = undefined;

    return res.status(200).send({
      success: true,
      message: "Profile Updated. Please login",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in updating user profile",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
};
