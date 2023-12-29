const mongoose = require('mongoose');

// Reaction Schema (as subdocument)

const reactionSchema = new mongoose.Schema({
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => createdAt.toLocaleString(), // Example: Format timestamp using toLocaleString
    },
  });

  const ThoughtSchema = new mongoose.Schema({
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => createdAt.toLocaleString(), // Example: Format timestamp using toLocaleString
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  });

  // Create a virtual to retrieve the length of the thought's reactions array field on query

  ThoughtSchema.virtual('reactionCount').get(function () {
      return this.reactions.length;
  });

  const Thought = mongoose.model('Thought', ThoughtSchema);

  module.exports = Thought;