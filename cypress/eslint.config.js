const globals = require("globals");

module.exports = [
    {
        files: ["cypress/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
                cy: "readonly",
                Cypress: "readonly",
                describe: "readonly",
                it: "readonly",
                beforeEach: "readonly",
                expect: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "warn"
        }
    }
];