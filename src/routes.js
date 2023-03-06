const express = require('express');
const routes = express();
const {
    signUp,
    signIn,
    showUser,
    updateUser,
    showCategories,
    showTransactions,
    showTransactionsById,
    addNewTransaction
} = require('./controllers');
const verifyToken = require('./middlewares');

routes.post('/usuario', signUp);
routes.post('/login', signIn);

routes.use(verifyToken);

routes.get('/usuario', showUser);
routes.put('/usuario', updateUser);

routes.get('/categoria', showCategories);

routes.get('/transacao', showTransactions); //falta
routes.get('/transacao/:id', showTransactionsById); //falta
routes.post('/transacao', addNewTransaction);



module.exports = routes;