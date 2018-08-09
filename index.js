const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('config.json');
(async ()=>{
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
        headless: false,
        ignoreHTTPSErrors: true,
        devtools: true,
    });
    const page = await browser.newPage();
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
    await page.waitForSelector($closeDialog);
    console.log("Page loaded");
    const performanceTiming = JSON.parse(await page.evaluate(function(){
        return Promise.resolve(JSON.stringify(window.performance.timing));
    }));
    const 
    fs.writeFile('./test.json', performanceTiming, (err)=>{
        if(err) throw err;
        console.log("file saved");
    });
    // await browser.close();
})()