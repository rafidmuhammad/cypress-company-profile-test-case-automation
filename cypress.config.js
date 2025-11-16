const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  retries: {
    runMode: 2,
    openMode: 1
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    baseUrl: 'https://techcorp-backend.dev.example.com',
    experimentalOriginDependencies: true,
    async setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});