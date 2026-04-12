class ProductListingPage {
    selectProduct(title) {
        cy.contains('.inventory_item_name', title).scrollIntoView().click();
    }
    cartLink() {
        cy.get('.shopping_cart_link').click();
    }
}
export default new ProductListingPage();
