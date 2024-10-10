const axios = require("axios");
const Crypto = require("../Models/crypto-model");
const cron = require("node-cron");

const createInitialConnection = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.coingecko.com/api/v3/ping?x_cg_demo_api_key=${process.env.API_KEY}`,
    headers: {
      accept: "application/json",
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
};

const getStats = async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: "Please provide a coin name" });
  }

  try {
    const latestData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });
    if (!latestData) {
      return res
        .status(404)
        .json({ error: "Data not found for the requested coin" });
    }

    res.json({
      price: latestData.price,
      marketCap: latestData.marketCap,
      "24hChange": latestData.change24h,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const insertAllStats = async (req, res) => {
  const coins = ["bitcoin", "matic-network", "ethereum"];
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: coins.join(","),
          vs_currencies: "usd",
          include_market_cap: true,
          include_24hr_change: true,
        },
      }
    );

    const data = response.data;
    const cryptoData = coins.map((coin) => {
      return {
        coin,
        price: data[coin].usd,
        marketCap: data[coin].usd_market_cap,
        change24h: data[coin].usd_24h_change,
      };
    });
    try {
      const result = await Crypto.insertMany(cryptoData);
      console.log("Data inserted successfully:", result);
    } catch (error) {
      console.error("Error inserting data:", error);
    }

    // Store data in MongoDB
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
};

cron.schedule("0 */2 * * *", insertAllStats);


function calculateStandardDeviation(prices) {
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const variance =
    prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) /
    prices.length;
  return Math.sqrt(variance);
}

const deviation = async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: "Please provide a coin name" });
  }

  try {
    const prices = await Crypto.find({ coin })
      .sort({ timestamp: -1 })
      .limit(100)
      .select("price");

    if (!prices.length) {
      return res
        .status(404)
        .json({ error: "Not enough data for the requested coin" });
    }

    const priceValues = prices.map((doc) => doc.price);
    const deviation = calculateStandardDeviation(priceValues);

    res.json({ deviation: deviation.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createInitialConnection,
  insertAllStats,
  getStats,
  deviation
};
