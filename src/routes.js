const express = require('express');
const routes = express();
const { signUp, signIn } = require('./controllers');

routes.post('/usuario', signUp);
routes.post('/login', signIn)

module.exports = routes;