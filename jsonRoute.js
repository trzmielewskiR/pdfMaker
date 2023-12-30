const express = require('express');
const generatePDF = require('./pdfGenerator/pdfGenerator');
const router = express.Router();

router.post("/", (req, res) => {
    console.log(req.body);
    const jsonData = req.body;
    if (!jsonData) {
        console.log('No JSON data provided');
        return res.status(400).json({ message: 'No JSON data provided' });
    }
    try {
        console.log('Generating PDF');
        generatePDF(jsonData);
    } catch (error) {
        console.log('Error generating PDF: ', error);
        res.status(500).json({ message: 'Error generating PDF'});
    }

    const filePath = __dirname + '\\menu.pdf';
    console.log(filePath);
    res.download(filePath, "menu.pdf", (err) => {
        if (err) {
            res.send({error: err, message: "Error downloading the file"})
        }
    });
});


// router.get("/", (req, res) => {
//     const filePath = __dirname + '\\menu.pdf';
//     console.log(filePath);
//     res.download(filePath, "menu.pdf", (err) => {
//         if (err) {
//             res.send({error: err, message: "Error downloading the file"})
//         }
//     });
// });

module.exports = router;