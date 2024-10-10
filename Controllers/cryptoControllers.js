const axios = require('axios');
const Crypto = require('../Models/crypto-model');
const cron = require('node-cron');

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

const insertAllStats = async (req, res) => {
    const coins = ['bitcoin', 'matic-network', 'ethereum'];
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
                params: {
                ids: coins.join(','),
                vs_currencies: 'usd',
                include_market_cap: true,
                include_24hr_change: true
                }
            });
      
            const data = response.data;
            const cryptoData = coins.map((coin) => {
                return {
                    coin,
                    price: data[coin].usd,
                    marketCap: data[coin].usd_market_cap,
                    change24h: data[coin].usd_24h_change
                }
            })
            try {
                const result = await Crypto.insertMany(cryptoData);
                console.log('Data inserted successfully:', result);
            } catch (error) {
                console.error('Error inserting data:', error);
            }
          
              // Store data in MongoDB
        } catch (error) {
          console.error('Error fetching crypto data:', error);
        }
}

cron.schedule('0 */2 * * *', insertAllStats);

module.exports = {
    createInitialConnection,
    insertAllStats
}