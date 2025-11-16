const { onPageFooter } = require('../../../../../support/page_objects/pageFooter');
const { onADHomepage } = require('../../../../../support/page_objects/adHomepage');
const { onServicePage } = require('../../../../../support/page_objects/servicePage');
const { onAboutUsPage } = require('../../../../../support/page_objects/aboutUsPage');
const { onPortofolioPage } = require('../../../../../support/page_objects/portofolioPage');
const { onHeaderBar } = require('../../../../../support/page_objects/headerBar');
const { onNatacaraPage } = require('../../../../../support/page_objects/natacaraPage');
const { onHomePage } = require('../../../../../support/page_objects/homePage');
const faker = require('faker');
const { onArticleDetailPage } = require('../../../../../support/page_objects/articleDetailPage');
const { onArticlePage } = require('../../../../../support/page_objects/articlePage');


describe('When testing homepage,', () => {
    const randomEmail = faker.internet.email();

    beforeEach('open HomePage,', () => {
        cy.fixture('TECHCORP/homepage/testDataForArticle.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles?locale=en&pagination[page]=1&pagination[pageSize]=5&filters[isHighlighted][$eq]=true`
            }, testData).as('article')
        })
        cy.fixture('TECHCORP/homepage/testDataForTestimonials.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/testimonials?locale=en&pagination[page]=1&pagination[pageSize]=10`
            }, testData).as('testimonials')
        })

        cy.fixture('TECHCORP/homepage/testDataForHero.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/homepage/hero?locale=id`
            }, testData).as('banner')
        })

        cy.visit('/')
        cy.changeToEnglish(false, "AD")
    })

    it('should display video banner on homepage', () => {
        cy.wait('@banner').its('response.body.data').then((data) => {
            onADHomepage.checkVideoBanner()
        })
    })

    it('should navigate user to homepage', () => {
        onHeaderBar.openBurgerMenuAD("en")
        onHeaderBar.openTechCorpDigitalMenu("en")
        onHeaderBar.navigateToHomepage("en")
    })

    it('should navigate user to our services page', () => {
        onADHomepage.clickOurServicesCard()
        onServicePage.validatePagePath()
    })

    it('should navigate user to article page', () => {
        cy.wait('@article').its('response.body.data').then((data) => {
            onADHomepage.clickArticleCard(data[0].attributes.slug)
            onArticleDetailPage.validatePagePath(data[0].attributes.slug)
        })
    })

    it('should navigate user to about us page', () => {
        onADHomepage.clickAboutUsCard()
        onAboutUsPage.validatePagePath()
    })

    it('should navigate user to portfolio page', () => {
        onADHomepage.clickPortfolioCard()
        onPortofolioPage.validatePagePath()
    })

    it('should navigate user to product and event pages', () => {
        onADHomepage.clickPartnerSite()
        onADHomepage.goBackFromPartnerSite()
        onADHomepage.clickTechSpace()
        onHomePage.validatePagePath()
    })

    it('should allow user to subscribe to newsletter', () => {
        onADHomepage.checkEmailSubscription()
        onADHomepage.fillEmailSubscription(randomEmail)
        onADHomepage.clickSubscribe()
        onADHomepage.checkSuccessModal("en")
        onADHomepage.closeModal()
    })

    it('should not allow user to submit already subscribed email in newsletter field', () => {
        onADHomepage.checkEmailSubscription()
        onADHomepage.fillEmailSubscription(randomEmail)
        onADHomepage.clickSubscribe()
        onADHomepage.checkErrorModal("en")
        onADHomepage.closeModal()
    })

    it('should not allow user to enter invalid input in newsletter subscription field', () => {
        onADHomepage.fillEmailSubscription("testgmail.com")
        onADHomepage.checkEmailSubscriptionError("en")
        onADHomepage.fillEmailSubscription("@testgmail.com")
        onADHomepage.checkEmailSubscriptionError("en")
    })

    it('should display footer components', () => {
        onPageFooter.checkAllComponents("en")
    })

    it('should display testimonial components', () => {
        cy.wait('@testimonials').its('response.body.data').then((data) => {
            onADHomepage.checkTestimonials(data)
        })
    })

    it('should navigate user to article listing page when clicking "Article"', () => {
        onADHomepage.clickArticle()
        onArticlePage.validatePagePath()
    })
})