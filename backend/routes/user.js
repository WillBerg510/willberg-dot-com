const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get("/", async (req, res) => {
  try {
    const userId = crypto.randomUUID();
    const accessToken = jwt.sign({user: userId}, process.env.USER_ACCESS_TOKEN_SECRET, {expiresIn: "2h"});
    const refreshToken = jwt.sign({user: userId}, process.env.USER_REFRESH_TOKEN_SECRET, {expiresIn: "50d"});
    res.cookie('user_refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 50 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({token: accessToken});
  } catch (err) {
    res.status(500).json({error: "User retrieval unsuccessful"});
  }
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies?.user_refresh_token;
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET);
      const accessToken = jwt.sign({user: decoded.user}, process.env.USER_ACCESS_TOKEN_SECRET, {expiresIn: "2h"});
      const newRefreshToken = jwt.sign({user: decoded.user}, process.env.USER_REFRESH_TOKEN_SECRET, {expiresIn: "50d"});
      res.cookie('user_refresh_token', newRefreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 50 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({token: accessToken});
    } catch (err) {
      res.status(200).json({token: "n/a"});
    }
  } else {
    res.status(200).json({token: "n/a"});
  }
});

module.exports = router;