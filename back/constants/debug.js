const dotenv = require("dotenv");
dotenv.config();

const debug = require("debug")(
  "##################################################", // 50
);

module.exports = debug;
