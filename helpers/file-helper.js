if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// set up multer
const multer = require('multer')
const storage = multer.memoryStorage();
const multerUpload = multer({ storage }).array('images', 10);

// set up datauri
const Datauri = require('datauri/parser')
const dUri = new Datauri()
const dataUri = req => dUri.format(req.originalname.toString(), req.buffer);

// set up cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

const uploadImage = async (req, res, next) => {
  try {
    // upload image to cloudinary
    const imageUrls = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = dataUri(req.files[i]).content;
      const result = await cloudinary.uploader.upload(file, {
      public_id: "products",
      resource_type: "auto",
      secure: true,
      });
      imageUrls.push(result.secure_url);
    }
    // create image object
    const image = []
    for (let i = 0; i < imageUrls.length; i++) {
      image.push({
        url: imageUrls[i],
        metadata: title
      })
      return image
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  multerUpload,
  dataUri,
  uploadImage
};
  