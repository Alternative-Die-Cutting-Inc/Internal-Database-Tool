// const mongoose = require("mongoose");

// // tells mongoose to use ES6 implementation of promises
// mongoose.Promise = global.Promise;
// require("dotenv").config();

// const mongoURI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@localhost:27017/testingDatabase?authSource=admin`;

// console.log(mongoURI);
// mongoose.connect(mongoURI);
// mongoose.connection
//   .once("open", () => console.log("Connected!"))
//   .on("error", (error) => {
//     console.warn("Error : ", error);
//   });

// // runs before each test
// beforeEach(async (done) => {
//   // drop the collection
//   mongoose.connection.dropDatabase(() => {
//     done();
//   });
// });

const mongoose = require("mongoose");
const mongoURI = `mongodb://admin:root@localhost:27017/testingDatabase?authSource=admin`;

mongoose.connect(mongoURI);

mongoose.connection
  .once("open", () =>
    mongoose.connection.dropDatabase().then(() => {
      done();
    })
  )
  .on("error", (error) => {
    console.warn("Error : ", error);
  });

// Drop the database before each test
// beforeEach((done) => {
//   mongoose.connection.dropDatabase().then(() => {
//     done();
//   });
// });
