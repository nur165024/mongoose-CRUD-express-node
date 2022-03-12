const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
const router = express.Router();
const User = new mongoose.model("User", userSchema);
const checkLogin = require("../middlewares/checkLogin");

// user signup
router.post("/signup", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newTodo = new User({
      name: req.body.name,
      phone: req.body.phone,
      userName: req.body.userName,
      password: hashPassword,
      status: req.body.status,
    });
    await newTodo.save();
    res.status(200).json({
      message: "Signup was successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "This is server side error!",
    });
  }
});

// user login
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ phone: req.body.phone });

    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      if (isValidPassword) {
        const token = jwt.sign(
          {
            userId: user[0]._id,
            phone: user[0].phone,
            name: user[0].name,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          access_token: token,
          message: "Login Successfully!",
        });
      } else {
        res.status(401).json({
          error: "Authentication failed!",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication failed!",
      });
    }
  } catch (error) {
    res.status(401).json({
      error: "Authentication failed!",
    });
  }
});

// user list
router.get("/", checkLogin, async (req, res) => {
  try {
    const userList = await User.find({}).populate("todos");
    res.status(200).json({
      data: userList,
      message: "Success",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

module.exports = router;
