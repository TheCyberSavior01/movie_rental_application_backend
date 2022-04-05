const express = require("express");
const bcrypt = require("bcrypt");

const { User, validateUser } = require("../models/userModel");
const auth = require("../middlewares/auth");
const router = express.Router();

// get the current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

// register a new user
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.send(error.details[0].message);

  let user = await User.findOne({ name: req.body.email });
  if (user) return res.status(400).send("User is already registered!");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;

  user = await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).status(201).send({
    name: user.name,
    email: user.email,
  });
});

module.exports = router;
