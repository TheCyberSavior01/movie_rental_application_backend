const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Genre = mongoose.model("Genre", genreSchema);

// function for validating user input
const validateGenre = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(data);
};

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;
