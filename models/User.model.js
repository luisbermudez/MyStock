const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    nameCompany: {
      type: String,
      required: [
        true,
        "$Name or Company Name is required. No worries, if you don't like it you can change it later.",
      ],
    },
    email: {
      type: String,
      required: [true, "$Email is required"],
      match: [/^\S+@\S+\.\S+$/, "$Please use a valid email addres"],
      unique: [
        true,
        "$This email has already been registered. Please, try a different one.",
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "$Password field is required"],
      match: [
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
        "$Password must be at least 6 characters long and contain at least one number, and uppercase letter.",
      ],
    },
    profilePicture: {
      type: String,
      default: "images/pp.png",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
