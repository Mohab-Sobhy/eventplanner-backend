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
async function getUsername (req, res) {
  const { username, role } = req.user || {};
  if (!username) return res.status(400).json({ message: "Token required" });
  try {
    res.json({ username, role });
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
module.exports = {
  getAllUsers,
  getUsername
};
