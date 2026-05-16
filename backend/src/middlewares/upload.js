const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'taskforge_attachments',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'docx', 'txt'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
