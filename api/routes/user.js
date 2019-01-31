const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User
    .find({ email: req.body.email })
    .then(user => user.length
      ? res.status(409).json({ message: "Email already exists" })
      : bcrypt.hash(req.body.password, 10, (err, hash) => err
        ? res.status(500).json({ err })
        : new User({
          _id: mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        }).save()
          .then(user => res.status(201).json({ message: "User was created" }))
          .catch(error => res.status(500).json(error))
      )
    );
});

router.delete("/:user", (req, res, next) => {
  User
    .deleteOne({ _id: req.params.user })
    .then(user => res.status(200).json({ message: "User was deleted" }))
    .catch(error => res.status(500).json({ error }));
});

module.exports = router; 