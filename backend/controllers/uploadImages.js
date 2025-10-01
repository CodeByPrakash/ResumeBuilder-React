import fs from 'fs'
import path from 'path'
import Resume from '../models/resumeModels.js'
import upload from '../middleware/uploadMiddleware.js';
import { error } from 'console';

export const uploadResumeImages = async (req, res) => {
  try {
    upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "profileImage", maxCount: 1 }
    ])
    (req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: "File Upload Failed", error: err.message });
      }

      const resumeId = req.params.id;
      const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });

      if (!resume) {
        return res.status(404).json({ message: "Resume Not Found or Unauthorized" });
      }

      const uploadsFolder = path.join(process.cwd(), "uploads");
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const newThumbnail = req.files?.thumbnail?.[0];
      const newProfileImage = req.files?.profileImage?.[0];

      if (newThumbnail) {
        if (resume.thumbnailLink) {
          const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
          if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }
        resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
      }

      // Ensure profileInfo exists
      if (!resume.profileInfo) {
        resume.profileInfo = {};
      }

      if (newProfileImage) {
        if (resume.profileInfo.profilePreviewUrl) {
          const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
          if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }
        resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
      }

      await resume.save();

      res.status(200).json({
        message: "Images Uploaded Successfully",
        thumbnailLink: resume.thumbnailLink,
        profilePreviewUrl: resume.profileInfo.profilePreviewUrl
      });
    });
  } catch (error) {
    console.error('Error Uploading Image: ', error);
    res.status(500).json({
      message: "Failed To Upload Images",
      error: error.message
    });
  }
};
