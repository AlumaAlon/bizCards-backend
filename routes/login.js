const express = require("express");
const bcrypt = require("bcrypt");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const router = express();

const loginSchema = joi.object({
  email: joi.string().required().email().min(5).max(1024),
  password: joi.string().required().min(8).max(1024),
});

router.post("/", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid Email or Password");

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send("Invalid Email or Password");

    const token = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.secretKey
    );
    res.status(200).send({ token: token });
  } catch (err) {
    res.status(400).send("Error in Post User In Login");
  }
});

module.exports = router;
