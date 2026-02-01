const express = require('express');
const router = express.Router();
const Update = require("../models/Update.js");

router.post("/", async (req, res) => {
  const {text, date} = req.body;
  try {
    const newUpdate = await Update.create({
      text,
      date,
    });
    res.status(201).json({update: newUpdate});
  } catch (err) {
    res.status(500).json({error: "Error adding update"});
  }
});

module.exports = router;