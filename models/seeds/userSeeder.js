const db = require('../../config/mongoose')
const fetchData = require('./apiService')
const User = require('../user')

db.once('open', async () => {
  try {
    console.log('mongodb connected!')
    // create admin data
    const rootUser = {
      name: 'root',
      email: 'root@example.com',
      password: '12345678',
      role: 'admin',
    }

    // axios get data
    const userData = await fetchData('users?limit=5')
    
    // create user data
    let newUsers = [rootUser]
    for (let i = 0; i < userData.length; i++) {
      const newUser = {
        name: userData[i].username,
        email: userData[i].email,
        password: userData[i].password,
      };
      newUsers.push(newUser);
    }

    // insert data
    await User.create(newUsers);

    console.log('done')
    process.exit()
  } catch (error) {
    console.error(error)
  }
})
