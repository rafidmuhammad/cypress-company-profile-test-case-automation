export class LoginPage {
    checkAllElement(shouldRegister = false) {
        cy.contains('Login').should('be.visible')
        cy.get('#email').should('be.visible')
        cy.get('#password').should('be.visible')
        cy.get('#forgotPassword').should('be.visible')
        if (shouldRegister) {
            cy.get('#createAccount').should('be.visible').and('contain', 'Sign up now')
        }
        cy.get('#next').should('be.visible').and('contain', 'Sign in')
        cy.get('#background_background_image').should('be.exist')
    }

    submitWithEmailandPassword(username, password) {
        cy.get('#email').should('be.visible').type(username)
        cy.get('#password').should('be.visible').type(password)
        cy.get('#next').click()
    }

    submitWithEmptyFields() {
        cy.get('#email').should('be.visible')
        cy.get('#password').should('be.visible')
        cy.get('#next').click()
    }

    clickForgotPassword() {
        cy.get('#forgotPassword').click()
    }
}

export const onLoginPage = new LoginPage()