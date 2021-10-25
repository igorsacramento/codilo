const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECT_MONGO_DB_KEY);
mongoose.Promise = global.Promise;

module.exports = mongoose;
