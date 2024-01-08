const { User, Thought } = require('../models');

// Get all thoughts
async function getThoughts(req, res) {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    console.error('Error fetching thoughts:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
}
// Get single thought
async function getSingleThought(req, res) {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');
    if (!thought) {
      res.status(404).json({ message: 'No thought with that ID' });
    } else {
      res.json(thought);
    }
  } catch (err) {
    console.error('Error fetching single thought:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
}
// Create new thought
async function createThought(req, res) {
  try {
    const dbThoughtData = await Thought.create(req.body);

    const result = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { thoughts: dbThoughtData._id } },
      { new: true }
    );

    if (result) {
      console.log(`Thought is updated in: ${req.body.userId}`);
    } else {
      console.error('Uh Oh, something went wrong');
    }

    res.json(dbThoughtData);
  } catch (err) {
    console.error('Error creating thought:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
}
// Update thought
async function updateThought(req, res) {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId });

    if (!thought) {
      res.status(404).json({ message: 'No thought with that ID' });
    } else {
      const result = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: { thoughtText: req.body.thoughtText } },
        { new: true }
      );

      if (result) {
        console.log(`Thought is updated in: ${req.params.thoughtId}`);
        res.json(result);
      } else {
        console.error('Uh Oh, something went wrong');
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  } catch (err) {
    console.error('Error updating thought:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
}
// Delete thought
async function deleteThought(req, res) {
  try {
    const dbThoughtData = await Thought.findByIdAndDelete(req.params.thoughtId);
    res.json(dbThoughtData);
  } catch (err) {
    console.error('Error deleting thought:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
}
// Add reaction
async function addReaction(req, res) {
  try {
    const result = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true }
    );

    if (result) {
      console.log(`Reaction is added to: ${req.params.thoughtId}`);
      res.json(result);
    } else {
      console.error('Uh Oh, something went wrong');
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (err) {
    console.error('Error adding reaction:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
}
// Delete reaction
async function deleteReaction(req, res) {
  try {
    const result = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );

    if (result) {
      console.log(`Reaction is deleted from: ${req.params.thoughtId}`);
      res.json(result);
    } else {
      console.error('Uh Oh, something went wrong');
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (err) {
    console.error('Error deleting reaction:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
}

  module.exports = {getThoughts, getSingleThought, createThought,updateThought,deleteThought, addReaction, deleteReaction}