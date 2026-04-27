import mongoose from "mongoose";

delete mongoose.models.User;

const UserSchema = new mongoose.Schema({
  discordID: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  pcash: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
