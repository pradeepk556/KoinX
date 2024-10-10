const express = require('express');
const Router = express.Router();
const { createInitialConnection, getStats } = require('../Controllers/cryptoControllers');

// Initial Connection With API
Router.get('/', createInitialConnection);
Router.get('/stats', getStats);

module.exports = Router;