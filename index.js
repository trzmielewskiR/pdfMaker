const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const data = require('./database-template.json');


const compile = async function(templateName, data){
    const filePath = path.join(process.cwd(), 'templates',`${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
};



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