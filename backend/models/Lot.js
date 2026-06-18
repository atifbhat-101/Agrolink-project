import mongoose from 'mongoose';

const lotSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true }, // in kg/quintals
    pricePerUnit: { type: Number, required: true },
    location: { type: String, required: true },
    images: [{ type: String }], // Cloudinary URLs
    description: { type: String, required: true },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
  },
  { timestamps: true }
);

export default mongoose.model('Lot', lotSchema);
