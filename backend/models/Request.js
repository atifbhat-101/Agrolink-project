import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    lot: { type: mongoose.Schema.Types.ObjectId, ref: 'Lot', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredPrice: { type: Number, required: true },
    quantityRequested: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    note: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Request', requestSchema);
