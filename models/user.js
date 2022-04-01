const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = Schema({
  fname: String,
  lname: String,
  username: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Password Is Required"],
  },
  image: String,
  bio: String,
  followers: [String],
  following: [String],
});

module.exports.User = mongoose.model("User", UserSchema);
