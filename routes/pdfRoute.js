const express = require('express');
const router = express.Router();

router.get('/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, `./${filename}`);
    //need to change directory of file
    res.download(filePath, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error downloading file' });
        }
    });
});

module.exports = router;