const router = require('express').Router();

// importing get thoughts and create thought function from controller library
const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,
  } = require('../../controllers/thoughtsController');

  router.route('/').get(getThoughts).post(createThought);

  //api/thoughts/:thoughtId
  router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

  //api/thoughts/:thoughtId/reactions
  router.route('/:thoughtId/reactions').post(addReaction);

  //api/thoughts/:thoughtId/reactions/:reactionId
  router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

  module.exports = router;