const express = require('express');
const Router = express.Router();
const { createInitialConnection, getStats, deviation } = require('../Controllers/cryptoControllers');

// Initial Connection With API
Router.get('/', createInitialConnection);
Router.get('/stats', getStats);
Router.get('/deviation', deviation);

module.exports = Router;