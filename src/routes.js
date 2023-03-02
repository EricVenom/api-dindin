const express = require('express');
const routes = express();
const { running } = require('./controllers');

routes.post('/usuario', running);

module.exports = routes;