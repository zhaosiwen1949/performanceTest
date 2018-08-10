const puppeteer = require('puppeteer');
const fs = require('fs');
// const pug = require('pug');
// const resultTemplate = pug.compileFile('./result.pug');
const config = require('./config.json');
const { processTiming, processMetrics } = require('./processData');
module.exports = async function testPage (resultList){
    const account = config.account;
    const password = config.password;
    const $account = "#div_main > div.crm-register-bg > div.crm-register-form.crm-login-form.login_box > div.crm-register-body.crm-login1-body > ul > li:nth-child(1) > div > input";
    const $password = "#div_main > div.crm-register-bg > div.crm-register-form.crm-login-form.login_box > div.crm-register-body.crm-login1-body > ul > li:nth-child(2) > div > input";
    const $submit = "#div_main > div.crm-register-bg > div.crm-register-form.crm-login-form.login_box > div.crm-register-footer > a";
    const $tenant = "#div_main > div.crm-register-bg > div.crm-register-form.crm-login-form.tenant_box > div > ul > li:nth-child(2) > span";
    const $closeDialog = "#pagehead > div.new_remind.js-latest-update-content.hidden > a";
    const browser = await puppeteer.launch({
        executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
        slowMo: 300,
        timeout: 0,
        // headless: false,
        ignoreHTTPSErrors: true,
        // devtools: true,
        args: ["--incognito"],
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    // const page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 800
    });
    await page.goto(config.url);
    await page.type($account, account);
    await page.type($password, password);
    await page.click($submit);
    await page.waitForSelector($tenant);
    await page.click($tenant);
    await page.reload({
        timeout: 0,
        waitUntil: "networkidle0",
    });
    // 由于登录方式是通过修改location.href实现的，无法通过该函数进行监控
    // await page.waitForNavigation({
    //     timeout: 0,
    //     waitUntil: "networkidle0"
    // });
    // console.log("Page start");
    try{
        await page.waitForSelector($closeDialog);
        // console.log("Page loaded");

        // 根据window.performance.timing获取指标
        const performanceTiming = JSON.parse(await page.evaluate(function(){
            return Promise.resolve(JSON.stringify(window.performance.timing));
        }));
        const timingResult = processTiming(performanceTiming);

        // 根据 devtools protocol的metrics获取指标
        const performanceMetrics = await page._client.send('Performance.getMetrics');
        const metricsResult = processMetrics(performanceMetrics);
        
        resultList.push({
            timing: timingResult,
            metrics: metricsResult,
        });
    
        await context.close();
        await browser.close();
    }catch(error){
        await context.close();
        await browser.close();
        throw error;
    }
}