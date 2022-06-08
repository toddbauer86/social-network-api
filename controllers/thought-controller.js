const { Thought, User } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .then((userData) => {
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.id })
      .populate({ path: "user", select: "-__v" })
      .select("-__v")
      .then((userData) => {
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { username: body.username },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(userData);
      })
      .catch((err) => res.json(err));
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "this thought does not exist!" });
        }
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "this thought does not exist" });
        }
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "this thought does not exist" });
        }
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  deleteReaction({ params }, res) {
    Thought.findOneAndDelete(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "this thought does not exist" });
        }
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};

module.exports = thoughtController;
