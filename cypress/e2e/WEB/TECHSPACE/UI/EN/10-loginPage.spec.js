const { onHeaderBar } = require('../../../../../support/page_objects/headerBar');
const { onHomePage } = require('../../../../../support/page_objects/homePage');

describe('When testing on Login Page', () => {
    beforeEach('Navigate to the home page', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/judges-mentors?pagination[pageSize]=100`
        }).as('judgesAndMentors')
        cy.openHomepage()
        cy.changeToEnglish(false, "AN")
    })

    it('Check all elements on login page', () => {
        onHeaderBar.openBurgerMenu(false, 'en')
        onHeaderBar.clickMasuk('en')
        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            onLoginPage.checkAllElement()
        })
    })

    it('should user can login with akun valid', () => {
        onHeaderBar.openBurgerMenu(false, 'en')
        onHeaderBar.clickMasuk('en')

        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            onLoginPage.submitWithEmailandPassword(Cypress.env('testEmail'), Cypress.env('testPassword'))
        })
        cy.wait(1000)
        cy.reload()
        cy.contains('You have successfully logged in!').should('be.visible')
        cy.contains('button', 'Back to Home').should('be.visible').click()
        onHomePage.checkUrl()
    })

    it('should user not can login with akun not terdaftar', () => {
        onHeaderBar.openBurgerMenu(false, 'en')
        onHeaderBar.clickMasuk('en')

        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            onLoginPage.submitWithEmailandPassword('tester123@example.com', 'Microsoft@123')
            cy.contains('We can\'t seem to find your account').should('be.be.visible')
        })

    })

    it('should user not can login with password salah', () => {
        onHeaderBar.openBurgerMenu(false, 'en')
        onHeaderBar.clickMasuk('en')

        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            onLoginPage.submitWithEmailandPassword('tester@example.com', 'Microsoft@1234')
            cy.contains('Your password is incorrect').should('be.be.visible')
        })
    })

    it('should user not can login with input kosong', () => {
        onHeaderBar.openBurgerMenu(false, 'en')
        onHeaderBar.clickMasuk('en')

        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            onLoginPage.submitWithEmptyFields()
            cy.contains('Please enter your Email Address').should('be.be.visible')
            cy.contains('Please enter your password').should('be.be.visible')
        })
    })
})