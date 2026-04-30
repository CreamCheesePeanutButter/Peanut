import mongoose from "mongoose";

delete mongoose.models.User;

const UserSchema = new mongoose.Schema({
  discordId: {
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
  lastDaily: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
