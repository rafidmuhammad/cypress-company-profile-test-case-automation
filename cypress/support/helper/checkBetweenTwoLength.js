function hasDifferentLengthFields(element, inputData, requirement) {
    cy.get(`[data-cy=${element}]`).clear()
    cy.get(`[data-cy=${element}]`).type(inputData)

    cy.get(`[data-cy=${element}]`).invoke('attr', 'value').then(input => {
        cy.wrap(input.length).should('not.equal', inputData.length)
        cy.wrap(input.length).should('equal', requirement)
    })
}

function hasDifferentLengthTextArea(element, inputData, requirement) {
    cy.get(`[data-cy=${element}]`).clear()
    cy.get(`[data-cy=${element}]`).type(inputData)

    cy.get(`[data-cy=${element}]`).invoke('text').then(input => {
        cy.wrap(input.length).should('not.equal', inputData.length)
        cy.wrap(input.length).should('equal', requirement)
    })
}

module.exports = { hasDifferentLengthFields, hasDifferentLengthTextArea }