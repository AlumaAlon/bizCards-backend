const express = require("express");
const bcrypt = require("bcrypt");
const joi = require("joi");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const router = express();

const registerSchema = joi.object({
  name: joi.string().required().min(2).max(1024),
  email: joi.string().required().email().min(5).max(1024),
  password: joi.string().required().min(8).max(1024),
  biz: joi.boolean().required(),
});

router.post("/", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne(req.body);
    if (user) return res.status(400).send("User already exist in DataBase");
    user = new User(req.body);
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    let token = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.secretKey
    );
    res.status(201).send({ token: token });
  } catch (err) {
    res.status(400).send("Error in Post new User in Register");
  }
});

module.exports = router;
