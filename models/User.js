const { Schema, Types } = require("mongoose");

import { isEmail } from "validator";

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

const User = model("user", userSchema);

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

module.exports = User;
