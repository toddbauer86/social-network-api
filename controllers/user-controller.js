const { User, Thought } = require("../models");

const userController = {
  getAllUsers(req, res) {
    User.find()
      .then((userData) => {
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  addUser(req, res) {
    User.create(req.body)
      .then((userData) => {
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  getUserById(req, res) {
    User.findOne({ _id: req.params.id })
      .populate("friends")
      .populate("thoughts")
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "user does not exist" });
        }
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "user does not exist" });
        }
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "user does not exist" });
        }
        if (userData.thoughts.length > 0) {
          Thought.deleteMany({ _id: { $in: userData.thoughts } });
        }
      })
      .then(() => {
        res.json({ message: "user deleted" });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "does not exist" });
        }
        res.status(200).json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "does not exist" });
        }
        res.status(200).json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};

module.exports = userController;
