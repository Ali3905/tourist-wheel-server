const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Load environment variables from .env file

// Configure your Cloudinary account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tourist-wheel', // The folder in Cloudinary where the files will be stored
    format: async (req, file) => 'png', // Supports promises as well
    public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0], // The public ID of the file
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
};
