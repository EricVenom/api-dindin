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
    deleteTransaction,
    transactionDetails
} = require('./controllers');
const verifyToken = require('./middlewares');

routes.post('/usuario', signUp);
routes.post('/login', signIn);

routes.use(verifyToken);

routes.get('/usuario', showUser);
routes.put('/usuario', updateUser);

routes.get('/categoria', showCategories);

routes.get('/transacao', showTransactions);
routes.get('/transacao/extrato', transactionDetails) //falta
routes.get('/transacao/:id', showTransactionsById);
routes.post('/transacao', addNewTransaction);
routes.put('/transacao/:id', editTransaction);
routes.delete('/transacao/:id', deleteTransaction);


module.exports = routes;