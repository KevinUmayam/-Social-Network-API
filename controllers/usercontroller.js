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
  getUserById(req, res) {
    User.findOne({ _id: req.params.userId })
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
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    )
      .then((usersData) =>
        !usersData
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json(usersData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // delete user by id
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((usersData) =>
        !usersData
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json("User has been deleted")
      )
      .catch((err) => res.status(400).json(err));
  },

  // add friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
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
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
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
