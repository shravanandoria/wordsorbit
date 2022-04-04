const mongoose = require("mongoose");
const url = process.env.MONGO_URI;
// "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
// "mongodb+srv://wordsorbit:wordsorbit@wordsorbit.lsglg.mongodb.net/wordsorbit?retryWrites=true&w=majority";
const connecToMongo = () =>
  mongoose
    .connect(url)
    .then(() => {
      console.log("Db is Connected");
    })
    .catch((err) => {
      console.log({ Error: err });
    });

module.exports = connecToMongo;

// mongodb://localhost:27017/WordsOrbit?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
