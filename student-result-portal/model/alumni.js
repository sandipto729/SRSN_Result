const mongoose = require("mongoose");

const AlumniSchema = new mongoose.Schema({
  // Reference to original user (optional but useful)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  profilePic: { type: String },

  fatherName: { type: String },
  motherName: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Alumni || mongoose.model("Alumni", AlumniSchema);
