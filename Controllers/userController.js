const UserRepo = require('../Model/repos/UserRepo');
const userRepo = new UserRepo();

async function getAllUsers(req, res) {
  try {
    const users = await userRepo.getAll();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error while retrieving users' });
  }
}

module.exports = {
  getAllUsers
};
