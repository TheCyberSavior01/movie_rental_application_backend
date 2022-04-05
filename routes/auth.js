const Joi = require("joi");

const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const router = express.Router();

// Testing
router.get("/", (req, res) => {
  res.send("working fine!");
});

// register a new user
router.post("/", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Credentials!");

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) return res.status(400).send("Invalid Credentials!");

  const token = user.generateAuthToken();

  res.send(token);
});

// function for validating user input
const validateAuth = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(20),
  });

  return schema.validate(data);
};

module.exports = router;
