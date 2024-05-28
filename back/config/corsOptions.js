// import a list of allowed origins
const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    // if origin is existed in allowOrigins or origin falsy?
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // call with error null and true
      callback(null, true);
    } else {
      // else call with and 1st arg error
      callback(new Error("Not allowed by CORS"));
    }
  },
  // enable the sending of credentials (such as cookies, authorization headers, and TLS client certificates)
  // along with cross-origin requests from the browser to your server
  credentials: true,
  // default
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
