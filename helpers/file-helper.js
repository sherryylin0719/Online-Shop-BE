const multer = require('multer')

// set up multer
const storage = multer.memoryStorage();
const multerUpload = multer({ storage }).array('images', 10);

// set up datauri
const Datauri = require('datauri/parser')
const dUri = new Datauri()
const dataUri = req => dUri.format(req.originalname.toString(), req.buffer);

module.exports = {
  multerUpload,
  dataUri
};
  