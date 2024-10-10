const axios = require('axios');

const createInitialConnection = (req, res) => {
    const options = {
        method: 'GET',
        url: `https://api.coingecko.com/api/v3/ping?x_cg_demo_api_key=${process.env.API_KEY}`,
        headers: {
          accept: 'application/json'
        },
      };
      
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
    res.send("First Route Successfully created");
}

module.exports = {
    createInitialConnection
}