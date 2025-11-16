const { onPageFooter } = require('../../../../../support/page_objects/pageFooter');
const { onAboutUsPage } = require('../../../../../support/page_objects/aboutUsPage');

describe('When testing about us page,', () => {


    beforeEach('open About Us Page,', () => {
        cy.fixture('TECHCORP/aboutUs/testDataForAboutUs.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/about-us`
            }, testData).as('aboutUs')
        })
        cy.visit('/about')
    })

    it('should display video banner on about us page', () => {
        onAboutUsPage.checkVideoBanner()
    })

    it('should display page title and description on about us page', () => {
        cy.wait('@aboutUs').its('response.body.data').then((data) => {
            onAboutUsPage.checkTitle(data, "id")
            onAboutUsPage.checkDesc(data, "id")
            onAboutUsPage.checkLogo()
        })
    })

    it('should display our core values on about us page', () => {
        cy.fixture('TECHCORP/aboutUs/testDataForAboutUs.json').then(testData => {
            testData.data.attributes.ourCoreValues.pop()
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/about-us`
            }, testData).as('aboutUsCVLT3')
        })
        cy.reload()
        cy.wait('@aboutUsCVLT3').its('response.body.data').then((data) => {
            onAboutUsPage.checkCoreValues(data, 'id')
        })
    })

    it('should display core values on next page when there are more than 3 values', () => {
        cy.wait('@aboutUs').its('response.body.data').then((data) => {
            onAboutUsPage.clickNextArrowCoreValues()
            onAboutUsPage.checkCoreValuesNextPage(data, 'id')
        })
    })

    it('should display company leaders on about us page when less than 7', () => {
        onAboutUsPage.checkLeaderTitle('id')
        cy.fixture('TECHCORP/aboutUs/testDataForAboutUs.json').then(testData => {
            testData.data.attributes.boardOfDirectors.pop()
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/about-us`
            }, testData).as('aboutUsLT7')
        })
        cy.reload()
        cy.wait('@aboutUsLT7').its('response.body.data').then((data) => {
            onAboutUsPage.checkLeader(data)
        }
        )
    })

    it('should display company leaders on next page when there are more than 6 leaders', () => {
        onAboutUsPage.checkLeaderTitle('id')
        cy.wait('@aboutUs').its('response.body.data').then((data) => {
            onAboutUsPage.clickNextArrowLeaderSection()
            onAboutUsPage.checkLeaderNextPage(data)
        }
        )
    })


    it('should display contact us section on about us page', () => {
        onAboutUsPage.checkForMoreInformation('id')
    })

    it('should display footer components on about us page', () => {
        onPageFooter.checkAllComponents("id")
    })
})