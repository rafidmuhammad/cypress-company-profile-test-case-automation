export class RegisterAccountPage {
    checkAllElement() {
        cy.contains('Registration').should('be.visible')
        cy.get('#email').should('be.visible')
        cy.get('#emailVerificationControl_but_send_code').should('contain', 'Send verification code').and('be.visible')
        cy.get('#newPassword').should('be.visible')
        cy.get('#reenterPassword').should('be.visible')
        cy.get('#givenName').should('be.visible')
        cy.get('#continue').should('be.visible').and('contain', 'Create').invoke('attr', 'aria-disabled', "true")
        cy.get('#background_background_image').should('be.exist')
    }

    fillInTheField(field, input) {
        cy.get(`#${field}`).type(input)
    }

    checkInvalidEmail() {
        cy.contains('Please enter a valid email address.').should('be.visible')
    }

    sendVerificationCode() {
        cy.get('.sendCode').click()
    }

    pressTheButton(button) {
        cy.get(`#${button}`).click()
    }

    clearField(field) {
        cy.get(`#${field}`).clear()
    }

    checkPasswordFormat() {
        cy.contains('The password must have at least 4 of the following:').should('be.visible')
        cy.contains('- a lowercase letter').should('be.visible')
        cy.contains('- an uppercase letter').should('be.visible')
        cy.contains('- a digit').should('be.visible')
        cy.contains('- a symbol').should('be.visible')
    }
}

export const onRegisterAccountPage = new RegisterAccountPage()