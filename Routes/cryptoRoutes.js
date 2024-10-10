const express = require('express');
const Router = express.Router();
const { createInitialConnection } = require('../Controllers/cryptoControllers');

// Initial Connection With API
Router.get('/', createInitialConnection);


module.exports = Router;