const express = require('express');
const routes = express();
const { signUp, signIn, showUser } = require('./controllers');
const verifyToken = require('./middlewares');

routes.post('/usuario', signUp);
routes.post('/login', signIn);

routes.use(verifyToken);

routes.get('/usuario', showUser);

module.exports = routes;