import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const uploadMediaFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const targetFolder = req.body.folder || 'general';

    try {
      const cloudinaryUrl = await uploadToCloudinary(
        req.file.path,
        targetFolder
      );

      return res.status(200).json({ url: cloudinaryUrl });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed, using local file:', cloudinaryError.message);

      const localUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      return res.status(200).json({
        url: localUrl,
        warning: 'Cloudinary upload failed. Image saved locally instead.',
      });
    }
  } catch (error) {
    console.error('UPLOAD ERROR:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};
