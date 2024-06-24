require("dotenv").config();

const mongoose = require("mongoose");

const debug = require("../constants/debug");

// if uri string is provided in cli
const last = process.argv[process.argv.length - 1];
const isURI = last.startsWith("mongodb");
const CLI_DATABASE_URI = isURI ? last : undefined;

const ENV_DATABASE_URI = process.env.DATABASE_URI;
const URI = CLI_DATABASE_URI || ENV_DATABASE_URI;

async function connectDB(callback) {
  try {
    mongoose.set("strictQuery", false);

    debug(`about to connet db\nstring: `, URI);

    mongoose.connect(URI);

    // executing scripts, need close connection after
    if (callback !== undefined) {
      debug(`about to execute callback`);

      await callback();

      debug(`callback executed`);

      debug(`about to disconnect db`);

      await mongoose.connection.close();
    }
  } catch (err) {
    debug(`Connect to database error: `, err);
  }
}

module.exports = connectDB;
