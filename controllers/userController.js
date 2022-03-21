const User = require("../models/User");

// Save a new user
async function store(req, res) {
  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    profileImage: "../img/unknown.jpg",
  });
  try {
    const newUserMail = await User.findOne({ email: newUser.email });
    const newUserUsername = await User.findOne({ username: newUser.username });

    if (newUserMail) {
      res.json("This email is already in use.");
    } else if (newUserUsername) {
      res.json("This username is already in use.");
    } else {
      const savedUser = await newUser.save();
      res.json(savedUser);
    }
  } catch (err) {
    res.status(404); //revisar y cambiar status
  }
}

async function getUser(req, res) {
  const user = await User.findOne({ username: req.params.username }).populate("tweets");
  if (!user) res.status(204).json("No existe el usuario");
  else {
    res.json(user);
  }
}

async function getUsers(req, res) {
  const users = await User.find();
  if (users) {
    return res.json(users);
  } else {
    return res.status(404).json("Users not found");
  }
}

async function showFollowing(req, res) {
  const myUser = await User.findById(req.params.id);
  if (!myUser) return res.status(401).json("Lo sentimos, el usuario no existe");
  const allUsers = await User.find();
  const followed = [];
  allUsers.filter((d) => {
    if (myUser.following.includes(d.id)) {
      return followed.push(d);
    }
  });
  return res.json(followed);
}

async function follow(req, res) {
  const myUser = await User.findById(req.user.id);
  if (!myUser) return res.status(401).json("Lo sentimos, el usuario no existe");
  const userToFollow = await User.findById(req.params.id);
  if (!userToFollow) return res.status(401).json("Lo sentimos, el usuario no existe");

  if (myUser.following.includes(req.params.id)) {
    return res.json("ya lo sigues");
  } else if (userToFollow.followers.includes(req.user.id)) {
    return res.json("ya lo sigues, hay una incongruencia!");
  } else {
    await User.findByIdAndUpdate(req.user.id, { $push: { following: req.params.id } });
    await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user.id } });
    return res.json(userToFollow);
  }
}

async function unfollow(req, res) {
  const myUser = await User.findById(req.user.id);
  if (!myUser) return res.status(401).json("Lo sentimos, el usuario no existe");
  const userToFollow = await User.findById(req.params.id);
  if (!userToFollow) return res.status(401).json("Lo sentimos, el usuario no existe");

  if (myUser.following.includes(req.params.id)) {
    await User.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.id } });
    await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user.id } });

    return res.json(userToFollow);
  } else {
    return res.json("no lo sigues");
  }
}

async function showFollowers(req, res) {
  const myUser = await User.findById(req.params.id);
  if (!myUser) return res.status(401).json("Lo sentimos, el usuario no existe");
  const allUsers = await User.find();
  const followers = [];
  allUsers.filter((d) => {
    if (myUser.followers.includes(d.id)) {
      return followers.push(d);
    }
  });
  return res.json(followers);
}
module.exports = {
  getUser,
  store,
  showFollowing,
  follow,
  unfollow,
  showFollowers,
  getUsers,
};
