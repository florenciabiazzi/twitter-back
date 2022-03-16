const Tweet = require("../models/Tweet");
const User = require("../models/User");

async function create(req, res) {
  console.log("req.user", req.user);

  const tweet = String(req.body.content);
  const newTweet = await new Tweet({
    author: "6230ea8b4351d2d7ae728154",
    content: tweet,
    likes: [],
  });
  await newTweet.save();
  res.status(200).send("Tweet creado con éxito");
}

async function destroy(req, res) {
  await Tweet.findByIdAndDelete(req.params.id);
  res.status(200).send("Tweet borrado con éxito");
}

// Otros handlers...
async function show(req, res) {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json("No existe el usuario");
  const tweets = await Tweet.find({ author: user.id });
  res.status(200).json({ tweets });
}
// ...

module.exports = {
  create,
  destroy,
  show,
};
