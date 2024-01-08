const { User, Thought } = require('../models');

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err });
  }
}

async function getSingleUser(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('thoughts')
      .populate('friends');

    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      res.json(user);
    }
  } catch (err) {
    console.error('Error fetching single user:', err);
    res.status(500).json({ error: err });
  }
}

async function createUser(req, res) {
  try {
    const dbUserData = await User.create(req.body);
    res.json(dbUserData);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: err });
  }
}

async function updateUserFriend(req, res) {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },
      { new: true }
    );

    if (result) {
      res.json(result);
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (err) {
    console.error('Error updating user friend:', err);
    res.status(500).json({ error: err });
  }
}

async function updateUser(req, res) {
  try {
    let updated_flag = false;
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
      return;
    }

    for (const key of Object.keys(req.body)) {
      if (key in user) {
        if (key === 'username') {
          const result = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: { username: req.body.username } },
            { new: true }
          );

          if (result) {
            updated_flag = true;
            res.status(200).json(result);
          } else {
            res.status(500).json({ error: 'Internal Server Error' });
          }
        } else if (key === 'email') {
          const result = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: { email: req.body.email } },
            { new: true }
          );

          if (result) {
            updated_flag = true;
            res.status(200).json(result);
          } else {
            res.status(500).json({ error: 'Internal Server Error' });
          }
        } else {
          res.status(404).json('You can only update username and email');
        }
      }
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: err });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    await Thought.deleteMany({ username: user.username });
    res.json(user);
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: err });
  }
}

async function deleteFriend(req, res) {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );

    if (result) {
      res.json(result);
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (err) {
    console.error('Error deleting friend:', err);
    res.status(500).json({ error: err });
  }
}

module.exports = { getUsers, getSingleUser, createUser, updateUserFriend, updateUser, deleteUser, deleteFriend };
