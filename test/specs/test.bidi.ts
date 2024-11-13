import { expect, browser, $ } from '@wdio/globals'

describe('bidi examples', () => {

    it('should add an Espresso to the cart and verify the total', async () => {

        // **** BiDi *************

        // enable listening on log events, subscribe to the event. 
        await browser.sessionSubscribe({
            events: ['log.entryAdded'] 
        });

        // Start Listen to log events through WebDriver BiDi
        browser.on('log.entryAdded', (logEntry) => (
            console.log('got log event ', logEntry)
        ));

        // trigger a log event
        await browser.execute(() => (
            console.log('Hello Bidi')
        ))
        // ***********************

        // Set window size and navigate to URL
        await browser.setWindowSize(600, 1041);
        await browser.url('https://coffee-cart.app/?breakable=1');

        await browser.pause(2000);

        // Click the Espresso button
        await browser.$('[data-test="Espresso"]').click();

        // Assert that the checkout total is correct
        const checkout = await browser.$('[data-test="checkout"]');
        await expect(checkout).toHaveText('Total: $10.00');
    });
    
})

