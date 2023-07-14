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
