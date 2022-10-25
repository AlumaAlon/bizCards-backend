const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 1024,
  },
  email: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 1024,
  },
  password: {
    type: String,
    require: true,
    minlength: 8,
    maxlength: 1024,
  },
  biz: {
    type: Boolean,
    require: true,
  },
});

const User = mongoose.model("users", UserSchema);
module.exports = { User };
