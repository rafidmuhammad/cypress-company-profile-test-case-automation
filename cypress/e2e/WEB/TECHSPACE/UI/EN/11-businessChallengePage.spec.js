const { onPageFooter } = require('../../../../../support/page_objects/pageFooter');
const { onBusinessChallengePage } = require('../../../../../support/page_objects/businessChallengePage');
const { onHomePage } = require('../../../../../support/page_objects/homePage');
const { getNewValidEventDate, getNewInvalidEventDate, getNewInvalidEventDateBeforeRegistration,
    getNewInvalidEventDateAfterProposal, getNewValidEventDateOnlyInRegistration, getNewValidEventDateOnlyInProposal } = require('../../../../../support/helper/getNewEventDate');
const { onRegisterEventPage } = require('../../../../../support/page_objects/registerEventPage');

describe('When testing business challenge, ', () => {

    beforeEach(() => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/business-challenges`
        },
            { fixture: 'WEB/businessChallenge/testDataForBusinessChallenge.json' }).as('businessChallenge')
        cy.visit('business-challenge')
        cy.changeToEnglish(false, "AN")
    })

    it('User successfully akses page Business Challange', () => {
        cy.openHomepage()
        onHomePage.clickJalurKompetisi('en')
        onHomePage.clickDetailBusinessChallenge('en')
        onBusinessChallengePage.checkPagePath()
    })


    it('should User can View Section Contact Us in page Busines Challenge', () => {
        onBusinessChallengePage.checkForMoreInformation('en')
    })

    it('should user shown komponen-footer components', () => {
        onPageFooter.checkAllComponents('en')
    })

    it('should User in arahkan to Section Current Business Challenge when Click Header Current Business Challenge', () => {
        cy.wait('@businessChallenge').its('response.body.data').then(data => {
            onBusinessChallengePage.clickBusinessChallenge('en')
            onBusinessChallengePage.checkCurrentBusinessChallenge(data, 0)
        })

    })

    it('should User in arahkan to Section Expected Solution when Click Header Expected Solution', () => {
        cy.wait('@businessChallenge').its('response.body.data').then(data => {
            onBusinessChallengePage.clickExpectedSolution('en')
            onBusinessChallengePage.checkExpectedSolution(data, 0)
        })
    })

    it('should User can merubah Company on Business Challenge', () => {
        cy.wait('@businessChallenge').its('response.body.data').then(data => {
            onBusinessChallengePage.clickCompanyFromTab(data.length - 1)
            onBusinessChallengePage.checkBreadCrumbs(data.length - 1)
        })
    })

    it('should User Navigate To page Login when Click Button Submit Disini with kondisi user not logged in with waktu pendaftaran masih dibuka', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewValidEventDateOnlyInRegistration()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)

        cy.wait('@scopedSetting').then((xhr) => {
            onBusinessChallengePage.clickSubmit()
            cy.origin(`${Cypress.env('B2C_URL')}`, () => {
                const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
                onLoginPage.checkAllElement(true)
            })
        })

    })

    it('should User Navigate To page Login when Click Button Submit Disini with kondisi user not logged in with not dalam waktu pendaftaran', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewValidEventDateOnlyInProposal()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            onBusinessChallengePage.clickSubmit()
            cy.origin(`${Cypress.env('B2C_URL')}`, () => {
                const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
                onLoginPage.checkAllElement(false)
            })
        })
    })

    it('should User Navigate To page Submission Form when Click Button Submit Disini with kondisi user already login and Pendaftaran proposal masih dibuka', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewValidEventDateOnlyInProposal()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.LoginToTechSpace('en')
        cy.visit('business-challenge')
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            onBusinessChallengePage.clickSubmit()
            onRegisterEventPage.validateThePath()
        })
    })

    it('should user mendapatkan Popup Pendafataran ditutup when Click Button Submit Disini with kondisi user already login and waktu pendaftaran Proposal already in tutup', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewInvalidEventDateAfterProposal()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.LoginToTechSpace('en')
        cy.visit('business-challenge')
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            onBusinessChallengePage.clickSubmit()
            onBusinessChallengePage.checkModalPendaftaranTutup('en')
            onBusinessChallengePage.clickCloseModal()
        })
    })



})