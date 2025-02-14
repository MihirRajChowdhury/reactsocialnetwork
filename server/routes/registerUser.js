const express = require("express");
const router = express.Router();
const db = require("../database");
const md5 = require("md5");

// Register new user, fail if user credentials already exist
router.post("/api/user/", (req, res, next) => {
  const errors = [];

  if (!req.body.email) {
    errors.push("No email specified");
  }

  if (!req.body.password) {
    errors.push("No password specified");
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  const data = {
    username: req.body.username,
    email: req.body.email,
    password: md5(req.body.password),
  };

  const sql = "INSERT INTO User (username, email, password) VALUES (?,?,?)";
  const params = [data.username, data.email, data.password];

  db.run(sql, params, function (err, result) {
    if (err) {
      const errorMessage = `A user with email ${data.email} already exists!`;
      res.status(400).json({ error: errorMessage });
      return;
    }

    res.json({
      message: `User ${data.email} successfully created!`,
      data: data,
      id: this.lastID,
    });
  });
});

module.exports = router;
