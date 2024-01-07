const { User, Thought } = require('../models');

const thoughtsController = {
  // GET all thoughts
  getThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find({});
      res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error', error: err });
    }
  },

  // GET a single thought by ID
  getSingleThought: async (req, res) => {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');
      if (!thought) {
        res.status(404).json({ message: 'No thought with that ID' });
      } else {
        res.json(thought);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error', error: err });
    }
  },

  // Create thought
  createThought: async (req, res) => {
    try {
      const dbThoughtData = await Thought.create(req.body);

      // Update the associated user's thoughts array
      const result = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );

      if (result) {
        console.log(`Thought is updated in: ${req.body.userId}`);
      } else {
        console.error(`It looks like there was an error.`);
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error', error: err });
    }
  },

  // Update thought
  updateThought: async (req, res) => {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      const result = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: { thoughtText: req.body.thoughtText } },
        { new: true }
      );

      if (result) {
        console.log(`Thought is updated in: ${req.params.thoughtId}`);
        res.json(result);
      } else {
        console.error(`It looks like there was an error.`);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error', error: err });
    }
  },

  // Delete a thought by thoughtId
  deleteThought: async (req, res) => {
    try {
      const dbThoughtData = await Thought.findByIdAndDelete({ _id: req.params.thoughtId });
      res.json(dbThoughtData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error', error: err });
    }
  },

  // Add a reaction to a thought
  addReaction: async (req, res) => {
    try {
      const result = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (result) {
        console.log(`Reaction is added to: ${req.params.thoughtId}`);
        res.json(result);
      } else {
        console.error(`It looks like there was an error.`);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error', error: err });
    }
  },

  // Delete a reaction
  deleteReaction: async (req, res) => {
    try {
      const result = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (result) {
        console.log(`Reaction is deleted from: ${req.params.thoughtId}`);
        res.json(result);
      } else {
        console.error(`It looks like there was an error.`);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error', error: err });
    }
  },
};

module.exports = thoughtsController;
