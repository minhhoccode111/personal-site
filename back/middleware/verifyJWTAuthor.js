const jwt = require("jsonwebtoken");

const verifyJWTAuthor = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // NOTE: start with "Token " instead of "Bearer "?
  if (!authHeader?.startsWith("Token ")) {
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ errors: [{ msg: "Forbidden" }] });
    }

    if (!decoded.user.isAuthor) {
      return res.status(403).json({ errors: [{ msg: "Forbidden" }] });
    }

    // NOTE: not retrieve database to increase perf
    req.userId = decoded.user.id;
    req.userEmail = decoded.user.email;
    req.isAuthor = decoded.user.isAuthor;
    req.userHashedPwd = decoded.user.password;
    next();
  });
};

module.exports = verifyJWTAuthor;
