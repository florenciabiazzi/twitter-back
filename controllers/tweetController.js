const Tweet = require("../models/Tweet");

async function create(req, res) {
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
// ...

module.exports = {
  create,
  destroy,
};
