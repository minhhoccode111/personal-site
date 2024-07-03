const allowedOrigins = require("./allowedOrigins");
const httpStatus = require("../constants/httpStatus");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: httpStatus.OKAY,
  // allow methods
};

module.exports = corsOptions;
