export class ForgotPasswordPage {
    checkAllElement() {
        cy.contains('Forgot Password').should('be.visible')
        cy.get('#email').should('be.visible')
        cy.get('#emailVerificationControl_but_send_code').should('be.visible')
        cy.get('#continue').should('be.visible')
        cy.get('#background_background_image').should('be.exist')
    }

    sendVerificationCode() {
        cy.get('.sendCode').click()
    }

    fillInTheField(field, input) {
        cy.get(`#${field}`, { timeout: 10000 }).clear()
        cy.get(`#${field}`).type(input)
    }

    pressTheButton(button) {
        cy.get(`#${button}`).click()
    }

    submitForm() {
        cy.get('form').submit()
    }
}

export const onForgotPasswordPage = new ForgotPasswordPage()