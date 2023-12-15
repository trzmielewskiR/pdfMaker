const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const jsonRoute = require('./routes/jsonRoute');
const pdfRoute = require('./routes/pdfRoute');

const PORT = 3050;

app.use('/api', jsonRoute);

app.use('/pdf', pdfRoute);

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
})