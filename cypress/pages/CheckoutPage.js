class CheckoutPage {
    fillCheckoutDetails(data) {
        cy.get('[data-test="firstName"]').type(data.firstName);
        cy.get('[data-test="lastName"]').type(data.lastName);
        cy.get('[data-test="postalCode"]').type(data.postalCode);
        this.checkoutCTA();
    }
    errorCheckoutDetails() {
        this.checkoutCTA();
        cy.get('.error-message-container').should(
            'have.text',
            'Error: Last Name is required'
        );
    }
    checkoutCTA() {
        cy.get('[data-test="continue"]').click();
    }

    checkoutSummary(data) {
        cy.get('.inventory_item_name').should('include.text', data.title);
        cy.get('[data-test="shipping-info-value"]').should(
            'have.text',
            data.deliveryInfo
        );
        cy.get('.summary_subtotal_label')
            .invoke('text')
            .then((text) => {
                const itemTotal = parseFloat(text.replace('Item total: $', ''));
                cy.get('.summary_tax_label')
                    .invoke('text')
                    .then((tax) => {
                        const taxValue = parseFloat(tax.replace('Tax: $', ''));
                        cy.get('.summary_total_label')
                            .invoke('text')
                            .then((totalText) => {
                                const displayedTotal = parseFloat(
                                    totalText.replace('Total: $', '')
                                );
                                const calculatedTotal = itemTotal + taxValue;
                                expect(displayedTotal).to.equal(
                                    calculatedTotal
                                );
                            });
                    });
            });
    }

    placeOrder() {
        cy.get('[data-test="finish"]').click();
    }
}
export default new CheckoutPage();
