const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({error: 'Missing auth token.'});
  }
  if (token != process.env.TOKEN) {
    return res.status(401).json({error: 'Invalid auth token.'});
  }
  next();
}

module.exports = auth;