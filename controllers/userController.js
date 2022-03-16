const User = require("../models/User");

// Display a listing of the resource.
async function index(req, res) {}

// Display the specified resource.
async function show(req, res) {}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {}

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
  index,
  show,
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
