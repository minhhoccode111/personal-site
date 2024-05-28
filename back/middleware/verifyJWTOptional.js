const jwt = require("jsonwebtoken");

const verifyJWTOptional = (req, res, next) => {
  // extract authorization header from req
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (
    // if not have header
    !authHeader ||
    // or not start with "Token"
    !authHeader?.startsWith("Token ") ||
    // or an empty string
    !authHeader.split(" ")[1].length
  ) {
    // mark not logged in on request object
    req.loggedin = false;
    return next();
  }

  const token = authHeader.split(" ")[1];

  // else verify the valid token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // mark logged in on request object
    req.loggedin = true;
    // do the same as verify
    req.userId = decoded.user.id;
    req.userEmail = decoded.user.email;
    req.userHashedPwd = decoded.user.password;
    next();
  });
};

module.exports = verifyJWTOptional;
