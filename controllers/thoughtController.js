const { Thought, User } = require("../models");
const thoughtController = {
  // Create or add a tought
  createTought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thoughtData) =>
        !thoughtData
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json(thoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.status(400).json(err));
  },
  // get thought by id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thoughtData) =>
        !thoughtData
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thoughtData)
      )
      .catch((err) => res.status(400).json(err));
  },
  // update thought by id
  updateThought(req, res) {
    console.log(req.params.thoughtid);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    )
      .then((thoughtData) =>
        !thoughtData
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thoughtData)
      )
      .catch((err) => res.status(400).json(err));
  },
  // delete thought by id
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thoughtData) =>
        !thoughtData
          ? res.status(404).json({ message: "No thought found with this ID" })
          : User.findOneAndUpdate(
              { _id: req.params.userId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((userData) =>
        !userData
          ? res
              .status(404)
              .json({ message: "Thought deleted, but no user found" })
          : res.json({ message: "Thought deleted" })
      )
      .catch((err) => res.status(500).json(err));
  },
  // create reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((thoughtData) =>
        !thoughtData
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // delete reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.status(500).json(err));
  },
};
module.exports = thoughtController;
