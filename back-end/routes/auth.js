const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../db/user');
const router = express.Router();
const jwtKey = "e-com";

router.post("/login", async (req, res) => {
  let user = await User.findOne(req.body).select("-password");
  if (req.body.password && req.body.email) {
    if (user) {
      jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({ result: "user not found" });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.status(404).send({ result: "No user found" });
    }
  } else {
    res.status(404).send({ result: "No user found" });
  }
});

router.post("/register", upload.single('image'), async (req, res) => {
  let user = new User({
    ...req.body,
    image: req.file ? req.file.filename : "" 
  });
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send({ result: "user not found" });
    }
    res.send({ result, auth: token });
  });
});

module.exports = router;
