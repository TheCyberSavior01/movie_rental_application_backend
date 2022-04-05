const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genresModel");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, required: true },
  dailyRentalRate: { type: Number, required: true },
});

const Movie = mongoose.model("Movie", movieSchema);

// function for validating user input
const validateMovie = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
  });

  return schema.validate(data);
};

exports.Movie = Movie;
exports.validateMovie = validateMovie;
