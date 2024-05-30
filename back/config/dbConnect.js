require("dotenv").config();

const mongoose = require("mongoose");

// if uri string is provided in cli
const last = process.argv[process.argv.length - 1];
const isURI = last.startsWith("mongodb");
const CLI_DATABASE_URI = isURI ? last : undefined;

const ENV_DATABASE_URI = process.env.DATABASE_URI;
const URI = CLI_DATABASE_URI || ENV_DATABASE_URI;

async function connectDB(callback) {
  try {
    mongoose.set("strictQuery", false);

    console.log(`about to connet db\nstring: `, URI);

    mongoose.connect(URI);

    // executing scripts, need close connection after
    if (callback !== undefined) {
      console.log(`about to execute callback`);

      await callback();

      console.log(`callback executed`);

      console.log(`about to disconnect db`);

      await mongoose.connection.close();
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;
