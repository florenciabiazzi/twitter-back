require("dotenv").config();
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const token = jwt.sign({ sub: "123" }, process.env.ACCESS_TOKEN);
  res.json({ token });
}

module.exports = { login };
