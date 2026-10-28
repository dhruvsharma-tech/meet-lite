import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary if credentials are provided in .env
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const cloudinaryService = {
  async uploadImage(fileBuffer, folder = 'avatars') {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn('[Cloudinary] Missing credentials. Returning placeholder image URL.');
      return null;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(fileBuffer);
    });
  },

  async deleteImage(publicId) {
    if (!process.env.CLOUDINARY_CLOUD_NAME) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('[Cloudinary] Delete failed:', err);
    }
  },
};

export default cloudinaryService;
