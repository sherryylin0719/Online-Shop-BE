const db = require('../../config/mongoose')
const fetchData = require('./apiService')
const Category = require('../category')
const Product = require('../product')

// set up cloudinary
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

db.once('open', async () => {
  try {
    console.log('mongodb connected!')

    // axios get data
    // const productData = await fetchData('products')
    // create category data
    // const categoryList =  await Category.find().lean()
    // create product data
    // let newProducts = []
    // for (let i = 0; i < productData.length; i++) {
    //   const categoryIndex = i % categoryList.length
      // newProducts.push({
    //     title: productData[i].title,
    //     price: productData[i].price,
    //     category: categoryList[categoryIndex].category,
    //     description: productData[i].description,
      //   image: [{ url : productData[i].image, metadata: productData[i].title, publicId: '' }],
      // })
    
    // insert data
    // await Product.create(newProducts)

    // add quantity into product
    // await Product.updateMany({}, { $set: { quantity: 0 } })

    // upload product image to cloudinary and add publicId into product
    // const products = await Product.find().lean()
    // const updatedImage = []
    // for (let i = 0; i < products.length; i++) {
    //   const imageUrl = products[i].image[0].url
    //   const result = await cloudinary.uploader.upload(imageUrl, {
    //     public_id: `products/${products[i]._id}`,
    //     resource_type: "auto",
    //     secure: true,
    //   })
    //   updatedImage.push({
    //     url: result.secure_url,
    //     metadata: products[i].image.metadata,
    //     publicId: result.public_id
    //   })
    //   await Product.findByIdAndUpdate(products[i]._id, { $set: { image: updatedImage[i] } })
    // }
    
    console.log('done')
    process.exit()
  } catch (error) {
    console.error(error)
  }
})
