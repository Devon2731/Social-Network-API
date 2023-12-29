const { User, Thought } = require('../models');

// Get all the users from mongodb
getUsers(req, res) {
    User
        .find({})
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
};

// get all the users from database
getSingleUsers(req, res) {
    User
        .findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts')
        .then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user))
        .catch((err) => res.status(500).json({message: 'Internal Server Error', error: err}));
};

// Create User
createUser(req, res) {
    User.create(req.body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(500).json(err));
};

// Add friends to a user whenever a friend is added
addFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body } },
        { runValidators: true, new: true },
        (err, result) => {
            if (result) {
                console.log(`Friend is added to: ${req.params.userId}`);
                res.json(result);
            } else {
                console.log(`It looks like there was an error.`);
                res.json(err);
            }
        }
    );
};

// Update User
updateUser(req, res) {
    User.findByIdAndUpdate(
        req.params.userId,
        { username: req.body.username },
        { new: true },
    )
    .then((result) => {
        if (!result) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        console.log(`User update completely for: ${req.params.userId}`);
        return res.status(200).json(result);
    })
    .catch((err) => res.status(500).json(err));
};


// Delete User and thoughts they posted
deleteUser(req, res) {
    const userId  = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: 'No user with that ID' });
    }
    if (req.params.userId) {
        User.findByIdAndDelete({ _id: req.params.userId })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with that ID' });
                }
                Thought.deleteMany({ _id: { $in: dbUserData.thoughts } })
                    .then(() => {
                        console.log(`User and thoughts are deleted from: ${req.params.userId}`);
                        res.json(dbUserData);
                    })
                    .catch((err) => res.status(500).json(err));
            })
    }
}

// Delete friends from friend list of a user
deleteFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.body } },
        { runValidators: true, new: true },
        (err, result) => {
            if (result) {
                console.log(`Friend is deleted from: ${req.params.userId}`);
                res.json(result);
            } else {
                console.log(`It looks like there was an error.`);
                res.json(err);
            }
        }
    );
}

module.exports = {
    getUsers,
    getSingleUsers,
    createUser,
    updateUser,
    deleteUser,
    deleteFriend
}
