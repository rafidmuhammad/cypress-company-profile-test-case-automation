const { onPastEventPage } = require('../../../../../support/page_objects/pastEventPage');

describe('When testing past event page', () => {

    beforeEach('Navigate to terms and condition page', () => {
        cy.visit('techspace_past')
    })

    it('User successfully mengunjungi page "Past Event"', () => {
        onPastEventPage.validatePagePath()
        onPastEventPage.validatePageContent('id')
        onPastEventPage.checkVideo()
    })

    it('Berhasil masuk to detail page past event 2022', () => {
        cy.fixture('WEB/pastEvent/testDataForPastEvent2022.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/past-events?filters[year][$eqi]=2022&locale=id`
            }, testData.id).as('pastEvent2022')
        })
        onPastEventPage.NavigateToTechSpace2022()
        cy.wait(1000)
        cy.reload()
        cy.wait(1000)
        cy.wait('@pastEvent2022').its('response.body').then((testData) => {
            onPastEventPage.detailYearCheckElement(testData)
        })
    })

    it('Berhasil masuk to detail page past event 2023', () => {
        cy.fixture('WEB/pastEvent/testDataForPastEvent2023.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/past-events?filters[year][$eqi]=2023&locale=id`
            }, testData.id).as('pastEvent2023')
        })
        onPastEventPage.NavigateToTechSpace2023()
        cy.wait(1000)
        cy.reload()
        cy.wait(1000)
        cy.wait('@pastEvent2023').its('response.body').then((testData) => {
            onPastEventPage.detailYearCheckElement(testData)
        })
    })
})