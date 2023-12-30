const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const data = require('./menuCardData.json');
const Handlebars = require('handlebars');
const helpers = require('handlebars-helpers')({
    handlebars: Handlebars
});

const compile = async function(templateName, data){
    const filePath = path.join(process.cwd(), 'templates',`${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
};

hbs.registerHelper('divideBy100', function(value) {
    return (value / 100).toFixed(2); 
});

hbs.registerHelper('hasSizeParameter', function(parameters) {
    return parameters && parameters.some(param => param.id === 1);
});

hbs.registerHelper('isZero', function(value) {
    return value === 0;
});

hbs.registerHelper('addCosts', function(baseCost, additionalCost) {
    let totalCost = Number(baseCost) + Number(additionalCost);
    return (totalCost / 100).toFixed(2); // Format for currency
});

hbs.registerHelper('hasNonSizeParameters', function(parameters) {
    return parameters && parameters.some(param => param.id !== 1 && param.options && param.options.length > 0);
});

(async function(){
    try{
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('menu-base',data);

        await page.setContent(content);
        await page.emulateMediaType('screen');
        await page.pdf({
            path: 'menu.pdf',
            format: 'A4',
            printBackground: true
        });

        console.log('done');
        await browser.close();
        process.exit();

    } catch(e){
        console.log('error: ',e);
    } 
})();