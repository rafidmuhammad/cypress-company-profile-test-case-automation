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
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles?locale=id&pagination[page]=1&pagination[pageSize]=5&filters[isHighlighted][$eq]=true`
            }, testData).as('article')
        })
        cy.fixture('TECHCORP/homepage/testDataForTestimonials.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/testimonials?locale=id&pagination[page]=1&pagination[pageSize]=10`
            }, testData).as('testimonials')
        })

        cy.fixture('TECHCORP/homepage/testDataForHero.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/homepage/hero?locale=id`
            }, testData).as('banner')
        })

        cy.visit('/')
    })

    it('should display video banner on homepage techcorp digital', () => {
        cy.wait('@banner').its('response.body.data').then((data) => {
            onADHomepage.checkVideoBanner()
        })
    })

    it('should User Navigate to the Homepage TechCorp Digital', () => {
        onHeaderBar.openBurgerMenuAD("id")
        onHeaderBar.openTechCorpDigitalMenu("id")
        onHeaderBar.navigateToBeranda("id")
    })

    it('should User navigate to our services page ', () => {
        onADHomepage.clickLayananKamiCard()
        onServicePage.validatePagePath()
    })

    it('should User navigate to article page', () => {
        cy.wait('@article').its('response.body.data').then((data) => {
            onADHomepage.clickArticleCard(data[0].attributes.slug)
            onArticleDetailPage.validatePagePath(data[0].attributes.slug)
        })
    })

    it('should User navigate to about us page ', () => {
        onADHomepage.clickTentangKamiCard()
        onAboutUsPage.validatePagePath()
    })

    it('should User navigate to portfolio page ', () => {
        onADHomepage.clickPortofolioCard()
        onPortofolioPage.validatePagePath()
    })

    it('should User navigate to masing-masing product page & acara', () => {
        onADHomepage.clickNatacara()
        onADHomepage.goBackFromNatacara()
        onADHomepage.clickTechSpace()
        onHomePage.validatePagePath()
    })

    it('should user can subscribe newsletter techcorpdigital', () => {
        onADHomepage.checkEmailSubscription()
        onADHomepage.fillEmailSubscription(randomEmail)
        onADHomepage.clickSubscribe()
        onADHomepage.checkSuccessModal("id")
        onADHomepage.closeModal()
    })
    it('should user not can submit email that already dikirimkan on subscription field newsletter ', () => {
        onADHomepage.checkEmailSubscription()
        onADHomepage.fillEmailSubscription(randomEmail)
        onADHomepage.clickSubscribe()
        onADHomepage.checkErrorModal("id")
        onADHomepage.closeModal()
    })

    it('should user not can enter invalid input on subscription field newsletter', () => {
        onADHomepage.fillEmailSubscription("testgmail.com")
        onADHomepage.checkEmailSubscriptionError("id")
        onADHomepage.fillEmailSubscription("@testgmail.com")
        onADHomepage.checkEmailSubscriptionError("id")
    })

    it('should display footer components', () => {
        onPageFooter.checkAllComponents("id")
    })

    it('should display testimonial components', () => {
        cy.wait('@testimonials').its('response.body.data').then((data) => {
            onADHomepage.checkTestimonials(data)
        })
    })

    it('should user will navigated to listing page artikel when click word "Artikel"', () => {
        onADHomepage.clikcArticle()
        onArticlePage.validatePagePath()
    })
})