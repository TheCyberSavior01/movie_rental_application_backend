const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 5, max: 20 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 8, max: 20 },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

// function for validating user input
const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(20),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(20),
  });

  return schema.validate(data);
};

exports.User = User;
exports.validateUser = validateUser;
