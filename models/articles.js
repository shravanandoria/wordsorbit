const mongoose = require("mongoose");
const { Schema } = mongoose;

const ArticleSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  authorName: String,
  image: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  category: String,
});

module.exports.Article = mongoose.model("Article", ArticleSchema);
