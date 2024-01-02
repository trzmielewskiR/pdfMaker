const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const Handlebars = require('handlebars');
const helpers = require('handlebars-helpers')({
    handlebars: Handlebars
});

const compile = async function(templateName, data){
    const filePath = path.join(process.cwd(), 'templates',`${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
};

const processData = (data) => {
data.data.forEach(category => {
    
    category.universalParameters = [];

    const representativeMeal = category.meals[0];

    representativeMeal.parameters.forEach(param => {
        const isUniversal = category.meals.every(meal => {
            const mealParam = meal.parameters.find(p => p.id === param.id);
            return mealParam && JSON.stringify(mealParam.options) === JSON.stringify(param.options);
        });

        if (isUniversal) {
            category.universalParameters.push(param);
        } else {
            category.meals.forEach(meal => {
                meal.nonUniversalParams = meal.nonUniversalParams || [];
                const nonUnivParam = meal.parameters.find(p => p.id === param.id);
                if (nonUnivParam) {
                    meal.nonUniversalParams.push(nonUnivParam);
                }
            });
        }
    });
});
};

hbs.registerHelper('hasNonSizeParameters', function(universalParameters) {
    return universalParameters && universalParameters.some(param => param.id !== 2);
});

hbs.registerHelper('isNonUniversal', function(paramId, options, allMeals) {
    if (options.some(option => option.cost > 0)) {
        return true;
    }

    for (let i = 1; i < allMeals.length; i++) {
        const currentMealParam = allMeals[i].parameters.find(p => p.id === paramId);
        const firstMealParam = allMeals[0].parameters.find(p => p.id === paramId);

        if (!currentMealParam || !firstMealParam) continue;

        if (JSON.stringify(currentMealParam.options) !== JSON.stringify(firstMealParam.options)) {
            return true;
        }
    }

    return false;
});


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
    return (totalCost / 100).toFixed(2);
});


hbs.registerHelper('hasNonSizeParameters', function(parameters) {
    return parameters && parameters.some(param => param.id !== 1 && param.options && param.options.length > 0);
});

const generatePDF = async (data) => {
    try {

        processData(data)
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox'],
        });
        const page = await browser.newPage();

        const content = await compile('menu-base', data);
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