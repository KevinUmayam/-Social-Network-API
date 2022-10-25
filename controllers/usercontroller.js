const { User, Thought } = require("../models");

const usersController = {
  // Create a new User
  createUsers({ body }, res) {
    User.create(body)
      .then((usersData) => res.json(usersData))
      .catch((err) => res.status(400).json(err));
  },
  // get all users
  getAllUsers(req, res) {
    User.find({})
      .then((usersData) => res.json(usersData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // get user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((usersData) =>
        !usersData
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json(usersData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((usersData) =>
        !usersData
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json(usersData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // delete user by id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((usersData) =>
        !usersData
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json("User has been deleted")
      )
      .catch((err) => res.status(400).json(err));
  },

  // add friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $addToSet: { friends: params.friendId } },
      { runValidators: true }
    )
      .then((usersData) =>
        !usersData
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json(usersData)
      )
      .catch((err) => res.status(500).json(err));
  },
  //delete friend
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendId } },
      { runValidators: true }
    )
      .then((usersData) =>
        !usersData
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json(usersData)
      )
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = usersController;
