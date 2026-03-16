const express = require('express');
const router = express.Router();
const Project = require("../models/Project.js");
const auth = require("../utils/auth.js");
const { uploadToS3 } = require("../utils/s3Client.js");

router.post("/", async (req, res) => {
  //const { name, date, description, thumbnail, links, groups, region, icon, position } = req.body;
  try {
    const thumbnailName = await uploadToS3(req.files?.thumbnail);
    const newProject = await Project.create({
      name: "a",
      date: new Date(),
      region: "e",
      icon: "i",
      position: [0, 0],
      reactions: {},
      thumbnail: `https://s3.us-east-1.amazonaws.com/${process.env.S3_BUCKET}/${thumbnailName}`,
    });
    /*const newProject = await Project.create({
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
    });*/
    res.status(201).json({Project: newProject});
  } catch (err) {
    console.log(err);
    res.status(500).json({error: `Error adding project`});
  }
});

module.exports = router;