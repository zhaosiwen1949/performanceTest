const puppeteer = require('puppeteer');
const fs = require('fs');
(async ()=>{
    const browser = await puppeteer.launch({
        executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
        slowMo: 1000,
        timeout: 0,
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto("https://crm.xiaoshouyi.com");
    const performanceTiming = await page.evaluate(function(){
        return Promise.resolve(JSON.stringify(window.performance.timing, null, '\t'));
    });
    fs.writeFile('./test.json', performanceTiming, (err)=>{
        if(err) throw err;
        console.log("file saved");
    });
    await browser.close();
})()