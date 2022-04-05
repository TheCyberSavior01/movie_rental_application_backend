const express = require("express");
const { Rental, validateRental } = require("../models/rentalModel");
const { Movie } = require("../models/movieModel");
const { Customer } = require("../models/customerModel");

const router = express.Router();

// get all the rentals
router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

// create a new rental
router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.send("invalid movie");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.send("invalid customer");

  if (movie.numberInStock === 0) return res.send("Movie is out of stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental = await rental.save();

  movie.numberInStock--;
  movie.save();
  res.send(rental);
});

module.exports = router;
