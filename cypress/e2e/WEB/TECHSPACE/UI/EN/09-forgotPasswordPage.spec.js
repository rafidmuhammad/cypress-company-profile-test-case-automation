const { onHeaderBar } = require('../../../../../support/page_objects/headerBar');
import { recurse } from 'cypress-recurse'

/// <reference types="Cypress" />
describe('When testing forgot password', () => {
    let userEmail
    let emailCount
    let sid_token

    before('get test email', () => {
        cy.fixture('WEB/auth/emailAccountData.json').then(testAccount => {
            userEmail = testAccount.email_addr
            sid_token = testAccount.sid_token
        })
        cy.fixture('WEB/auth/emailcounts.json').then(count => {
            emailCount = count.emailSent
        })
    })

    beforeEach('Navigate to the home page', () => {
        cy.openHomepage()
        cy.changeToEnglish(false, "AN")
        onHeaderBar.openBurgerMenu(false, "en")
        onHeaderBar.clickMasuk("en")
    })


    it('should user will be navigated to the forgot password', () => {
        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            const { onForgotPasswordPage } = Cypress.require('../../../../../support/page_objects/forgotPasswordPage')
            onLoginPage.clickForgotPassword()
            onForgotPasswordPage.checkAllElement()
        })
    })


    it('should user will be shown message when invalid input', () => {
        cy.origin(`${Cypress.env('B2C_URL')}`, { args: { userEmail } }, ({ userEmail }) => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            const { onForgotPasswordPage } = Cypress.require('../../../../../support/page_objects/forgotPasswordPage')
            onLoginPage.clickForgotPassword()
            onForgotPasswordPage.fillInTheField('email', 'testergmail.com')
            onForgotPasswordPage.sendVerificationCode()
            //Email invalid
            cy.contains('Please enter a valid email address.').should('be.visible')
            onForgotPasswordPage.fillInTheField('email', userEmail)
            onForgotPasswordPage.sendVerificationCode()
        })
        emailCount += 1
        recurse(
            () => cy.request({
                method: 'GET',
                url: `https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${sid_token}`
            }),
            (res) => res.body.list.length > emailCount,
            {
                delay: 5000,
                timeout: 60000,
                log: false
            }
        )
        cy.getOTPEmail().then(code => {
            cy.origin(`${Cypress.env('B2C_URL')}`, { args: { code } }, ({ code }) => {
                const { onForgotPasswordPage } = Cypress.require('../../../../../support/page_objects/forgotPasswordPage')
                const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
                onForgotPasswordPage.fillInTheField('emailVerificationCode', code)
                onForgotPasswordPage.pressTheButton('emailVerificationControl_but_verify_code')
                cy.wait(2000)
                onForgotPasswordPage.pressTheButton('continue')
                onForgotPasswordPage.fillInTheField('newPassword', 'Qwerty1234!')
                onForgotPasswordPage.pressTheButton('continue')
                //Konfirmasi password kosong
                cy.contains('The password entry fields do not match. Please enter the same password in both fields and try again.').should('be.visible')
                onForgotPasswordPage.fillInTheField('reenterPassword', 'Qwerty12345!')
                onForgotPasswordPage.pressTheButton('continue')
                //Password and konfirmasi password not sama
                cy.contains('The password entry fields do not match. Please enter the same password in both fields and try again.').should('be.visible')
            })
        })
    })

    it('should user can input valid data to forgot password', () => {
        cy.origin(`${Cypress.env('B2C_URL')}`, { args: { userEmail } }, ({ userEmail }) => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            const { onForgotPasswordPage } = Cypress.require('../../../../../support/page_objects/forgotPasswordPage')
            onLoginPage.clickForgotPassword()
            onForgotPasswordPage.fillInTheField('email', userEmail)
            onForgotPasswordPage.sendVerificationCode()
        })
        emailCount += 1
        recurse(
            () => cy.request({
                method: 'GET',
                url: `https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${sid_token}`
            }),
            (res) => res.body.list.length > emailCount,
            {
                delay: 5000,
                timeout: 60000,
                log: false
            }
        )
        cy.getOTPEmail().then(code => {
            cy.origin(`${Cypress.env('B2C_URL')}`, { args: { code } }, ({ code }) => {
                const { onForgotPasswordPage } = Cypress.require('../../../../../support/page_objects/forgotPasswordPage')
                onForgotPasswordPage.fillInTheField('emailVerificationCode', code)
                onForgotPasswordPage.pressTheButton('emailVerificationControl_but_verify_code')
                cy.wait(2000)
                onForgotPasswordPage.pressTheButton('continue')
                onForgotPasswordPage.fillInTheField('newPassword', 'Qwerty1234!')
                onForgotPasswordPage.fillInTheField('reenterPassword', 'Qwerty1234!')
                onForgotPasswordPage.pressTheButton('continue')
            })
            cy.wait(1000)
            cy.reload()
            cy.contains('Your password has been successfully changed!').should('be.visible')
            cy.contains('Button', 'Back to Login').should('be.visible')
        })
    })
})