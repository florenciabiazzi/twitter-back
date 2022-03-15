require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const user = await User.findOne({ username: req.body.username });
  console.log(req.body);
  if (!user) {
    console.log("!user");
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }
  const checkPassword = await user.comparePassword(req.body.password);

  if (!checkPassword) {
    console.log("!check");
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const token = jwt.sign({ sub: user.id }, process.env.ACCESS_TOKEN);
  return res.json({ user, token });
}

module.exports = { login };
