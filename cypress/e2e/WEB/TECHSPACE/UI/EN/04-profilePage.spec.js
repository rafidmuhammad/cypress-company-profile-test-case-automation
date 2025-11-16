const { onProfilePage } = require('../../../../../support/page_objects/profilePage');
const { onHomePage } = require('../../../../../support/page_objects/homePage');
const { isWithinProposalRange, isWithinRegistrationRange } = require('../../../../../support/helper/isWithinTimeRange');
const { adjustTimeSetting } = require('../../../../../support/helper/adjustTimeSetting');
const { getNewValidEventDate, getNewInvalidEventDate } = require('../../../../../support/helper/getNewEventDate');
const { onRegisterEventPage } = require('../../../../../support/page_objects/registerEventPage');
const { onHeaderBar } = require('../../../../../support/page_objects/headerBar');
import { deleteSubmissionFromUserWhenExist } from '../../../../../support/helper/deleteSubmission';

describe("When testing profile page, ", () => {
    let previousOpenProposal
    let previousCloseProposal
    let previousOpenRegistration
    let previousCloseRegistration

    before('Store current setting', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspace/setting`,
        }).then(response => {
            previousOpenRegistration = response.body.data.attributes.openRegistration
            previousCloseRegistration = response.body.data.attributes.closeRegistration
            previousOpenProposal = response.body.data.attributes.openProposal
            previousCloseProposal = response.body.data.attributes.closeProposal
        })
    })

    beforeEach('Navigate to the profile page', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }).as('setting')

        cy.openHomepage()
        cy.LoginToTechSpace("id")
        deleteSubmissionFromUserWhenExist()
        cy.changeToEnglish(true, "AN")
        onHeaderBar.openBurgerMenu(true, "en")
        onHeaderBar.clickAkunSaya("en")

    })

    it('User successfully navigates to profile', () => {
        onProfilePage.checkPageContent("en")
    })

    it('User successfully edits team leader name', () => {
        onProfilePage.clickEdit()
        onProfilePage.fillInName()
        onProfilePage.clickSimpan("en")
    })

    it('User successfully navigates to the pengisian Formulir Pengajuan when pendaftaran techspace sedang dibuka', () => {
        cy.wait('@setting').its('response.body').then(obj => {
            if (!isWithinProposalRange(obj)) {
                const newDates = getNewValidEventDate()
                adjustTimeSetting(newDates)
            }
            onProfilePage.clickFormulirPengajuan()
            onProfilePage.clickIsiFormulir('en')
            onRegisterEventPage.validateThePath()
        })
    })

    it('User successfully navigates to the pengisian Formulir Pengajuan when user not yet selesai mengisi formulir pengajuan', () => {
        cy.wait('@setting').its('response.body').then(obj => {
            if (!isWithinProposalRange(obj)) {
                const newDates = getNewValidEventDate()
                adjustTimeSetting(newDates)
            }
            onProfilePage.clickFormulirPengajuan()
            onProfilePage.clickIsiFormulir('en')
            onRegisterEventPage.clickSimpan('en')
            onRegisterEventPage.clickKembaliKeProfil('en')
            onProfilePage.clickFormulirPengajuan()
            onProfilePage.clickLengkapiFormulir('en')
            onRegisterEventPage.validateThePath()
        })
    })

    it('User successfully accesses the page formulir pengajuan to memperbarui data', () => {
        cy.wait('@setting').its('response.body').then(obj => {
            if (!isWithinProposalRange(obj)) {
                const newDates = getNewValidEventDate()
                adjustTimeSetting(newDates)
            }
            onProfilePage.clickFormulirPengajuan()
            onProfilePage.clickIsiFormulir('en')
            onRegisterEventPage.isiInformasiTim('en')
            onRegisterEventPage.clickInformasiInovasi('en')
            onRegisterEventPage.isiInformasiInovasi('en')
            onRegisterEventPage.uploadFile('cypress/fixtures/WEB/registerEvent/validFile.pdf')
            onRegisterEventPage.clickDaftar()
            onRegisterEventPage.clickKembaliKeProfil('en')
            onProfilePage.clickFormulirPengajuan()
            onProfilePage.clickPerbaruiData('en')
            onRegisterEventPage.validateThePath()
        })
    })

    it('should user navigated to the forgot password', () => {
        onProfilePage.clickKataSandi("en")
        onProfilePage.clickUbahKataSandi("en")

        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onForgotPasswordPage } = Cypress.require('../../../../../support/page_objects/forgotPasswordPage')
            onForgotPasswordPage.checkAllElement()
        })
    })

    it('should user successfully keluar/logout', () => {
        onProfilePage.clickKeluar('en')
        onProfilePage.confirmKeluar('en')
        cy.wait(1000)
        cy.reload()
        onHomePage.checkUrl()
        onHomePage.checkBannerButtonCondition(false, "en")
    })

    it('should user will be shown bahwa pendaftaran already ditutup', () => {
        cy.wait('@setting').its('response.body').then(obj => {
            if (isWithinProposalRange(obj)) {
                const newDates = getNewInvalidEventDate()
                adjustTimeSetting(newDates)
            }
            onProfilePage.clickFormulirPengajuan()
            cy.reload()
            onProfilePage.validatePendaftaranDitutup()
        })
    })

    after('Rollback to previous setting', () => {
        const rollbackSetting = {
            openRegistration: previousOpenRegistration,
            closeRegistration: previousCloseRegistration,
            openProposal: previousOpenProposal,
            closeProposal: previousCloseProposal,
        }
        adjustTimeSetting(rollbackSetting)
    })
})