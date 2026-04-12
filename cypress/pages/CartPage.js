class CartPage {
    clickCheckout() {
        cy.get('[data-test="checkout"]').click();
    }
}
export default new CartPage();
