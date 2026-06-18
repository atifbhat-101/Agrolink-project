import Message from '../models/Message.js';
import User from '../models/User.js';
import { getIO } from '../config/socket.js';

export const sendMessage = async (req, res) => {
  const { recipientId, text } = req.body;
  try {
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      text
    });

    const fullMessage = await message.populate('sender recipient', 'name profileImage');
    const io = getIO();
    io.to(recipientId).emit('message_received', fullMessage);

    res.status(201).json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatRoomsList = async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
      .sort({ createdAt: -1 })
      .populate('sender recipient', 'name profileImage email');

    const chatPartners = new Map();
    messages.forEach((msg) => {
      const partner = msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender;
      if (!chatPartners.has(partner._id.toString())) {
        chatPartners.set(partner._id.toString(), {
          user: partner,
          lastMessage: msg.text,
          updatedAt: msg.createdAt
        });
      }
    });

    res.json(Array.from(chatPartners.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    }).sort({ createdAt: 1 }).populate('sender recipient', 'name profileImage');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
