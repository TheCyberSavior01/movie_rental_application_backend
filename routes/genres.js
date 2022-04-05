const express = require("express");
const { Genre, validateGenre } = require("../models/genresModel");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const router = express.Router();

// get all genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.status(200).send(genres);
});

// create a new genre
router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });

  const ifGenreExist = await Genre.findOne({ name: genre.name });
  if (ifGenreExist) return res.send("Genre already exists");

  genre = await genre.save();
  res.status(201).send(genre);
});

// update an existing genre
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { error } = validateGenre(req.body);
  if (error) res.send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(id, { name: req.body.name });
  if (!genre) return res.status(404).send(`Genre doesn't exist`);

  res.send(genre);
});

// delete an existing genre
router.delete("/:id", [auth, admin], async (req, res) => {
  const id = req.params.id;

  const genre = await Genre.findByIdAndRemove(id);

  if (!genre) return res.status(404).send(`Genre doesn't exist`);

  res.status(200).send("Deleted Successfully!");
});

module.exports = router;
