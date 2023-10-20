const { By, Builder, until } = require('selenium-webdriver');
const assert = require("assert");

(async function loginWithValidCredentials() {
    let driver;

    try {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:5173/login')

        let emailInput = await driver.findElement(By.css('input[type="email"]'));
        let passwordInput = await driver.findElement(By.css('input[type="password"]'));
        let loginButton = await driver.findElement(By.css('button.primary'));

        await emailInput.sendKeys('john@gmail.com');
        await passwordInput.sendKeys('john');
        await driver.manage().setTimeouts({implicit: 500});

        await loginButton.click();

        await driver.wait(until.alertIsPresent());

        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        assert.equal("Login successful!", alertText);
        await driver.manage().setTimeouts({implicit: 500});


        // OK the alert
        await alert.accept();

        await driver.switchTo().defaultContent();

        const currentURL = await driver.getCurrentUrl();
        assert.equal("http://localhost:5173/", currentURL);

    } catch (e) {
        console.log(e)
    } finally {
        console.log("Closing the browser, test 1 successful");
        await driver.quit();
    }
})();

(async function loginWithWrongCredentials() {
    let driver;

    try {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:5173/login')

        let emailInput = await driver.findElement(By.css('input[type="email"]'));
        let passwordInput = await driver.findElement(By.css('input[type="password"]'));
        let loginButton = await driver.findElement(By.css('button.primary'));

        await emailInput.sendKeys('wrong@gmail.com');
        await passwordInput.sendKeys('wrong');
        await driver.manage().setTimeouts({implicit: 500});

        await loginButton.click();

        await driver.wait(until.alertIsPresent());

        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        assert.equal("Login not found! Try again or register now.", alertText);
        await driver.manage().setTimeouts({implicit: 500});


        // OK the alert
        await alert.accept();

        await driver.switchTo().defaultContent();

        const currentURL = await driver.getCurrentUrl();
        assert.equal("http://localhost:5173/login", currentURL);

    } catch (e) {
        console.log(e)
    } finally {
        console.log("Closing the browser, test 2 successful");
        await driver.quit();
    }
})();
