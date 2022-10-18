const { Schema, Types, model } = require("mongoose");

import { isEmail } from "validator";

// Schema to create user model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [isEmail, "invalid email"],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// get total count of friends
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// create the User model using the UserSchema
const User = model("user", userSchema);

module.exports = User;
