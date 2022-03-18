const Tweet = require("../models/Tweet");
const User = require("../models/User");
const { use } = require("../routes/apiRoutes");

async function store(req, res) {
  const tweet = String(req.body.content);
  const newTweet = await new Tweet({
    author: req.user.id,
    content: tweet,
    likes: [],
  });
  await newTweet.save();
  await User.findByIdAndUpdate(req.user.id, { $push: { tweets: newTweet.id } });
  res.status(200).send("Tweet creado con éxito");
}

async function destroy(req, res) {
  const user = User.findById(req.user.id);
  if (user.tweets.includes(req.params.id)) {
    await Tweet.findByIdAndDelete(req.params.id);
    res.status(200).json("Tweet borrado con éxito");
  } else {
    res.status(401).json("Este tweet no es tuyo");
  }
}

async function like(req, res) {
  const user = req.user.id;
  const id = req.params.id;
  const tweet = await Tweet.findById(id);
  if (!tweet.likes.includes(user)) {
    await Tweet.findByIdAndUpdate(id, { $push: { likes: user } });
    res.status(200).json("Like exitoso.");
  } else {
    res.status(401).json("No puede dar like porque lo hiciste antes.");
  }
}

async function dislike(req, res) {
  const user = req.user.id;
  const id = req.params.id;
  const tweet = await Tweet.findById(id);
  if (tweet.likes.includes(user)) {
    await Tweet.findByIdAndUpdate(id, { $pull: { likes: user } });
    res.status(200).json("Dislike exitoso.");
  } else {
    res.status(401).json("Nunca dio like");
  }
}
// Otros handlers...
async function show(req, res) {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json("No existe el usuario");
  const tweets = await Tweet.find({ author: user.id }).populate("author");
  res.status(200).json({ tweets });
}
// ...
async function getTweetsOfFollowing(req, res) {
  const user = await User.findById(req.params.id);
  const tweets = await Tweet.find({ author: { $in: user.following } }).populate("author");
  console.log(user);
  res.json({ tweets });
}
module.exports = {
  store,
  destroy,
  show,
  like,
  dislike,
  getTweetsOfFollowing,
};
