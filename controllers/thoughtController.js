const { Thought, User } = require("../models");
const thoughtController = {
  // Create or add a tought
  createTought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
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
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .select("-__v")
      .then((thoughtData) =>
        !thoughtData
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thoughtData)
      )
      .catch((err) => res.status(400).json(err));
  },
  // update thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtid }, body, {
      new: true,
      runValidators: true,
    })
      .then((thoughtData) =>
        !thoughtData
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thoughtData)
      )
      .catch((err) => res.status(400).json(err));
  },
  // delete thought by id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((thoughtData) =>
        !thoughtData
          ? res.status(404).json({ message: "No thought found with this ID" })
          : User.findOneAndUpdate(
              { _id: params.userId },
              { $pull: { thoughts: params.thoughtId } },
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
  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
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
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.status(500).json(err));
  },
};
module.exports = thoughtController;
