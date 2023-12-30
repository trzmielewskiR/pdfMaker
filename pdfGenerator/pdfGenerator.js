const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
//const data = require('./database-template.json');
const Handlebars = require('handlebars');
const helpers = require('handlebars-helpers')({
    handlebars: Handlebars
});

const compile = async function(templateName, data){
    console.log(process.cwd());
    const filePath = path.join(process.cwd(), 'templates',`${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
};

hbs.registerHelper('divideBy100', function(value) {
    return (value / 100).toFixed(2); // Adjusts the price and fixes to 2 decimal places
});

hbs.registerHelper('hasSizeParameter', function(parameters) {
    return parameters && parameters.some(param => param.id === 1);
});

hbs.registerHelper('isZero', function(value) {
    return value === 0;
});

hbs.registerHelper('addCosts', function(baseCost, additionalCost) {
    // Convert to numbers to ensure correct addition
    console.log("base",baseCost);
    console.log("add",additionalCost);
    let totalCost = Number(baseCost) + Number(additionalCost);
    console.log(totalCost);
    return (totalCost / 100).toFixed(2); // Format for currency
});

const generatePDF = async (jsonData) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('menu-base', jsonData);
        await page.setContent(content);
        await page.emulateMediaType('screen');
        await page.pdf({
            path: 'menu.pdf',
            format: 'A4',
            printBackground: true
        });

        console.log('PDF generated successfully');
        await browser.close();
    } catch (e) {
        console.error('Error generating PDF:', e);
        throw e;
    }
};

module.exports = generatePDF;