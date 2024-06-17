// small controller for google authentication

// @desc
// @route
// @access
// @required
// @return
const failureRedirect = (req, res, next) => {
  console.log(req);
  return res.status(401).json({ errors: { body: "Unauthorized" } });
};

// @desc
// @warning
// @route
// @access
// @return
const successRedirect = (req, res, next) => {
  console.log(req);
  return res.status(200).json({ messages: { body: "Authorized" } });
};

module.exports = {
  failureRedirect,
  successRedirect,
};
