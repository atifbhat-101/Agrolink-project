import Request from '../models/Request.js';
import Lot from '../models/Lot.js';
import Notification from '../models/Notification.js';
import { getIO } from '../config/socket.js';

export const createRequest = async (req, res) => {
  const { lotId, offeredPrice, quantityRequested, note } = req.body;
  try {
    const lot = await Lot.findById(lotId);
    if (!lot) return res.status(404).json({ message: 'Target inventory item details missing' });

    const request = await Request.create({
      lot: lotId,
      buyer: req.user._id,
      farmer: lot.farmer,
      offeredPrice,
      quantityRequested,
      note
    });

    const notification = await Notification.create({
      recipient: lot.farmer,
      sender: req.user._id,
      type: 'request_new',
      title: 'New Offer Received',
      message: `${req.user.name} submitted an offer of ₹${offeredPrice} for ${lot.title}.`
    });

    const io = getIO();
    io.to(lot.farmer.toString()).emit('notification_received', notification);

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBuyerRequests = async (req, res) => {
  try {
    const requests = await Request.find({ buyer: req.user._id }).populate('lot').populate('farmer', 'name phone').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFarmerIncomingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ farmer: req.user._id }).populate('lot').populate('buyer', 'name phone').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const request = await Request.findById(req.params.id).populate('lot');
    if (!request) return res.status(404).json({ message: 'Target trade transaction configuration record not found' });
    if (request.farmer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized pipeline workflow operation access rejected' });

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      await Lot.findByIdAndUpdate(request.lot._id, { status: 'sold' });
    }

    const notification = await Notification.create({
      recipient: request.buyer,
      sender: req.user._id,
      type: 'request_status',
      title: `Offer ${status.toUpperCase()}`,
      message: `Your trade workflow offer configuration status for item ${request.lot.title} was set to ${status}.`
    });

    const io = getIO();
    io.to(request.buyer.toString()).emit('notification_received', notification);

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
