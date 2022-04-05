const express = require("express");
const genresRouter = require("./routes/genres");
const customerRouter = require("./routes/customers");
const movieRouter = require("./routes/movie");
const rentalRouter = require("./routes/rental");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const config = require("config");
const mongoose = require("mongoose");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost:27017/movie-rental-app")
  .then(() => console.log("Connected to mongodb"));

const app = express();
app.use(express.json());

// routes
app.use("/api/genres", genresRouter);
app.use("/api/customers", customerRouter);
app.use("/api/movies", movieRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

// setting up the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
