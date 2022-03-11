const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");

// express app initialization
const app = express();
dotenv.config();
app.use(express.json());

// database connect with mongoose
mongoose
  .connect("mongodb://localhost/todos")
  .then(() => console.log("connection successfully!"))
  .catch((err) => console.log(err));

// app application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSend) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

// app listening
app.listen(5000, () => {
  console.log(`app listening at post 5000`);
});
