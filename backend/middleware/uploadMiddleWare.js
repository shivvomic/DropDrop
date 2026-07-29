const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const safeName = file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-") 
      .replace(/-+/g, "-"); 

    return {
      folder: "DropDrop",
      resource_type: "auto",
      public_id: `${Date.now()}-${safeName}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024, 
  },
});

module.exports = upload;
