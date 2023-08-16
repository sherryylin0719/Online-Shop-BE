const axios = require('axios');

const fetchData = async (link) => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/${link}`);
      const apiData = response.data;
      return apiData;
    } catch (error) {
      console.error('Cannot fetch data:', error);
    }
  }

module.exports = fetchData;