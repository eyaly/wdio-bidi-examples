import { expect, browser, $ } from '@wdio/globals'

describe('cdp examples', () => {

    it('should allow me to use Puppeteer', async () => {
        // WebDriver command to open the URL
        const testedURL = "https://www.selenium.dev/selenium/web/frameset.html";
        await browser.url(testedURL);
        
        const puppeteerBrowser = await browser.getPuppeteer();
    
        // Use Puppeteer to interact with the open pages
        const metrics = await browser.call(async () => {
            const pages = await puppeteerBrowser.pages();
            let pageNumner = 0;
            // Log the number of open pages
            console.log('Number of open pages:', pages.length);
            for (let i = 0; i < pages.length; i++) {
                const url = await pages[i].url();
                console.log(`Page ${i + 1} URL: ${url}`);
                if (url == testedURL){
                    console.log(`URL is in Page ${i + 1} `);
                    pageNumner = i;
                }
                    
            }
            return pages[pageNumner].metrics()
        });
    
        console.log('Frames value is ' + metrics.Frames)
        expect(metrics.Frames).toBe(11);
    });

    it('should add an Espresso to the cart and verify the total - CDP way', async () => {


        // **** CDP *********
        // Access Puppeteer to set up console message logging
        const puppeteerBrowser = await browser.getPuppeteer();
        const [page] = await puppeteerBrowser.pages();

        // Array to store console messages
        const consoleMessages: string[] = [];

        // Listen for console messages and add them to the array
        page.on('console', (msg) => {
            const messageText = msg.text();
            consoleMessages.push(messageText);

            if (msg.type() === 'error') {
                console.error('Error log detected:', messageText);
            }
        });
        // *********************************

        // Set window size and navigate to URL
        await browser.setWindowSize(600, 1041);
        await browser.url('https://coffee-cart.app/?breakable=1');

        await browser.pause(2000);

        // Click the Espresso button
        await browser.$('[data-test="Espresso"]').click();

        // After the click, log all console messages captured up to this point
        console.log('Console messages after clicking Espresso:', consoleMessages);

        // Assert that the checkout total is correct
        const checkout = await browser.$('[data-test="checkout"]');
        await expect(checkout).toHaveText('Total: $10.00');
    });
    
})

