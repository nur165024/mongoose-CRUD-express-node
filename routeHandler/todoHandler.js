const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");
const router = express.Router();
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);
const checkLogin = require("../middlewares/checkLogin");

// GET ALL THE TODO'S
router.get("/", checkLogin, async (req, res) => {
  try {
    const data = await Todo.find().populate(
      "user",
      "name phone userName status"
    );
    res.status(200).json({
      result: data,
      message: "Success",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

// GET ALL STATUS : @ACTIVE (METHODS)
router.get("/active", async (req, res) => {
  try {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// GET ALL STATUS : @ACTIVE USING CALLBACK FUNCTION (METHODS)
router.get("/active-cb", (req, res) => {
  const todo = new Todo();
  todo.findActiveCb((err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was server side error",
      });
    } else {
      res.status(500).json({
        data,
        message: "success",
      });
    }
  });
});

// GET TODO TITLE : @static
router.get("/title", async (req, res) => {
  try {
    const newTitle = await Todo.findByName("all");
    res.status(200).json({
      result: newTitle,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// GET TODO TITLE : @QUERY
router.get("/query", async (req, res) => {
  try {
    const newQuery = await Todo.find().byQuery("all");
    res.status(200).json({
      data: newQuery,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

// GET A TODO'S BY ID
router.get("/:id", async (req, res) => {
  await Todo.find({ _id: req.params.id }).exec((err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error",
      });
    } else {
      res.status(200).json({
        result: data,
        message: "Success",
      });
    }
  });
});

// POST A TODO
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });

  try {
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );
    res.status(200).json({
      message: "Todo was inserted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

// POST MULTIPLE TODO
router.post("/all", (req, res) => {
  Todo.insertMany(req.body, (error) => {
    if (error) {
      res.status(500).json({
        error: "There was a server side error",
      });
    } else {
      res.status(200).json({
        message: "Todo's were inserted successfully!",
      });
    }
  });
});

// PUT TODO
router.put("/:id", async (req, res) => {
  try {
    await Todo.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "active",
        },
      }
    );
    res.status(200).json({
      message: "Todo was updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

// DELETE TODO
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Todo was deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

module.exports = router;
