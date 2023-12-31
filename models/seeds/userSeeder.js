if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const fetchData = require('./apiService')
const bcrypt = require("bcryptjs")
const User = require('../user')
const Order = require('../order')

db.once('open', async () => {
  try {
    console.log('mongodb connected!')
    // create admin data
    const rootSalt = await bcrypt.genSalt(10)
    const rootHash = await bcrypt.hash(process.env.ADMIN_PASSWORD , rootSalt)
    // const rootUser = {
    //   name: 'root',
    //   email: 'root@example.com',
    //   password: rootHash,
    //   role: 'admin',
    //   phone: '0912345678',
    // }

    // axios get data
    // const userData = await fetchData('users?limit=5')
    
    // create user data
    // let newUsers = [rootUser]
    // for (let i = 0; i < userData.length; i++) {
    //   const salt = await bcrypt.genSalt(10)
    //   const hash = await bcrypt.hash(userData[i].password, salt)
    //   const newUser = {
    //     name: userData[i].username,
    //     email: userData[i].email,
    //     password: hash
    //   };
    //   newUsers.push(newUser);
    // }

    // insert data
    // await User.create(newUsers);

    // add order data into users
    // const orderList = await Order.find().lean();
    // for (let i = 0; i < orderList.length; i++) {
    //   const orderId = orderList[i]._id;
    //   const userId = orderList[i].userId;
      
    //   await User.findByIdAndUpdate(userId, { $addToSet: { orders: orderId } });
    // }

    // change admin password
    await User.findOneAndUpdate({ email: 'root@example.com' }, { password: rootHash })

    console.log('done')
    process.exit()
  } catch (error) {
    console.error(error)
  }
})
