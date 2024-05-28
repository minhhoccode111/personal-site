const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  // extract authorization header from req
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // immediate return 401 if not start with "Token"? why not "Bearer"
  if (!authHeader?.startsWith("Token ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // extract the token out of header
  const token = authHeader.split(" ")[1];

  // verify the header token, to get the decoded (payload)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // if any error occur while verify token, send a 403 back
      return res.status(403).json({ message: "Forbidden" });
    }

    // NOTE: this api so fast and performant compare to be
    // because it don't have to retrieve db to verify token every time
    // and it's so secure with 2 level depth payload
    // and even store user.id (32 long str) and hashed password (32 long str)
    // then mark values on request object
    req.userId = decoded.user.id;
    req.userEmail = decoded.user.email;
    req.userHashedPwd = decoded.user.password;
    next();
  });
};

module.exports = verifyJWT;
