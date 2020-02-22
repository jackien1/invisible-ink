const mongoose = require("mongoose");

const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  administrator: {
    type: Boolean,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    require: true
  },
  code: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const UserModel = mongoose.model("User", User);
module.exports = UserModel;
