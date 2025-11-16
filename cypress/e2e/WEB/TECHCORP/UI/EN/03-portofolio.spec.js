const { onPageFooter } = require('../../../../../support/page_objects/pageFooter');
const { onPortofolioPage } = require('../../../../../support/page_objects/portofolioPage');
const { onPortofolioDetailPage } = require('../../../../../support/page_objects/portofolioDetailPage');

describe('When testing portofolio page,', () => {


    beforeEach('open portofolio Page,', () => {
        cy.fixture('TECHCORP/portofolio/testDataForPortfolio.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/portofolios?locale=en&pageSize=100`
            }, testData.portfolios).as('portofolios')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/portofolios?locale=en&pageSize=100&data=all`
            }, testData.allCategory).as('allCategory')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/portofolios/techcorp-digital-c-level-masterclass?locale=en`
            }, testData.portoDetail).as('portoDetail')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/other-portofolios/techcorp-digital-c-level-masterclass?locale=en`
            }, testData.otherPorto).as('otherPortos')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/portofolios/digi-talk?locale=en`
            }, testData.portoDetail2).as('portoDetail2')
        })
        cy.visit('/portfolio')
        cy.changeToEnglish(false, "AD")
    })

    it('should display video banner on portfolio page', () => {
        onPortofolioPage.checkVideoBanner()
    })

    it('should display komponen filter portoflio on portfolio page', () => {
        cy.wait('@portofolios').its('response.body.data').then(data => {
            onPortofolioPage.checkTabbing(data, "en")
        })
    })

    it('should display komponen card on portfolio page', () => {
        cy.wait('@allCategory').its('response.body.data').then(data => {
            const slicedData = data.slice(0, 12)
            onPortofolioPage.checkCard(slicedData, "en", 1)
        })
    })

    it('should displayed card portofolio on the lain', () => {
        cy.wait('@allCategory').its('response.body.data').then(data => {
            const slicedData = data.slice(12, 24)
            onPortofolioPage.clickNextArrowPortoList()
            onPortofolioPage.checkCard(slicedData, "en", 2)
        })
    })

    it('should displayed card portofolio on kategori lain', () => {
        cy.wait('@portofolios').its('response.body.data').then(data => {
            const slicedData = data[0].attributes.techcorpPortfolio.slice(0, 12)
            onPortofolioPage.clickOtherTab()
            onPortofolioPage.checkCardOtherTab(slicedData, "en")
        })
    })

    it('should user navigated to the page detil portofolio', () => {
        cy.wait('@allCategory').its('response.body.data').then(data => {
            onPortofolioPage.navigateToDetail("en")
            cy.wait(1000)
            cy.reload()
            cy.wait('@portoDetail').its('response.body.data').then(dataDetail => {
                onPortofolioDetailPage.checkDetailPage(dataDetail, "en")
            })
        })
    })

    it('should User can View Section Contact Us in portofolio and detil portofolio', () => {
        cy.wait('@allCategory').its('response.body.data').then(data => {
            onPortofolioPage.checkForMoreInformation('en')
            onPortofolioPage.navigateToDetail("en")
            cy.wait(1000)
            cy.reload()
            cy.wait('@portoDetail').its('response.body.data').then(() => {
                onPortofolioDetailPage.checkForMoreInformation("en")
            })
        })
    })

    it('should user navigated to the page detil portofolio from page detil portofolio lain', () => {
        cy.wait('@allCategory').its('response.body.data').then(data => {
            onPortofolioPage.navigateToDetail("en")
            cy.wait(1000)
            cy.reload()
            cy.wait(['@portoDetail', '@otherPortos']).then((interceptions) => {
                onPortofolioDetailPage.clickOtherPortoCards("en")
                cy.wait('@portoDetail2').its('response.body.data').then((dataDetail2) => {
                    onPortofolioDetailPage.checkDetailPage(dataDetail2, "en")
                })
            })
        })

    })

    it('should user shown komponen-footer components on the portfolio', () => {
        cy.wait('@allCategory').its('response.body.data').then(data => {
            onPageFooter.checkAllComponents("en")
            onPortofolioPage.navigateToDetail("en")
            cy.wait(1000)
            cy.reload()
            cy.wait('@portoDetail').its('response.body.data').then(() => {
                onPageFooter.checkAllComponents("en")
            })
        })
    })

    it('should user navigated to the page web from detil portofolio', () => {
        cy.wait('@allCategory').its('response.body.data').then(data => {
            onPortofolioPage.navigateToDetail("en")
            cy.wait(1000)
            cy.reload()
            cy.wait('@portoDetail').its('response.body.data').then(dataDetail => {
                onPortofolioDetailPage.clickVisitWebsite()
                onPortofolioDetailPage.validateWebsiteUrl(dataDetail)
            })
        })
    })

    it('should button kunjungi website not appear when portofolio not memiliki url website', () => {
        cy.fixture('TECHCORP/portofolio/testDataForPortfolio.json').then(testData => {
            testData.portoDetail.data.websiteUrl = null
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/portofolios/techcorp-digital-c-level-masterclass?locale=id`
            }, testData.portoDetail).as('portoDetail')
        })

        cy.wait('@allCategory').its('response.body.data').then(data => {
            onPortofolioPage.navigateToDetail("en")
            cy.wait(1000)
            cy.reload()
            cy.wait('@portoDetail').its('response.body.data').then(dataDetail => {
                onPortofolioDetailPage.validateHiddenWebsiteButton()
            })
        })
    })
})