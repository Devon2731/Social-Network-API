const router = require('express').Router();

// importing get users and create user function from controller library
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
} = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);

//api/users/:userId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

//api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

//api/users/userId
router.route('/:userId').put(updateUser);

module.exports = router;