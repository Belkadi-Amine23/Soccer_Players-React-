import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// models/User.js
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: String,
    refreshTokenExpiry: Date,
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    lastActivity: Date,
    activeSessions: [String]
  });

// Hash du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model("User", userSchema);