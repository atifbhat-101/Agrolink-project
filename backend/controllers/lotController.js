import Lot from '../models/Lot.js';

export const createLot = async (req, res) => {
  const { title, cropName, quantity, pricePerUnit, location, description, images } = req.body;
  try {
    const lot = await Lot.create({
      farmer: req.user._id,
      title,
      cropName,
      quantity,
      pricePerUnit,
      location,
      description,
      images: images || []
    });
    res.status(201).json(lot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLots = async (req, res) => {
  try {
    const filter = { status: 'available' };
    if (req.query.cropName) filter.cropName = { $regex: req.query.cropName, $options: 'i' };
    if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };

    const lots = await Lot.find(filter).populate('farmer', 'name phone profileImage').sort({ createdAt: -1 });
    res.json(lots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFarmerLots = async (req, res) => {
  try {
    const lots = await Lot.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json(lots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLotById = async (req, res) => {
  try {
    const lot = await Lot.findById(req.params.id).populate('farmer', 'name phone profileImage');
    if (!lot) return res.status(404).json({ message: 'Lot matching resource mapping parameters not found' });
    res.json(lot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLotStatus = async (req, res) => {
  try {
    const lot = await Lot.findById(req.params.id);
    if (!lot) return res.status(404).json({ message: 'Resource element mapping file not found' });
    if (lot.farmer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized permission profiles block exception' });

    lot.status = req.body.status || lot.status;
    const updatedLot = await lot.save();
    res.json(updatedLot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
