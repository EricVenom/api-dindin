const express = require('express');
const routes = express();
const {
    signUp,
    signIn,
    showUser,
    updateUser,
    showCategories
} = require('./controllers');
const verifyToken = require('./middlewares');

routes.post('/usuario', signUp);
routes.post('/login', signIn);

routes.use(verifyToken);

routes.get('/usuario', showUser);
routes.put('/usuario', updateUser);

routes.get('/categoria', showCategories);

module.exports = routes;