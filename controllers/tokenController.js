require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    console.log("!user");
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }
  console.log(user);
  const checkPassword = await user.comparePassword(req.body.password);
  console.log(req.body.password);

  if (!checkPassword) {
    console.log("!check");
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN);
  return res.json({ user: { id: user.id, username: user.username, accessToken } });
}

module.exports = { login };
