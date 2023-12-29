const BSON = require('bson');

const { User, Thought } = require('../models');

const thoughtsController = {
    // GET all thoughts
    getThoughts(req, res) {
      Thought
        .find({})
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
  
    // GET a single thought by ID
    getSingleThought(req, res) {
      Thought
        .findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) => !thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
  
    // Create thought
    createThought(req, res) {
      Thought.create(req.body)
        .then((dbThoughtData) => {
          // Update the associated user's thoughts array
          User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: dbThoughtData._id } },
            { new: true },
            (err, result) => {
              if (result) {
                console.log(`Thought is updated in: ${req.body.userId}`);
              } else {
                console.log(`It looks like there was an error.`);
              }
            }
          );
          res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },
  
    // Delete a thought by thoughtId
    deleteThought(req, res) {
      Thought.findByIdAndDelete({ _id: req.params.thoughtId })
        .then((dbThoughtData) => res.json(dbThoughtData)) // Corrected res.jon to res.json
        .catch((err) => res.status(500).json(err));
    },
  
    // Add a reaction to a thought
    addReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true },
        (err, result) => {
          if (result) {
            console.log(`Reaction is added to: ${req.params.thoughtId}`);
            res.json(result);
          } else {
            console.log(`It looks like there was an error.`);
            res.json(err);
          }
        }
      );
    },
  
    // Delete a reaction
    deleteReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true },
        (err, result) => {
          if (result) {
            console.log(`Reaction is deleted from: ${req.params.thoughtId}`);
            res.json(result);
          } else {
            console.log(`It looks like there was an error.`);
            res.json(err);
          }
        }
      );
    },
  };
  
  module.exports = thoughtsController;
