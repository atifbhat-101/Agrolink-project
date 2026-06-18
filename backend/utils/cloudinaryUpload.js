import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadToCloudinary = async (filePath, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `agrolink/${folderName}`,
    });
    // Remove local file after successful sync upload to Cloudinary storage bucket
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return result.secure_url;
  } catch (error) {
    throw new Error(`Cloudinary Service Upload Error: ${error.message}`);
  }
};
