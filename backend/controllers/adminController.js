import User from '../models/User.js';
import Lot from '../models/Lot.js';
import Request from '../models/Request.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

export const getAdminOverview = async (_req, res) => {
  try {
    const [users, farmers, buyers, lots, availableLots, requests, pendingRequests, completedDeals] = await Promise.all([
      User.countDocuments(), User.countDocuments({ role: 'farmer' }), User.countDocuments({ role: 'buyer' }),
      Lot.countDocuments(), Lot.countDocuments({ status: 'available' }), Request.countDocuments(),
      Request.countDocuments({ status: 'pending' }), Request.countDocuments({ status: 'accepted' }),
    ]);
    res.json({ users, farmers, buyers, lots, availableLots, requests, pendingRequests, completedDeals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Administrator accounts cannot be removed here.' });

    // Remove marketplace records linked to the account so no orphaned records remain.
    await Promise.all([
      Lot.deleteMany({ farmer: user._id }),
      Request.deleteMany({ $or: [{ buyer: user._id }, { farmer: user._id }] }),
      Message.deleteMany({ $or: [{ sender: user._id }, { recipient: user._id }] }),
      Notification.deleteMany({ $or: [{ sender: user._id }, { recipient: user._id }] }),
    ]);
    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
