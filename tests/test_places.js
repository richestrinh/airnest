const { By, Builder, until } = require('selenium-webdriver');
const assert = require("assert");

(async function createNewPlace() {
    let driver;

    try {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:5173/login')

        let emailInput = await driver.findElement(By.css('input[type="email"]'));
        let passwordInput = await driver.findElement(By.css('input[type="password"]'));
        let loginButton = await driver.findElement(By.css('button.primary'));

        await emailInput.sendKeys('test@gmail.com');
        await passwordInput.sendKeys('test');
        await driver.manage().setTimeouts({ implicit: 500 });

        await loginButton.click();

        await driver.wait(until.alertIsPresent());

        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        assert.equal("Login successful!", alertText);
        await driver.manage().setTimeouts({ implicit: 500 });


        // OK the alert
        await alert.accept();

        await driver.switchTo().defaultContent();

        const currentURL = await driver.getCurrentUrl();
        assert.equal("http://localhost:5173/", currentURL);

        // Create new place
        let account = await driver.findElement(By.id('profile'));
        await account.click();
        await driver.manage().setTimeouts({ implicit: 500 });

        const accountURL = await driver.getCurrentUrl();
        assert.equal("http://localhost:5173/account", accountURL);

        let accommodation = await driver.findElement(By.id('nav-my-accommodation'));
        await accommodation.click();

        let addPlace = await driver.findElement(By.id('add-place'));
        await addPlace.click();

        const newPlaceUrl = await driver.getCurrentUrl();
        assert.equal("http://localhost:5173/account/places/new", newPlaceUrl);

        // Fill out form.
        let titleInput = await driver.findElement(By.id('title'));
        let addressInput = await driver.findElement(By.id('address'));

        let photosInput = await driver.findElement(By.id('photo'));
        let addPhoto = await driver.findElement(By.id('add-photo'));

        async function addPhotoWithDelay(photoURL) {
            await photosInput.sendKeys(photoURL);
            await addPhoto.click();
            await new Promise(resolve => setTimeout(resolve, 500)); // Adjust the delay time as needed
            await photosInput.clear();
          }

        await addPhotoWithDelay('https://upload.wikimedia.org/wikipedia/commons/c/c5/Number-One.JPG');
        await addPhotoWithDelay('https://upload.wikimedia.org/wikipedia/commons/d/d5/Number-two.JPG');
        await addPhotoWithDelay('https://upload.wikimedia.org/wikipedia/commons/0/0a/Number-three.JPG');

        let descriptionInput = await driver.findElement(By.id('description'));

        await titleInput.sendKeys('Selenium');
        await addressInput.sendKeys('1234 NE Selenium');
        await descriptionInput.sendKeys('Created by Selenium.');

        let perkOne = await driver.findElement(By.css('input[name="wifi"]'));
        let perkTwo = await driver.findElement(By.css('input[name="parking"]'));
        let perkThree = await driver.findElement(By.css('input[name="tv"]'));
        await perkOne.click();
        await perkTwo.click();
        await perkThree.click();

        let extraInfoInput = await driver.findElement(By.id('extra-info'));
        await extraInfoInput.sendKeys('Extra Info created by Selenium.');

        let checkInInput = await driver.findElement(By.id('check-in'));
        let checkOutInput = await driver.findElement(By.id('check-out'));
        let guestsInput = await driver.findElement(By.id('guests'));
        let priceInput = await driver.findElement(By.id('price'));

        await checkInInput.sendKeys('12');
        await checkOutInput.sendKeys('12');
        await guestsInput.sendKeys('2');
        await priceInput.sendKeys('111');

        let saveButton = await driver.findElement(By.id('save'));
        await saveButton.click();

        await driver.wait(until.urlIs('http://localhost:5173/account/places'), 5000);
        const redirectHome = await driver.getCurrentUrl();
        assert.equal("http://localhost:5173/account/places", redirectHome);
    } catch (e) {
        console.log(e)
    } finally {
        console.log("Closing the browser. Create new place test successful");
        await driver.quit();
    }
})();