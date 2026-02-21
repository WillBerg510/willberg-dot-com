const jwt = require("jsonwebtoken");

// Verify that the API call is from a user with a valid admin access token
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || token == "null") {
    return res.status(401).json({error: 'Missing auth token.'});
  }
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch {
    return res.status(401).json({error: 'Invalid auth token.'});
  }
}

module.exports = auth;