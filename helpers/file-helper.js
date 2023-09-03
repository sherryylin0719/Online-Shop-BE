if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const generateRandomString = require('../helpers/general-helper').generateRandomString
const Product = require('../models/product');

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

// upload image to cloudinary and return image object
const uploadImage = async (req, res, next) => {
  try {
    // upload image to cloudinary and create image object
    const image = [];
    for (let i = 0; i < req.files.length; i++) {
      const randomString = generateRandomString(10)
      const file = dataUri(req.files[i]).content;
      const result = await cloudinary.uploader.upload(file, {
      public_id: `products/${req.body.title}-${randomString}`,
      resource_type: "auto",
      secure: true,
      });
      image.push({ url: result.secure_url, metadata: req.body.title, publicId: result.public_id });
    }
    return image

  } catch (err) {
    next(err)
  }
}

// update image on cloudinary and return image object
const updateImage = async (req, res, next) => {
  try {
    // create image object
    const image = []
    // get product id
    const productId = req.params.id
    // get product image list
    const currentImageList = (await Product.findById(productId).select('image')).image;
    // get new image list
    const newImageList = req.files.map(file => file.originalname.toString());

    // filter out same image from new image list
    const sameImageList = newImageList.filter(url => currentImageList.some(img => img.url === url))
    // filter out to be deleted image from current image list
    const deleteImageList = currentImageList.filter(img => !newImageList.includes(img.url))
    // filter out to be uploaded image from new image list
    const uploadImageList = newImageList.filter(url => !currentImageList.some(img => img.url === url))

    // push same image to image object
    for (let i = 0; i < sameImageList.length; i++) {
      image.push(sameImageList[i])
    }

    // if image has publicId, delete image on cloudinary
    for (let i = 0; i < deleteImageList.length; i++) {
      if (deleteImageList[i].publicId !== '') {
        await cloudinary.uploader.destroy(deleteImageList[i].publicId)
      } 
    }

    // upload image to cloudinary
    for (let i = 0; i < uploadImageList.length; i++) {
      const randomString = generateRandomString(10)
      const file = dataUri(req.files[i]).content;
      const result = await cloudinary.uploader.upload(file, {
      public_id: `products/${req.body.title}-${randomString}`,
      resource_type: "auto",
      secure: true,
      });
      image.push({ url: result.secure_url, metadata: req.body.title, publicId: result.public_id });
    }
    return image

  } catch (err) {
    next(err)
  }
}

// delete image on cloudinary
const deleteImage = async (req, res, next) => {
  try {
    // get product id
    const productId = req.params.id
    // get product image list
    const currentImageList = (await Product.findById(productId).select('image')).image;
    // delete image on cloudinary
    for (let i = 0; i < currentImageList.length; i++) {
      await cloudinary.uploader.destroy(currentImageList[i].publicId)
    }

  } catch (err) {
    next(err)
  }
}

module.exports = {
  multerUpload,
  dataUri,
  uploadImage,
  updateImage,
  deleteImage
};
  