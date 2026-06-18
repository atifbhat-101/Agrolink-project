import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

// export const uploadMediaFile = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'No input file streams captured for storage pipeline operations' });
//     const targetFolder = req.body.folder || 'general';
//     const cloudinaryUrl = await uploadToCloudinary(req.file.path, targetFolder);
//     res.status(200).json({ url: cloudinaryUrl });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const uploadMediaFile = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("PATH:", req.file?.path);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const targetFolder = req.body.folder || "general";

    const cloudinaryUrl = await uploadToCloudinary(
      req.file.path,
      targetFolder
    );

    res.status(200).json({ url: cloudinaryUrl });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};