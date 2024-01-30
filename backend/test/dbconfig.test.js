const mongoose = require('mongoose');
const mongoURI = `mongodb://admin:root@localhost:27017/testingDatabase?authSource=admin`;

(async function () {
  await mongoose.connect(mongoURI);
  await mongoose.connection.dropDatabase();
  run();
})();
