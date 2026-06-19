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

export const updateMessage = async (req, res) => {
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ message: 'Message text is required' });
  }

  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own messages' });
    }

    message.text = text.trim();
    message.editedAt = new Date();
    await message.save();

    const fullMessage = await message.populate('sender recipient', 'name profileImage role');
    const io = getIO();
    io.to(fullMessage.recipient._id.toString()).emit('message_updated', fullMessage);
    io.to(fullMessage.sender._id.toString()).emit('message_updated', fullMessage);

    res.json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate('sender recipient', 'name profileImage role');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own messages' });
    }

    const payload = {
      _id: message._id,
      sender: message.sender,
      recipient: message.recipient,
    };

    await message.deleteOne();

    const io = getIO();
    io.to(message.recipient._id.toString()).emit('message_deleted', payload);
    io.to(message.sender._id.toString()).emit('message_deleted', payload);

    res.json({ message: 'Message deleted', deletedMessage: payload });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatRoomsList = async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
      .sort({ createdAt: -1 })
      .populate('sender recipient', 'name profileImage email role');

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
    }).sort({ createdAt: 1 }).populate('sender recipient', 'name profileImage role');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
