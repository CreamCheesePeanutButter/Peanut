import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGO_URI");

  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
}

class DB {
  static connect = connectDB;
  static userdb = mongoose.model("User", new mongoose.Schema({
    discordId: { type: String, unique: true },
    username: String,
    pcash: { type: Number, default: 0 },
    // isAdmin: { type: Boolean, default: false },
  }));
  
}