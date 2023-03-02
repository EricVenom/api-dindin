const express = require('express');
const routes = express();
const { signUp } = require('./controllers');

routes.post('/usuario', signUp);

module.exports = routes;