const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new Schema({
  firstname: { type: String, maxLength: 50, required: true },
  lastname: { type: String, maxLength: 50, required: true },
  username: { type: String, required: true, maxLength: 25, unique: true },
  password: { type: String, minLength: 4, maxLength: 70, required: true },
  email: { type: String, unique: true, required: true },
  description: String,
  profileImage: String,
  tweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, Number(process.env.HASH_ROUNDS));
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

//Solo hashea la password si fué modificada🔰
// if (!user.isModified("password")) return next();

module.exports = User;
