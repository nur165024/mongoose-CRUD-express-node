const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo").find({ status: "active" });
  },
  findActiveCb: function (cb) {
    return mongoose.model("Todo").find({ status: "active" }, cb);
  },
};

todoSchema.statics = {
  findByName: function (title) {
    return this.find({ title: new RegExp(title, "i") });
  },
};

todoSchema.query = {
  byQuery: function (title) {
    return this.find({ title: new RegExp(title, "i") });
  },
};

module.exports = todoSchema;
