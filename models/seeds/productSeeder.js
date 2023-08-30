const db = require('../../config/mongoose')
const fetchData = require('./apiService')
const Category = require('../category')
const Product = require('../product')

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
    //   newProducts.push({
    //     title: productData[i].title,
    //     price: productData[i].price,
    //     category: categoryList[categoryIndex].category,
    //     description: productData[i].description,
    //     image: [{ url : productData[i].image, metadata: productData[i].title }],
    //   })
    // }
    // insert data
    // await Product.create(newProducts)

    // add quantity into product
    await Product.updateMany({}, { $set: { quantity: 0 } })

    console.log('done')
    process.exit()
  } catch (error) {
    console.error(error)
  }
})
