// module.exports = mongoose.model("User", UserSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

module.exports = mongoose.model("Users", userSchema);