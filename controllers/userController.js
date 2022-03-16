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
      res.status(401).json("This email is already in use.");
      console.log("This email is already in use.");
    } else if (newUserUsername) {
      res.status(401).json("This username is already in use.");
      console.log("This username is already in use.");
    } else {
      const savedUser = await newUser.save();
      console.log(`${savedUser} is saved!`);
      res.json(savedUser);
    }
  } catch (err) {
    res.status(404); //revisar y cambiar status
  }
}

// Display the specified resource.
async function getUser(req, res) {
  const user = await User.findOne({ username: req.params.username });
  if (!user) res.status(404).json("No existe el usuario");
  else {
    res.json(user);
  }
}

// Show the form for creating a new resource
async function create(req, res) {}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {}

// Remove the specified resource from storage.
async function destroy(req, res) {}

// Otros handlers...............................

async function showFollowing(req, res) {
  const followeds = [];
  const aux = [];
  const data = await User.findById(req.params.id);
  data.following.map((userId) => followeds.push(userId));
  const users = await User.find();
  for (let i of followeds) {
    for (let user of users) {
      if (user.id == i) {
        //se murio un gato aca!!!
        aux.push(user);
      }
    }
  }
  return res.json({ aux, followeds });
}

async function follow(req, res) {
  const myId = req.params.id;
  const idToFollow = req.body.id;
  if (myId === idToFollow) {
    return res.send("eres tu");
  }
  const myUser = await User.findById(myId);
  const dataToFollow = await User.findById(idToFollow);
  if (idToFollow in myUser.following) {
    return res.send("ya lo sigues");
  } else if (myId in dataToFollow.followers) {
    return res.send("ya lo sigues, hay una incongruencia!");
  } else {
    myUser.following.push(idToFollow);
    dataToFollow.followers.push(myId);
  }

  return res.json({ myUser, dataToFollow });
}

async function unfollow(req, res) {
  const myId = req.params.id;
  const idToFollow = req.body.id;
  if (myId === idToFollow) {
    return res.send("eres tu");
  }
  const myUser = await User.findById(myId);
  const dataToFollow = await User.findById(idToFollow);
  /*if (idToFollow in myUser.following) {
    myUser.following = myUser.following.filter((d) => d !== idToFollow);
  }
  if (myId in dataToFollow.followers) {
    dataToFollow.following = dataToFollow.followers.filter((d) => d !== myId);
  }
 */
  User.findByIdAndUpdate(
    myId,
    {
      following: myUser.following.filter((d) => {
        d !== idToFollow;
      }),
    },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", docs);
      }
    },
  );
  User.findByIdAndUpdate(
    idToFollow,
    {
      following: dataToFollow.followers.filter((d) => {
        d != myId;
      }),
    },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", docs);
      }
    },
  );

  return res.json({ myUser, dataToFollow });
}

async function showFollowers(req, res) {
  const myFollowers = [];
  const aux = [];
  const data = await User.findById(req.params.id);
  data.following.map((userId) => myFollowers.push(userId));
  const users = await User.find();
  for (let i of myFollowers) {
    for (let user of users) {
      if (user.id == i) {
        //huele a gato muerto!!!
        aux.push(user);
      }
    }
  }
  return res.json({ aux, myFollowers });
}
module.exports = {
  getUser,
  create,
  store,
  edit,
  update,
  destroy,
  showFollowing,
  follow,
  unfollow,
  showFollowers,
};
