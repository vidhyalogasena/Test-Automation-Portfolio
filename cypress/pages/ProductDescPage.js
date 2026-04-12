class ProductDescPage {
    addProduct() {
        cy.get('#add-to-cart').click();
    }

    clickCart() {
        cy.get('[data-test="shopping-cart-link"]').click();
    }
}
export default new ProductDescPage();
