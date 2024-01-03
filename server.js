const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const jsonRoute = require('./jsonRoute');

const PORT = 3050;

app.use('/', jsonRoute);

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
});