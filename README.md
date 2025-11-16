# Cypress TechCorp Automation

## Project Structure

### `/cypress/`
Main Cypress testing directory containing all test-related files and configurations.

### `/cypress/e2e/`
End-to-end test files organized by application and test type.

#### `/cypress/e2e/WEB/TECHCORP/`
- **`API/`** - API testing files for TechCorp application
  - `EN/` - English language API tests
  - `ID/` - Indonesian language API tests
- **`UI/`** - User interface testing files for TechCorp application
  - `EN/` - English language UI tests
  - `ID/` - Indonesian language UI tests

#### `/cypress/e2e/WEB/TECHSPACE/`
- **`API/`** - API testing files for TechSpace application
  - `EN/` - English language API tests
  - `ID/` - Indonesian language API tests
- **`UI/`** - User interface testing files for TechSpace application
  - `EN/` - English language UI tests
  - `ID/` - Indonesian language UI tests

### `/cypress/fixtures/`
Test data and JSON schemas for validation.
- **`TECHCORP/`** - Test data specific to TechCorp application
- **`WEB/`** - Test data for web applications
- **`credential.json`** - Authentication credentials
- **`example.json`** - Sample test data

### `/cypress/support/`
Cypress support files and utilities.
- **`helper/`** - Utility functions and helper methods
- **`page_objects/`** - Page Object Model classes
- **`commands.js`** - Custom Cypress commands
- **`e2e.js`** - Global test configuration

### `/cypress/plugins/`
Cypress plugins and extensions.

### `/cypress/results/`
Test execution results and reports.
- **`junit/`** - JUnit format test results
- **`mochawesome/`** - Mochawesome format test results

### `/cypress/screenshots/`
Screenshots captured during test execution.
- **`EN/`** - Screenshots from English tests
- **`ID/`** - Screenshots from Indonesian tests

### `/mochawesome-report/`
Generated HTML test reports and assets.

## Configuration Files
- **`cypress.config.js`** - Main Cypress configuration
- **`cypress.env.json`** - Environment variables
- **`package.json`** - Node.js dependencies and scripts
- **`reporter-config.json`** - Test reporter configuration

## Scripts
- **`translate_*.sh`** - Translation utilities for test files
- **`sanitize_project.sh`** - Project sanitization script