const multer = require('multer');
const { cloudinary, hasCloudinaryConfig } = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      cb(new ApiError(400, 'Only image files are allowed'));
      return;
    }

    cb(null, true);
  }
});

const uploadProductImages = upload.any();

const uploadBufferToCloudinary = (file) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'products',
      resource_type: 'image',
      use_filename: true,
      unique_filename: true
    },
    (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        url: result.secure_url,
        public_id: result.public_id,
        alt: file.originalname
      });
    }
  );

  stream.end(file.buffer);
});

const attachCloudinaryImages = asyncHandler(async (req, res, next) => {
  const files = Array.isArray(req.files) ? req.files : Object.values(req.files || {}).flat();

  if (files.length === 0) {
    next();
    return;
  }

  if (!hasCloudinaryConfig()) {
    throw new ApiError(500, 'Cloudinary environment variables are not configured');
  }

  const uploadedImages = await Promise.all(files.map(uploadBufferToCloudinary));
  req.body.images = [
    ...(Array.isArray(req.body.images) ? req.body.images : req.body.images ? [req.body.images] : []),
    ...uploadedImages
  ];

  next();
});

module.exports = {
  uploadProductImages,
  attachCloudinaryImages
};
