const express = require("express");
const { Genre } = require("../models/genresModel");
const { Movie, validateMovie } = require("../models/movieModel");
const router = express.Router();

// get all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.status(200).send(movies);
});

// create a new movie
router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.send("invalid genre!");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  movie = await movie.save();
  res.status(201).send(movie);
});

// update an existing movie
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { error } = validateMovie(req.body);
  if (error) res.send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.send("invalid genre!");

  const movie = await Movie.findByIdAndUpdate(id, {
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  if (!movie) return res.status(404).send(`Movie doesn't exist`);

  res.send(movie);
});

// delete an existing genre
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const movie = await Movie.findByIdAndRemove(id);

  if (!movie) return res.status(404).send(`Movie doesn't exist`);

  res.status(200).send("Deleted Successfully!");
});

module.exports = router;
