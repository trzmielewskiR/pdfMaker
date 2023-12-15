const express = require('express');
const router = express.Router();

router.post("/", (req, res) => {
    console.log(req.body);
    const jsonData = req.body;
    if (!jsonData) {
        return res.status(400).json({ message: 'No JSON data provided' });
    }

    res.send(jsonData);
    //do something with the data

});
module.exports = router;