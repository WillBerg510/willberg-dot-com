const express = require('express');
const router = express.Router();
const Project = require("../models/Project.js");
const auth = require("../utils/auth.js");
const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {
  const {name, date, description, thumbnail, links, groups, region, icon, position} = req.body;
  try {
    const newProject = await Project.create({
      name,
      date,
      description,
      thumbnail,
      links,
      groups,
      region,
      icon,
      position,
      reactions: {},
      awards: {},
    });
    res.status(201).json({Project: newProject});
  } catch (err) {
    res.status(500).json({error: `Error adding project: ${err}`});
  }
});

module.exports = router;