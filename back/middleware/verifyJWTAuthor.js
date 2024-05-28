const jwt = require("jsonwebtoken");

const verifyJWTAuthor = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // NOTE: remember start with "Token "
  if (!authHeader?.startsWith("Token ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!decoded.user.isAuthor) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.userId = decoded.user.id;
    req.userEmail = decoded.user.email;
    req.isAuthor = decoded.user.isAuthor;
    req.userHashedPwd = decoded.user.password;
    next();
  });
};

module.exports = verifyJWTAuthor;
