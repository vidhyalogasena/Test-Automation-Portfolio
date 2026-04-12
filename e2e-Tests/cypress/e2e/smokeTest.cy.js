import ProductListingPage from '../pages/ProductListingPage';
import ProductDescPage from '../pages/ProductDescPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderConfirmation from '../pages/OrderConfirmation';
describe('To test end to end user journey', () => {
    beforeEach(function () {
        cy.fixture('data').then(function (data) {
            this.data = data;
        });
        cy.visit('/');
    });

    it('To test successful user journey', function () {
        cy.login(this.data.validUser.username, this.data.validUser.password);
        cy.url().should('include', '/inventory.html');
        ProductListingPage.selectProduct(this.data.product.title);
        ProductDescPage.addProduct();
        ProductDescPage.clickCart();
        CartPage.clickCheckout();
        CheckoutPage.fillCheckoutDetails(this.data.checkout);
        CheckoutPage.checkoutSummary(this.data.product);
        CheckoutPage.placeOrder();
        OrderConfirmation.thankyouMessage();
    });
    it('To test unsuccessful login', function () {
        cy.login(
            this.data.invalidUser.username,
            this.data.invalidUser.password
        );
        cy.get('[data-test="error"]').should(
            'have.text',
            'Epic sadface: Sorry, this user has been locked out.'
        );
    });

    it('To test user journey with missing checkout details', function () {
        cy.login(
            this.data.problemUser.username,
            this.data.problemUser.password
        );
        cy.url().should('include', '/inventory.html');
        ProductListingPage.selectProduct(this.data.product.title);
        ProductDescPage.addProduct();
        ProductDescPage.clickCart();
        CartPage.clickCheckout();
        CheckoutPage.fillCheckoutDetails(this.data.checkout);
        CheckoutPage.errorCheckoutDetails();
    });

    it('To test user jouney with failed checkout', function () {
        cy.on('uncaught:exception', (err) => {
            // returning false here prevents Cypress from failing the test
            if (
                err.message.includes('Cannot read properties of undefined') ||
                err.message.includes('Ye.cesetRart is not a function')
            ) {
                return false;
            }
            return true;
        });
        cy.login(this.data.errorUser.username, this.data.errorUser.password);
        cy.url().should('include', '/inventory.html');
        ProductListingPage.selectProduct(this.data.errorUser.item);
        ProductDescPage.addProduct();
        ProductDescPage.clickCart();
        CartPage.clickCheckout();
        CheckoutPage.fillCheckoutDetails(this.data.checkout);
        CheckoutPage.placeOrder();
        cy.url().should('include', '/checkout-step-two.html');
    });
    it('To test peformance glitches in user journey with slow load', function () {
        const startTime = Date.now();
        cy.login(
            this.data.performanceGlitchUser.username,
            this.data.performanceGlitchUser.password
        );
        cy.url({ timeout: 15000 })
            .should('include', '/inventory.html')
            .then(() => {
                const duration = Date.now() - startTime;
                cy.log(`Page load duration: ${duration} ms`);
                expect(duration).to.be.lessThan(10000); // Assert that the load time is less than 10 seconds
            });
    });

    it.only('Should not allow checkout with empty cart - known bug in SauceDemo', function () {
        cy.login(this.data.validUser.username, this.data.validUser.password);
        ProductListingPage.cartLink();
        cy.get('.cart_item').should('not.exist');
        CartPage.clickCheckout();
        cy.url().should('include', '/checkout-step-one.html');
    });
});
