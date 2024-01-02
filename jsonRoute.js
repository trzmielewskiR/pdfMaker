const express = require('express');
const generatePDF = require('./pdfGenerator/pdfGenerator.js');
const router = express.Router();

router.post("/", async (req, res) => {
    const jsonData = req.body;
    if (!jsonData) {
        return res.status(400).json({ message: 'No JSON data provided' });
    }
    try {
        
        await generatePDF(jsonData);

        const filePath = __dirname + '\\menu.pdf';
        res.download(filePath, "menu.pdf", (err) => {
            if (err) {
                res.status(500).json({error: err, message: "Error downloading the file"});
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating PDF'});
    }
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