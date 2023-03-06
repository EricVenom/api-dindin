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
    addNewTransaction,
    editTransaction,
    deleteTransaction
} = require('./controllers');
const verifyToken = require('./middlewares');

routes.post('/usuario', signUp);
routes.post('/login', signIn);

routes.use(verifyToken);

routes.get('/usuario', showUser);
routes.put('/usuario', updateUser);

routes.get('/categoria', showCategories);

routes.get('/transacao', showTransactions); //falta formatacao com join
routes.get('/transacao/:id', showTransactionsById); //falta tudo
routes.post('/transacao', addNewTransaction);
routes.put('/transacao/:id', editTransaction); //falta
routes.delete('/transacao/:id', deleteTransaction); //falta

module.exports = routes;