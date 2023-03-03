const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./src/routes')

app.use(express.json(), cors());

app.use(routes);

app.listen(3334);