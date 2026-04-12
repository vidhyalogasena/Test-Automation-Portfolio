const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    specPattern: "cypress/e2e/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) { 
       // implement node event listeners here
    },
  },
});
